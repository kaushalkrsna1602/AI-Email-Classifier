import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [geminiApiKey, setGeminiApiKey] = useState(localStorage.getItem("gemini_api_key") || "");
  const navigate = useNavigate();

  // Function to handle saving the Gemini API key
  const handleApiKeySave = () => {
    if (!geminiApiKey) {
      alert("Enter your Gemini API Key first.");
      return;
    }

    localStorage.setItem("gemini_api_key", geminiApiKey);
    alert("API key saved!");
  };


  // Function to fetch emails from Gmail API
  // This function initializes the Google OAuth2 client and requests an access token
const fetchEmails = async (max) => {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: import.meta.env.GOOGLE_CLIENT_ID,
      scope: "https://www.googleapis.com/auth/gmail.readonly",
      callback: async (tokenResponse) => {
        const accessToken = tokenResponse.access_token;

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

          // Fetch full email details for each message 
          const emailPromises = messages.map((msg) =>
            fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }).then((res) => res.json())
          );

          // Wait for all email details to be fetched
          // and store them in local storage
          const fullEmails = await Promise.all(emailPromises);
          localStorage.setItem("emails", JSON.stringify(fullEmails));
          console.log("Fetched emails:", fullEmails); 
          navigate("/emails");
        } catch (err) {
          console.error("Error fetching emails:", err);
        }
      },
    });

    client.requestAccessToken();
  };


 return (
    <div className="flex items-center justify-center min-h-screen">
    <div className="max-w-md mx-auto mt-10">
      <input
        type="password"
        placeholder="Enter Gemini API Key"
        className="p-2 border rounded w-full mb-4"
        value={geminiApiKey}
        onChange={(e) => setGeminiApiKey(e.target.value)}
      />
      <button
        onClick={handleApiKeySave}
        className="w-full border text-black py-2 mb-2 rounded hover:bg-black hover:text-white"
      >
        Save API Key
      </button>

      <button
        onClick={fetchEmails} 
        className="w-full border text-black py-2 mb-2 rounded hover:bg-black hover:text-white"
      >
        Login with Google
        
      </button>
    </div>
    </div>
  );
};

export default Home;