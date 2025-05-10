import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import EmailListItem from "../components/EmailListItem";

const Emails = () => {
  const [emails, setEmails] = useState([]);
  const [classifiedEmails, setClassifiedEmails] = useState([]);
  const [expandedEmailId, setExpandedEmailId] = useState(null);
  const [geminiApiKey, setGeminiApiKey] = useState(localStorage.getItem("gemini_api_key") || "");
  const [isClassifying, setIsClassifying] = useState(false);
  const [classificationError, setClassificationError] = useState(null);
  const [emailCount, setEmailCount] = useState("");
  const navigate = useNavigate();

  // Load emails from local storage when the component mounts 
  useEffect(() => {
    const savedEmails = localStorage.getItem("emails");
    if (savedEmails) {
      setEmails(JSON.parse(savedEmails));
    }
  }, []);

  //function to handle logout 
  const logout = () => {
    localStorage.removeItem("gemini_api_key");
    localStorage.removeItem("emails");
    localStorage.removeItem("user_email");
    navigate("/");
  };

  // Function to handle the toggle of email expansion 
  const handleToggleExpand = useCallback((index) => {
    setExpandedEmailId((prevId) => (prevId === index ? null : index));
  }, []);

  // Function to classify emails using the Gemini API 
  const classifyEmails = useCallback(async () => {
    if (!geminiApiKey) {
      alert("Gemini API Key missing.");
      return;
    }

    setIsClassifying(true);
    setClassificationError(null);

    try {
      const response = await fetch("http://localhost:5000/classify", {
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

  // Function to handle the change of email count 
  const handleEmailCountChange = (e) => {
    const count = parseInt(e.target.value, 10);
    if (!isNaN(count)) {
      const savedEmails = JSON.parse(localStorage.getItem("emails")) || [];
      const slicedEmails = savedEmails.slice(0, count);

      // localStorage.setItem("emails", JSON.stringify(slicedEmails));
      setEmails(slicedEmails);
      setClassifiedEmails([]);
      setExpandedEmailId(null);
      setEmailCount(count);
    }
  };

  const emailsToDisplay = classifiedEmails.length > 0 ? classifiedEmails : emails;
  const isClassified = classifiedEmails.length > 0;

  return (
    <div className="max-w-5xl mx-auto mt-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">KAUSHAL GMAIL CLASSIFIER</h1>
        <div className="flex items-center gap-4">
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

          <button onClick={logout} className="border text-black px-4 py-2 rounded hover:bg-black hover:text-white">
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

      {classificationError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong className="font-bold">Error:</strong> {classificationError}
        </div>
      )}

      {emails.length === 0 && !isClassifying && (
        <div className="text-gray-500 italic">No emails found in local storage.</div>
      )}

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
  );
};

export default Emails;
