// Runs on every LinkedIn profile page
function scrapeProfile() {
  const data = {};

  // Name
  const nameEl = document.querySelector('h1');
  data.name = nameEl ? nameEl.innerText.trim() : 'this person';

  // Headline
  const headlineEl = document.querySelector('.text-body-medium');
  data.headline = headlineEl ? headlineEl.innerText.trim() : '';

  // About
  const aboutEl = document.querySelector('#about ~ * .visually-hidden');
  data.about = aboutEl ? aboutEl.innerText.trim() : '';

  // Current position
  const positionEl = document.querySelector('.experience-item .t-bold span');
  data.position = positionEl ? positionEl.innerText.trim() : '';

  // Company
  const companyEl = document.querySelector('.experience-item .t-normal span');
  data.company = companyEl ? companyEl.innerText.trim() : '';

  // Skills
  const skillEls = document.querySelectorAll('.skill-categories-section .t-bold span');
  data.skills = Array.from(skillEls).slice(0, 5).map(el => el.innerText.trim()).join(', ');

  return data;
}

// Listen for message from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scrape') {
    const data = scrapeProfile();
    sendResponse({ data });
  }
  return true;
});