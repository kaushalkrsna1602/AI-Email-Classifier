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
  const fetchEmails = async (max) => {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: "489217701387-6tf3k977lmp1bhpvv7i3kc7c05g8clch.apps.googleusercontent.com",
      scope: "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/userinfo.profile",
      callback: async (tokenResponse) => {
        const accessToken = tokenResponse.access_token;

        //Fetch user info from Google
        try {
          const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const userInfo = await userInfoRes.json();
          const { email, name , picture } = userInfo;

          const credentials = {
            name: name,
            email: email,
            picture: picture,
            token: accessToken,
          };

          localStorage.setItem("googleCredentials", JSON.stringify(credentials));
          console.log("User info:", credentials);

          // Fetch emails
          const listRes = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${max || 15}`,
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
          localStorage.setItem("emails", JSON.stringify(fullEmails));
          // console.log("Fetched emails:", fullEmails);
          navigate("/emails");

        } catch (err) {
          console.error("Error fetching user info or emails:", err);
        }
      },
    });

    client.requestAccessToken();
  };

  return (
  <div className="flex items-center justify-center min-h-screen px-4">
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-center">Welcome to AI Emali Classifier</h2>

      <input
        type="password"
        placeholder="Enter Gemini API Key"
        className="p-2 border rounded w-full mb-4 text-sm"
        value={geminiApiKey}
        onChange={(e) => setGeminiApiKey(e.target.value)}
      />

      <button
        onClick={handleApiKeySave}
        className="w-full border text-black py-2 mb-3 rounded hover:bg-black hover:text-white text-sm transition"
      >
        Save API Key
      </button>

      <button
        onClick={() => fetchEmails(15)}
        className="w-full border text-black py-2 rounded hover:bg-black hover:text-white text-sm transition"
      >
        Login with Google
      </button>
    </div>
  </div>
);
};

export default Home;
