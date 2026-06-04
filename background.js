const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'generate') {
    const { apiKey } = request;
    chrome.tabs.captureVisibleTab(null, { format: 'jpeg', quality: 90 }, (screenshot) => {
      if (!screenshot) {
        sendResponse({ error: 'Could not capture screenshot' });
        return;
      }
      const base64Image = screenshot.split(',')[1];
      const prompt = `You are an expert at writing personalized, genuine cold messages for LinkedIn outreach. Look at this LinkedIn profile screenshot and write a short personalized cold message (max 150 words). Extract the person's name, role, company, skills, recent activity, and anything interesting visible on the page. Rules: Sound human not like a template. Reference something specific from their profile. Be genuine and direct. Don't be salesy or use buzzwords. End with a clear but soft call to action. Max 150 words. Write only the message nothing else.`;
      fetch(GEMINI_API_URL + '?key=' + apiKey, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: 'image/jpeg', data: base64Image } }] }]
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.error) { sendResponse({ error: data.error.message }); return; }
        sendResponse({ message: data.candidates[0].content.parts[0].text });
      })
      .catch(err => sendResponse({ error: err.message }));
    });
    return true;
  }

  if (request.action === 'refine') {
    const { apiKey, currentMessage, userInstruction } = request;
    const prompt = `You are helping refine a LinkedIn cold message. Current message: "${currentMessage}". User instruction: "${userInstruction}". Rewrite incorporating the instruction. Keep under 150 words, genuine, not salesy. Return only the updated message.`;
    fetch(GEMINI_API_URL + '?key=' + apiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) { sendResponse({ error: data.error.message }); return; }
      sendResponse({ message: data.candidates[0].content.parts[0].text });
    })
    .catch(err => sendResponse({ error: err.message }));
    return true;
  }
});
