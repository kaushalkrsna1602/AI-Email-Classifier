import React from "react";
import { extractHeader, categoryColors } from "../utils/emailUtils";

// Component to display individual email item in the list 
const EmailListItem = ({ email, isClassified, isExpanded, onToggleExpand }) => {
  const subject = email.subject || extractHeader(email, "Subject") || "No Subject";
  const snippet = email.snippet ? email.snippet.substring(0, 100) + "..." : "No preview available.";
  const category = isClassified && email.category ? email.category : null;
  const categoryClassName = category ? categoryColors[category] || "" : "";

  return (
    <div
      className={`border p-4 rounded shadow cursor-pointer bg-gray-50 hover:bg-gray-100 flex justify-between items-center ${
        isExpanded ? "bg-gray-100" : ""
      }`}
      onClick={onToggleExpand}
    >
      <div className="flex-grow">
        <p className="font-semibold">Subject: {subject}</p>
        {!isExpanded && <p className="text-gray-600 text-sm">Snippet: {snippet}</p>}
        {isExpanded && (
          <div className="mt-2">
            <p className="font-semibold">Body:</p>
            <p className="text-gray-700">{email.snippet || "No body available."}</p>
          </div>
        )}
      </div>
      {category && (
        <div className={`ml-4 px-2 py-1 rounded-full text-xs font-semibold ${categoryClassName}`}>
          {category}
        </div>
      )}
    </div>
  );
};

export default EmailListItem;
