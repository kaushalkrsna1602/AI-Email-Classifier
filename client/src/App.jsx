import React from "react";
import EmailFetcher from "./EmailFetcher";

function App() {
  return (
    <div className="flex flex-col items-center justify-center h-[540px]">
      <h1 className="text-2xl font-bold mb-4">Email Classifier</h1>
      <EmailFetcher />
    </div>
  );
}

export default App;
