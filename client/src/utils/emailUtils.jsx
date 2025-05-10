// function to extract the subject from the email object 
export const extractHeader = (email, name) => {
  const header = email.payload?.headers?.find((h) => h.name === name);
  return header?.value || null;
};


// setting up the colors for different categories 
export const categoryColors = {
  Important: "bg-red-100 border-red-400 text-red-700",
  Promotional: "bg-yellow-100 border-yellow-400 text-yellow-700",
  Social: "bg-blue-100 border-blue-400 text-blue-700",
  Marketing: "bg-green-100 border-green-400 text-green-700",
  Spam: "bg-gray-300 border-gray-400 text-gray-700",
  General: "bg-purple-100 border-purple-400 text-purple-700",
};

export const BASE_URL =
  location.hostname === "localhost" ? "http://localhost:5000/classify" : "https://ai-email-classifier.onrender.com/classify";
