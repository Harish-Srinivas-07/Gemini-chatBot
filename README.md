# ✨ Gemini ChatBot

A beautiful Gemini-inspired AI chatbot with typing animation, Markdown support, and clipboard copy functionality — built using HTML, CSS, and Vanilla JavaScript.


## 📂 Project Structure

```
Gemini-chatBot/
├── client/     → Frontend (HTML, CSS, JS)
├── server/     → Backend (Node.js + OpenAI/Gemini API)
```

## 🚀 Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Harish-Srinivas-07/Gemini-chatBot.git
cd Gemini-chatBot
```


### 2️⃣ Start the server

```bash
cd server
npm run server
```

> Starts the backend server to process chat prompts.

---

### 3️⃣ Start the client

```bash
cd ../client
npm install
npm run dev
```

> Runs the frontend locally at `http://localhost:3000`


## ✨ Features

* 🧠 Gemini-style layout with user (right) and AI (left)
* ⌨️ Typing animation for bot replies
* 📝 Markdown support: `**bold**`, `code`, new lines
* 📋 Copy to clipboard (appears after full reply)
* 💎 Polished glassy input UI
* ⚡ Lightweight: No React or frameworks


## 🛠️ Customization

* Replace avatars in `client/assets/` (e.g., `bot.svg`, `user.svg`)
* Edit `API_URL` in `client/script.js` to point to your API


## 📄 License

This project is open-source and available for learning and personal use.
Licensed under the [MIT License](LICENSE).

Made with ❤️ by [@Harish-Srinivas-07](https://github.com/Harish-Srinivas-07)
