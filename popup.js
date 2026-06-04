const STORAGE_KEY = 'linklens_api_key';

async function getApiKey() {
  return new Promise(resolve => {
    chrome.storage.local.get([STORAGE_KEY], result => {
      resolve(result[STORAGE_KEY] || null);
    });
  });
}

async function saveApiKey(key) {
  return new Promise(resolve => {
    chrome.storage.local.set({ [STORAGE_KEY]: key }, resolve);
  });
}

async function getCurrentTab() {
  return new Promise(resolve => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      resolve(tabs[0]);
    });
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const tab = await getCurrentTab();
  const isLinkedIn = tab.url.includes('linkedin.com/in/');

  const notLinkedIn = document.getElementById('not-linkedin');
  const onLinkedIn = document.getElementById('on-linkedin');
  const generateBtn = document.getElementById('generate-btn');
  const loading = document.getElementById('loading');
  const result = document.getElementById('result');
  const messageBox = document.getElementById('message-box');
  const copyBtn = document.getElementById('copy-btn');
  const copyConfirm = document.getElementById('copy-confirm');
  const regenerateBtn = document.getElementById('regenerate-btn');
  const chatInput = document.getElementById('chat-input');
  const chatSend = document.getElementById('chat-send');
  const chatMessages = document.getElementById('chat-messages');

  if (!isLinkedIn) {
    notLinkedIn.classList.remove('hidden');
    return;
  }

  onLinkedIn.classList.remove('hidden');

  async function generate() {
    let apiKey = await getApiKey();

    if (!apiKey) {
      apiKey = prompt('Enter your Gemini API key (saved locally, never shared):');
      if (!apiKey) return;
      await saveApiKey(apiKey);
    }

    generateBtn.classList.add('hidden');
    result.classList.add('hidden');
    loading.classList.remove('hidden');

    chrome.runtime.sendMessage({
      action: 'generate',
      apiKey,
      tabId: tab.id
    }, (response) => {
      loading.classList.add('hidden');

      if (!response || response.error) {
        generateBtn.classList.remove('hidden');
        alert('Error: ' + (response?.error || 'Unknown error'));
        return;
      }

      messageBox.value = response.message;
      result.classList.remove('hidden');
    });
  }

  async function refine() {
    const instruction = chatInput.value.trim();
    if (!instruction) return;

    const apiKey = await getApiKey();
    const currentMessage = messageBox.value;

    const userMsg = document.createElement('div');
    userMsg.className = 'chat-msg-user';
    userMsg.textContent = instruction;
    chatMessages.appendChild(userMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    chatInput.value = '';

    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'chat-msg-ai';
    loadingMsg.textContent = 'Rewriting...';
    chatMessages.appendChild(loadingMsg);

    chrome.runtime.sendMessage({
      action: 'refine',
      apiKey,
      currentMessage,
      userInstruction: instruction
    }, (response) => {
      if (response.error) {
        loadingMsg.textContent = 'Error: ' + response.error;
        return;
      }
      messageBox.value = response.message;
      loadingMsg.textContent = '✅ Updated!';
      chatMessages.scrollTop = chatMessages.scrollHeight;
    });
  }

  generateBtn.addEventListener('click', generate);
  regenerateBtn.addEventListener('click', generate);

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(messageBox.value).then(() => {
      copyConfirm.classList.remove('hidden');
      setTimeout(() => copyConfirm.classList.add('hidden'), 2000);
    });
  });

  chatSend.addEventListener('click', refine);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') refine();
  });
});