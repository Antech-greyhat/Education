<div align="center">

<img src="https://raw.githubusercontent.com/Antech-greyhat/Education/main/assets/logo.svg" width="120"/>

<br/>

![title](https://capsule-render.vercel.app/api?type=transparent&color=0FA87E&height=80&text=AntechLearn&fontSize=50&fontColor=0FA87E&animation=typewriter&fontAlignY=60)

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
<img src="https://raw.githubusercontent.com/Antech-greyhat/Education/main/assets/arch.svg" width="620"/>
</div>

---

## Stack

<div align="center">
<img src="https://raw.githubusercontent.com/Antech-greyhat/Education/main/assets/stack.svg" width="420"/>
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
open index.html
```

---

<div align="center">

<img src="https://raw.githubusercontent.com/Antech-greyhat/Education/main/assets/footer-line.svg" width="400"/>

Made with ♥ by **[BraveraTech](https://github.com/braverachacha)** &  **[Antech-greyhat](https://github.com/Antech-greyhat)** .
© 2026 AntechLearn

</div>
