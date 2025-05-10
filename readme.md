# 📧 Kaushal Email Classifier

A full-stack Gmail email classification tool using Google OAuth, Node.js, React, and Gemini API (Google's AI model). It allows users to log in, fetch their Gmail emails, and classify them using Gemini API into categories such as Promotions, Social, Primary, etc.

---

## 🔗 Live Links

- **Frontend**: [https://ai-email-classifier-three.vercel.app/](https://ai-email-classifier-three.vercel.app/)
- **Backend**: [https://ai-email-classifier.onrender.com](https://ai-email-classifier.onrender.com)

## 🚀 Features

- ✅ Google OAuth-based login
- 📥 Fetch Gmail emails using Gmail API
- 🧠 Classify emails using Gemini API
- 🗂️ Toggle how many emails to load from localStorage (5, 10, 15)
- 📜 Expand/collapse email details
- 🔐 Logout and secure token clearing

---

## 🛠️ Tech Stack

### Frontend:
- React.js
- Tailwind CSS
- React Router

### Backend:
- Node.js
- Express.js
- Google OAuth2 + Gmail API
- Gemini AI API (Google Generative AI)

---

## 📁 Project Structure

kaushal-email-classifier/
├── server/
│   ├── src/
│   │ ├── index.js # Express server
│   │ └── controller
│           └── geminiController.js
├── client/
│ ├── src/
│ │ ├── components/
│ │ │ └── EmailListItem.jsx
│ │ ├── pages/
│ │ │ └── Emails.jsx
│ │ ├── App.jsx
│ │ └── main.jsx
├── package.json
└── README.md


## 🚧 Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/kaushalkrsna1602/AI-Email-Classifier
cd AI-Email-Classifier
```

### 2. Backend Setup

```bash
cd server
npm install
npm run dev
```

> Server will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

> Client will run on `http://localhost:5173`
