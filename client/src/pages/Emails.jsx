import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import EmailListItem from "../components/EmailListItem";
import { BASE_URL } from "../utils/emailUtils";

const Emails = () => {
  const [emails, setEmails] = useState([]);
  const [classifiedEmails, setClassifiedEmails] = useState([]);
  const [expandedEmailId, setExpandedEmailId] = useState(null);
  const [geminiApiKey, setGeminiApiKey] = useState(localStorage.getItem("gemini_api_key") || "");   //getting gemini api key from local storage 
  const [isClassifying, setIsClassifying] = useState(false);
  const [classificationError, setClassificationError] = useState(null);
  const [emailCount, setEmailCount] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPic, setUserPic] = useState("");

  const navigate = useNavigate();

  // Fetch emails from local storage 
  useEffect(() => {
    const savedCreds = localStorage.getItem("googleCredentials");

    if (savedCreds) {
      const creds = JSON.parse(savedCreds);
      setUserName(creds.name || "");
      setUserEmail(creds.email || "");
      setUserPic(creds.picture || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4YreOWfDX3kK-QLAbAL4ufCPc84ol2MA8Xg&s");
    }
  }, []);

  //function for logout 
  const logout = () => {
    localStorage.removeItem("gemini_api_key");
    localStorage.removeItem("emails");
    localStorage.removeItem("user_email");
    localStorage.removeItem("googleCredentials");
    navigate("/");
  };

  const handleToggleExpand = useCallback((index) => {
    setExpandedEmailId((prevId) => (prevId === index ? null : index));
  }, []);

  // funtion to classify emails 
  const classifyEmails = useCallback(async () => {
    if (!geminiApiKey) {
      alert("Gemini API Key missing.");
      return;
    }

    setIsClassifying(true);
    setClassificationError(null);

    try {
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails, geminiApiKey }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Classification failed:", errorData);
        setClassificationError("Failed to classify emails. Please check the console.");
        return;
      }

      const data = await response.json();
      setClassifiedEmails(data.result);
    } catch (err) {
      console.error("Classification failed:", err);
      setClassificationError("Unexpected error during classification.");
    } finally {
      setIsClassifying(false);
    }
  }, [emails, geminiApiKey]);

  // Function to handle email count change 
  const handleEmailCountChange = (e) => {
    const count = parseInt(e.target.value, 10);
    if (!isNaN(count)) {
      const savedEmails = JSON.parse(localStorage.getItem("emails")) || [];
      const slicedEmails = savedEmails.slice(0, count);

      setEmails(slicedEmails);
      setClassifiedEmails([]);
      setExpandedEmailId(null);
      setEmailCount(count);
    }
  };

  const emailsToDisplay = classifiedEmails.length > 0 ? classifiedEmails : emails;
  const isClassified = classifiedEmails.length > 0;

return (
  <div className="max-w-5xl mx-auto mt-6 px-4 sm:px-6 lg:px-8">
    {/* User Info Section */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
      {/* Profile */}
      <div className="flex items-center space-x-4">
        <img
          src={userPic}
          alt="User"
          className="w-10 h-10 rounded-full border"
        />
        <div>
          <p className="text-base sm:text-lg font-semibold">{userName}</p>
          <p className="text-sm text-gray-600">{userEmail}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <select
          value={emailCount}
          onChange={handleEmailCountChange}
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        >
          <option value="">Set Email Count</option>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
        </select>

        <button
          onClick={logout}
          className="border text-black px-4 py-2 rounded hover:bg-black hover:text-white"
        >
          Logout
        </button>

        <button
          onClick={classifyEmails}
          className="border text-black px-4 py-2 rounded hover:bg-black hover:text-white disabled:opacity-50"
          disabled={isClassifying || emails.length === 0}
        >
          {isClassifying ? "Classifying..." : "Classify Emails"}
        </button>
      </div>
    </div>

    {/* Error Display */}
    {classificationError && (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm sm:text-base">
        <strong className="font-bold">Error:</strong> {classificationError}
      </div>
    )}

    {/* No Emails */}
    {emails.length === 0 && !isClassifying && (
      <div className="text-gray-500 italic text-sm sm:text-base">
        No emails found in local storage.
      </div>
    )}

    {/* Email List */}
    <div className="space-y-4">
      {emailsToDisplay.map((email, index) => (
        <EmailListItem
          key={index}
          email={email}
          isClassified={isClassified}
          isExpanded={expandedEmailId === index}
          onToggleExpand={() => handleToggleExpand(index)}
        />
      ))}
    </div>
  </div>
)}

export default Emails;
     
