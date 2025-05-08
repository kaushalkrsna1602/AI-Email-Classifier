import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import EmailFetcher from './EmailFetcher';

function App() {
  return (
    <GoogleOAuthProvider clientId="489217701387-6tf3k977lmp1bhpvv7i3kc7c05g8clch.apps.googleusercontent.com">
      <div className="flex flex-col items-center justify-center h-[540px]">
        <h1 className="text-2xl font-bold mb-4">Email Classifier</h1>
        <GoogleLogin
  onSuccess={async (credentialResponse) => {
    const token = credentialResponse.credential;
    localStorage.setItem("google_token", token);

    console.log("Google ID Token:", token);
  }}
  onError={() => {
    console.log("Login Failed");
  }}
  useOneTap
  scope="https://www.googleapis.com/auth/gmail.readonly"
  ux_mode="popup"
/>
      </div>
      <EmailFetcher />
    </GoogleOAuthProvider>
  );
}

export default App;