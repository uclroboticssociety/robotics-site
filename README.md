# 🤖 UCL Robotics Society Website

[![Deployed on Cloudflare Pages](https://img.shields.io/badge/Deployed%20on-Cloudflare%20Pages-F38020?logo=cloudflare&logoColor=white)](https://uclrobotics.co.uk)
[![Built with Astro](https://img.shields.io/badge/Built%20with-Astro-BC52EE?logo=astro&logoColor=white)](https://astro.build/)
[![Styled with TailwindCSS](https://img.shields.io/badge/Styled%20with-TailwindCSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

Official website of the **UCL Robotics Society**, built with [Astro](https://astro.build/) and [TailwindCSS](https://tailwindcss.com/).  
Hosted on **Cloudflare Pages** and connected to our custom domain:

🌐 **[https://uclrobotics.co.uk](https://uclrobotics.co.uk)**

---

## 🏗️ Tech Stack

| Category | Technology |
|-----------|-------------|
| Framework | [Astro](https://astro.build/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Hosting | [Cloudflare Pages](https://pages.cloudflare.com/) |
| Version Control | [GitHub](https://github.com/uclroboticssociety/robotics-site) |
| Domain | [Namecheap](https://www.namecheap.com/) + [Cloudflare DNS](https://dash.cloudflare.com/) |

---

## 🧭 Project Structure
/
├── src/
│ ├── components/ # Reusable UI components
│ ├── layouts/ # Base page layouts
│ ├── pages/ # Each page route (/, /events, /projects, /join, /contact)
│ └── styles/ # Global styles (Tailwind setup)
├── public/ # Static assets (images, icons, etc.)
├── package.json
├── astro.config.mjs
├── tailwind.config.mjs
└── README.md

---

## 💻 Local Development

### 1. Clone this repository
```bash
git clone https://github.com/uclroboticssociety/robotics-site.git
cd robotics-site
```
### 2. Install dependencies 
```bash
npm install
```
### 3. Run locally
```bash
npm run dev
```
Then open 👉 http://localhost:4321
to preview the site locally while editing.

---

## 🚀 Deployment Workflow

This project is automatically deployed via Cloudflare Pages.
Every time you push changes to the main branch, Cloudflare rebuilds and updates the live site.

Deploy steps:
```bash
git add .
git commit -m "Update homepage or content"
git push
```
✅ Within a few minutes,
the website at https://uclrobotics.co.uk
will automatically update.

---

## 🧑‍🤝‍🧑 Collaboration

To allow multiple committee members to update the site:

Add them as Collaborators on this GitHub repo
1. → Settings → Collaborators → Add person
2. They can clone the repo and push updates the same way.
3. Cloudflare will auto-deploy all commits pushed to main.

---

## 🛠️ Manual Deployment (if needed)

If you ever need to manually trigger a new deployment:

1. Go to Cloudflare Pages Dashboard
2. Open project robotics-site
3. Go to Deployments
4. Click “Trigger Deploy” → “Retry Last Deploy”

---

## 🌍 Domain & DNS Setup (for reference)
Provider	           Purpose
Namecheap	           Domain purchase (uclrobotics.co.uk)
Cloudflare	           DNS management & HTTPS
GitHub	               Source code repository
Cloudflare Pages	   Hosting & deployment automation

Nameservers (as configured on Namecheap):
```bash
gail.ns.cloudflare.com
quincy.ns.cloudflare.com
```

---

## 📄 License
MIT License © UCL Robotics Society

Built with ❤️ by UCL Robotics Society · 2025
Empowering the next generation of roboticists at UCL 🤖