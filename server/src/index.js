const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json({ limit: "5mb" }));

app.post("/classify", async (req, res) => {
  const { emails, geminiApiKey } = req.body;

  if (!emails || !geminiApiKey) {
    return res.status(400).json({ message: "Missing data" });
  }

  const emailText = emails
    .map(
      (email, i) =>
        `Email ${i + 1}:\nSubject: ${
          email.payload?.headers?.find((h) => h.name === "Subject")?.value || ""
        }\nSnippet: ${email.snippet}`
    )
    .join("\n\n");

  const prompt = `
You are an email classification assistant.

Classify each email into one of these categories:
- Important (work/personal & urgent)
- Promotional (sales, discounts, offers)
- Social (from friends, family, social media)
- Marketing (newsletters, brand content)
- Spam (unwanted/junk)
- General (uncategorized)

Return ONLY raw JSON in this format (do NOT include markdown, explanations, or comments):
[
  { "subject": "Sample subject", "category": "Important" },
  ...
]

Emails:
${emailText}
`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      }
    );

    let text = response.data.candidates[0]?.content?.parts[0]?.text || "";
    text = text.replace(/\\n/g, "\n").trim();

    // Remove Markdown code blocks if present
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (codeBlockMatch) {
      text = codeBlockMatch[1].trim();
    }

    // Attempt to parse JSON
    let parsed;
    try {
      parsed = JSON.parse(text);
      console.log("Gemini result:\n", parsed);
      res.json({ result: parsed });
    } catch (err) {
      console.error("JSON parsing failed:", err.message);
      res.status(500).json({ error: "Invalid JSON from Gemini", raw: text });
    }
  } catch (error) {
    console.error("Gemini API error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Gemini classification failed" });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
