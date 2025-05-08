const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { OpenAI } = require("openai");
require("dotenv").config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));

app.post("/classify", async (req, res) => {
  const { emails, openaiApiKey } = req.body;

  if (!emails || !openaiApiKey) {
    return res.status(400).json({ message: "Missing data" });
  }

  const openai = new OpenAI({ apiKey: openaiApiKey });

  try {
    const emailText = emails
      .map(
        (email, i) =>
          `Email ${i + 1}:\nSubject: ${
            email.payload?.headers?.find((h) => h.name === "Subject")?.value || ""
          }\nSnippet: ${email.snippet}`
      )
      .join("\n\n");

    const prompt = `
You are an email classification assistant. Classify each email into one of these categories:
- Important (work/personal & urgent)
- Promotional (sales, discounts, offers)
- Social (from friends, family, social media)
- Marketing (newsletters, brand content)
- Spam (unwanted/junk)
- General (uncategorized)

Give the result in this format: 
[
  { "subject": "...", "category": "..." },
  ...
]

Emails:
${emailText}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });

    const result = response.choices[0].message.content;
    JSON.parse(result); 
    console.log("OpenAI result:\n", result);
    res.json({ result });
  } catch (err) {
    console.error("OpenAI error:", err.message);
    res.status(500).json({ error: "OpenAI classification failed" });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


