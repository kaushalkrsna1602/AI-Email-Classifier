import React, { useState } from "react";

const EmailFetcher = () => {
  const [emails, setEmails] = useState([]);

  const fetchEmails = async () => {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: "489217701387-6tf3k977lmp1bhpvv7i3kc7c05g8clch.apps.googleusercontent.com",
      scope: "https://www.googleapis.com/auth/gmail.readonly",
      callback: async (tokenResponse) => {
        const accessToken = tokenResponse.access_token;
        console.log("Access Token:", accessToken);

        // Get email message IDs
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

        // Fetch email details for each message
        const emailPromises = messages.map((msg) =>
          fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          ).then((res) => res.json())
        );

        const fullEmails = await Promise.all(emailPromises);
        setEmails(fullEmails);
        localStorage.setItem("emails", JSON.stringify(fullEmails));
      },
    });

    client.requestAccessToken();
  };

  return (
    <div className="mt-4">
      <button
        onClick={fetchEmails}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Fetch My Emails
      </button>

      <ul className="mt-4 text-left max-w-xl mx-auto">
        {emails.map((email, index) => (
          <li key={index} className="border p-2 mb-2 rounded bg-gray-100">
            <p><strong>Subject:</strong> {email.payload?.headers?.find(h => h.name === 'Subject')?.value}</p>
            <p><strong>From:</strong> {email.payload?.headers?.find(h => h.name === 'From')?.value}</p>
            <p><strong>Snippet:</strong> {email.snippet}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmailFetcher;

