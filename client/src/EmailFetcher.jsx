import React, { useState, useEffect } from "react";

const EmailFetcher = () => {
  const [emails, setEmails] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState(localStorage.getItem("gemini_api_key") || "");
  const [classifiedEmails, setClassifiedEmails] = useState([]);

  useEffect(() => {
    const savedEmails = localStorage.getItem("emails");
    if (savedEmails) {
      setEmails(JSON.parse(savedEmails));
    }
  }, []);

  const handleApiKeySave = () => {
    localStorage.setItem("gemini_api_key", geminiApiKey);
    alert("Gemini API Key saved!");
  };

  const fetchEmails = async () => {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: "489217701387-6tf3k977lmp1bhpvv7i3kc7c05g8clch.apps.googleusercontent.com",
      scope: "https://www.googleapis.com/auth/gmail.readonly",
      callback: async (tokenResponse) => {
        const accessToken = tokenResponse.access_token;
        setIsAuthenticated(true);

        try {
          const listRes = await fetch(
            "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=15",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          const listData = await listRes.json();
          const messages = listData.messages || [];

          const emailPromises = messages.map((msg) =>
            fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }).then((res) => res.json())
          );

          const fullEmails = await Promise.all(emailPromises);
          setEmails(fullEmails);
          localStorage.setItem("emails", JSON.stringify(fullEmails));
        } catch (error) {
          console.error("Error fetching emails:", error.message);
        }
      },
    });

    client.requestAccessToken();
  };

  const classifyEmails = async () => {
    if (!geminiApiKey) {
      alert("Please enter your Gemini API key first.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/classify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emails, geminiApiKey }),
      });

      const data = await response.json();
      // const parsed = JSON.parse(data.result);
      setClassifiedEmails(data.result);
      console.log("Classified Emails:", data.result); 
    } catch (err) {
      console.error("Classification failed:", err);
      alert("Classification failed. Check the console.");
    }
  };

  return (
    <div className="mt-4 w-full max-w-3xl">
      <div className="mb-4">
        <input
          type="password"
          className="p-2 border rounded w-full"
          placeholder="Enter your Gemini API Key"
          value={geminiApiKey}
          onChange={(e) => setGeminiApiKey(e.target.value)}
        />
        <button
          className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={handleApiKeySave}
        >
          Save API Key
        </button>
      </div>

      <button
        onClick={fetchEmails}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {isAuthenticated ? "Refetch Emails" : "Sign in & Fetch Emails"}
      </button>

      <button
        onClick={classifyEmails}
        className="ml-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
      >
        Classify Emails
      </button>

      <div className="mt-6">
        {classifiedEmails.length > 0 && (
          <>
            <h2 className="text-xl font-bold mb-2">Classified Emails:</h2>
            <ul className="text-left">
              {classifiedEmails.map((item, index) => (
                <li key={index} className="mb-2 p-3 border rounded bg-gray-100">
                  <p><strong>Subject:</strong> {item.subject}</p>
                  <p><strong>Category:</strong> {item.category}</p>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailFetcher;
