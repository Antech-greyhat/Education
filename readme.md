<div align="center">

<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0C8F6A"/>
      <stop offset="100%" style="stop-color:#0FA87E"/>
    </linearGradient>
    <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#0FA87E"/>
      <stop offset="100%" style="stop-color:#F59E0B"/>
    </linearGradient>
  </defs>
  <circle cx="50" cy="50" r="46" fill="none" stroke="url(#g1)" stroke-width="1.5" opacity="0.3">
    <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="18s" repeatCount="indefinite"/>
  </circle>
  <circle cx="50" cy="50" r="36" fill="none" stroke="url(#g2)" stroke-width="1" stroke-dasharray="6 3" opacity="0.4">
    <animateTransform attributeName="transform" type="rotate" from="360 50 50" to="0 50 50" dur="10s" repeatCount="indefinite"/>
  </circle>
  <circle cx="50" cy="50" r="28" fill="url(#g1)" opacity="0.1"/>
  <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="22" font-weight="700" fill="url(#g1)">&lt;/&gt;</text>
  <circle cx="50" cy="82" r="2.5" fill="#0FA87E">
    <animate attributeName="opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite"/>
  </circle>
</svg>

<br/>

<svg width="320" height="52" viewBox="0 0 320 52" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="tg" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#0FA87E"/>
      <stop offset="70%" style="stop-color:#0FA87E"/>
      <stop offset="100%" style="stop-color:#F59E0B"/>
    </linearGradient>
  </defs>
  <text x="50%" y="38" dominant-baseline="middle" text-anchor="middle" font-family="Georgia, serif" font-size="34" font-weight="700" fill="url(#tg)">AntechLearn</text>
</svg>

<p><em>The developer's learning platform — built different.</em></p>

[![Live Demo](https://img.shields.io/badge/Live%20Demo-antechlearn.vercel.app-0FA87E?style=for-the-badge&logo=vercel&logoColor=white)](https://antechlearn.vercel.app)
[![API](https://img.shields.io/badge/API-antechapi.vercel.app-0C8F6A?style=for-the-badge&logo=flask&logoColor=white)](https://antechapi.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Antech--greyhat-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Antech-greyhat/Education)

</div>

---

## About

AntechLearn is a full-stack educational platform for developers. Browse 120+ curated programming courses across 40+ languages, watch videos in-app, filter, search, and track your journey — all in a clean, fast interface backed by a secure Flask API.

---

## Features

<table>
<tr>
<td width="50%">

**Frontend**
- Teal design system + dark mode
- Scroll reveal & count-up animations
- In-app video modal player
- Filter bar + live search
- Admin dashboard

</td>
<td width="50%">

**Backend API**
- JWT auth + OTP email verification
- Password reset flow
- Rate limiting (Redis-backed)
- Newsletter & contact management
- Admin data endpoints

</td>
</tr>
</table>

---

## Architecture

<div align="center">
<svg width="620" height="90" viewBox="0 0 620 90" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1E293B"/>
      <stop offset="100%" style="stop-color:#334155"/>
    </linearGradient>
    <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0C8F6A"/>
      <stop offset="100%" style="stop-color:#0FA87E"/>
    </linearGradient>
    <marker id="arr" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
      <path d="M0,0 L0,6 L7,3 z" fill="#0FA87E"/>
    </marker>
  </defs>
  <rect width="620" height="90" fill="#0F172A" rx="10"/>
  <rect x="15" y="25" width="100" height="40" rx="6" fill="url(#bg1)" stroke="#334155" stroke-width="1"/>
  <text x="65" y="42" text-anchor="middle" font-family="monospace" font-size="10" fill="#94A3B8">Browser</text>
  <text x="65" y="57" text-anchor="middle" font-family="monospace" font-size="9" fill="#0FA87E">User / Admin</text>
  <line x1="117" y1="45" x2="148" y2="45" stroke="#0FA87E" stroke-width="1.2" marker-end="url(#arr)"/>
  <rect x="150" y="20" width="110" height="50" rx="6" fill="url(#bg1)" stroke="#0FA87E" stroke-width="1.2"/>
  <text x="205" y="40" text-anchor="middle" font-family="monospace" font-size="10" fill="#94A3B8">Frontend</text>
  <text x="205" y="55" text-anchor="middle" font-family="monospace" font-size="9" fill="#0FA87E">Vercel</text>
  <line x1="262" y1="45" x2="293" y2="45" stroke="#0FA87E" stroke-width="1.2" marker-end="url(#arr)"/>
  <text x="277" y="38" text-anchor="middle" font-family="monospace" font-size="8" fill="#475569">REST</text>
  <rect x="295" y="20" width="110" height="50" rx="6" fill="url(#bg2)" stroke="#F59E0B" stroke-width="1.2"/>
  <text x="350" y="40" text-anchor="middle" font-family="monospace" font-size="10" fill="#ffffff">Flask API</text>
  <text x="350" y="55" text-anchor="middle" font-family="monospace" font-size="9" fill="#FFF9C4">Vercel</text>
  <line x1="407" y1="45" x2="438" y2="45" stroke="#F59E0B" stroke-width="1.2" marker-end="url(#arr)"/>
  <rect x="440" y="20" width="110" height="50" rx="6" fill="url(#bg1)" stroke="#F59E0B" stroke-width="1.2"/>
  <text x="495" y="40" text-anchor="middle" font-family="monospace" font-size="10" fill="#94A3B8">PostgreSQL</text>
  <text x="495" y="55" text-anchor="middle" font-family="monospace" font-size="9" fill="#F59E0B">+ Redis</text>
</svg>
</div>

---

## Setup

```bash
# Clone
git clone https://github.com/Antech-greyhat/Education.git

# Backend
cd Education/api
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in your values
python main.py

# Frontend
cd Education/frontend
open index.html        # or use browser-sync for live reload
```

---

## Stack

`Flask` `Flask-RESTX` `SQLAlchemy` `JWT` `PostgreSQL` `Redis` `Gunicorn` `Vercel`

---

<div align="center">

<svg width="300" height="30" viewBox="0 0 300 30" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="fl" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#0FA87E;stop-opacity:0"/>
      <stop offset="50%" style="stop-color:#0FA87E"/>
      <stop offset="100%" style="stop-color:#F59E0B;stop-opacity:0"/>
    </linearGradient>
  </defs>
  <rect x="0" y="14" width="300" height="1" fill="url(#fl)"/>
  <circle cx="150" cy="14" r="3" fill="#0FA87E">
    <animate attributeName="r" values="3;5;3" dur="3s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="1;0.4;1" dur="3s" repeatCount="indefinite"/>
  </circle>
</svg>

Made with ♥ by **[BraveraTech](https://github.com/braverachacha)** &  **[Antech-greyhat](https://github.com/Antech-greyhat)**
© 2026 AntechLearn

</div>
