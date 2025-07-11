import botIcon from './assets/bot.svg';
import userIcon from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');
// const API_URL = 'http://localhost:5000';
const API_URL = 'https://openai-chatgpt-y6hd.onrender.com';


let loadInterval;
let hasSetTitle = false;

// SVG Icons
const copyIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
const checkIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="green" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`;

// Show loading dots
function loader(el) {
  el.textContent = '';
  loadInterval = setInterval(() => {
    el.textContent += '.';
    if (el.textContent.length > 3) el.textContent = '';
  }, 300);
}

// Typewriter effect with delayed copy button
function typeText(el, html, rawText) {
  let i = 0;
  const temp = document.createElement("div");
  temp.innerHTML = html;
  const fullText = temp.textContent || temp.innerText || ""; // plain text only

  const interval = setInterval(() => {
    if (i < fullText.length) {
      el.textContent += fullText.charAt(i);
      i++;
    } else {
      clearInterval(interval);

      // After typing plain text, render full HTML
      el.innerHTML = html;

      // Add copy button
      const copyBtn = document.createElement("buttons");
      copyBtn.className = "copy-btn";
      copyBtn.innerHTML = copyIcon;
      copyBtn.setAttribute("data-copy", rawText);
      el.parentElement.appendChild(copyBtn);
    }
  }, 20);
}


// Markdown to HTML
function parseMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')   // bold
    .replace(/`([^`]+)`/g, '<code>$1</code>')           // code
    .replace(/\n/g, '<br>');                            // line breaks
}

// Generate a unique ID for response
function generateUniqueId() {
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// Return chat bubble HTML
function chatStripe(isAi, message, id = '') {
  const roleClass = isAi ? 'ai' : 'user';
  const icon = isAi ? botIcon : userIcon;
  const parsedMessage = parseMarkdown(message || '');

  return `
    <div class="wrapper ${roleClass}">
      <div class="chat">
        <div class="profile">
          <img src="${icon}" alt="${isAi ? 'bot' : 'user'}" />
        </div>
        <div class="message-wrapper">
          <div class="message" id="${id}">${parsedMessage}</div>
        </div>
      </div>
    </div>
  `;
}

// Auto scroll
function scrollToBottom() {
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Form submit
async function handleSubmit(e) {
  e.preventDefault();

  const userPrompt = new FormData(form).get('prompt').trim();
  if (!userPrompt) return;

  document.querySelector('.empty-message')?.remove();

  if (!hasSetTitle) {
    const titleEl = document.querySelector('#chat_title');
    if (titleEl) {
      titleEl.textContent = userPrompt.length > 60
        ? userPrompt.slice(0, 60) + '...'
        : userPrompt;
      hasSetTitle = true;
    }
  }

  // Show user message
  chatContainer.innerHTML += chatStripe(false, userPrompt);
  form.reset();
  scrollToBottom();

  // Placeholder for bot
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, ' ', uniqueId);
  scrollToBottom();

  const botMsgEl = document.getElementById(uniqueId);
  loader(botMsgEl);

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: userPrompt })
    });

    clearInterval(loadInterval);
    botMsgEl.innerHTML = '';

    if (res.ok) {
      const data = await res.json();
      const rawText = data.bot.trim();
      const html = parseMarkdown(rawText);
      typeText(botMsgEl, html, rawText);
    } else {
      const errText = await res.text();
      botMsgEl.innerHTML = '⚠️ Something went wrong';
      alert(errText);
    }
  } catch (err) {
    clearInterval(loadInterval);
    botMsgEl.innerHTML = '⚠️ Failed to connect to server';
    console.error(err);
    alert('Connection error. Is your server running?');
  }

  scrollToBottom();
}

// Event listeners
form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) handleSubmit(e);
});

// Clipboard copy
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.copy-btn');
  if (btn) {
    const content = btn.dataset.copy;
    navigator.clipboard.writeText(content).then(() => {
      btn.innerHTML = checkIcon;
      setTimeout(() => {
        btn.innerHTML = copyIcon;
      }, 1500);
    });
  }
});
