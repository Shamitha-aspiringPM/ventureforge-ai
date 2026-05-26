# VentureForge AI 🚀

> An AI-powered startup strategy workspace that transforms raw ideas into structured startup plans — built with React, Vite, and Claude AI.

**🌐 Live Demo:** [ventureforge-ai.vercel.app](https://ventureforge-ai.vercel.app)  
**📊 Analytics:** Tracked via Mixpanel — funnel analysis, drop-off rates, feature usage

---

## What is VentureForge AI?

VentureForge AI is a full-stack web application that guides aspiring founders and product thinkers through a structured **6-step startup strategy pipeline** — from raw idea to validated, roast-tested startup plan — all powered by Claude AI in real time.

This project was built end-to-end from a Product Requirements Document (PRD) — covering user personas, functional requirements, MVP scoping, and tech stack decisions.

---

## The Problem

Most aspiring founders struggle with:
- Not knowing if their idea is viable before investing time and money
- No structured way to think through competition, MVP scope, or monetisation
- Existing tools either generate generic ideas or require deep startup knowledge

**VentureForge AI bridges that gap** with a guided, AI-driven workflow that anyone can use.

---

## The Solution — A Linked 6-Step Pipeline

One idea flows through all 6 steps automatically. No re-entering information, no switching tools.

| Step | Feature | What it does |
|------|---------|--------------|
| 1 | ⚡ **Idea Generator** | Generates a structured startup concept from industry, audience, and problem inputs |
| 2 | 📊 **Market Validation** | Scores the idea across 5 dimensions — demand, competition, scalability, monetisation, innovation |
| 3 | 🔬 **Competitor Analysis** | Maps direct and indirect competitors, identifies market gaps and differentiation angles |
| 4 | 🗺️ **MVP Planner** | Generates a prioritised feature list, sprint roadmap, and tech stack recommendation |
| 5 | 💰 **Business Model** | Suggests monetisation strategies with unit economics and GTM approach |
| 6 | 🔥 **Roast Mode** | Brutally critiques the idea to stress-test it before committing |

---

## Product Thinking Highlights

- **Started from a PRD** — defined problem statement, user personas, functional requirements, and MVP scope before writing a single line of code
- **Instrumented with Mixpanel** — tracking full funnel from landing page to pipeline completion, step-by-step drop-off rates, and feature usage
- **Iterated based on real bugs** — solved a React state management bug (stale closures across tab switches) by refactoring to Context API — a deliberate product engineering decision
- **Performance decisions** — chose Claude Haiku over Sonnet specifically for speed after observing 60-second response times hurting user experience

---

## Key Features

- **Linked pipeline** — one idea carries through all 6 steps with a live progress bar
- **Active idea context** — switch or load saved ideas at any point mid-pipeline
- **Workspace** — save, revisit, and compare multiple startup concepts
- **Animated loading states** — step-by-step progress indicators during AI generation
- **Error handling** — graceful error messages with retry support
- **Dark terminal UI** — custom-built design system with CSS variables

---

## Tech Stack

| Layer | Technology | Why chosen |
|-------|-----------|------------|
| UI Framework | React 18 | Industry standard, component model perfect for multi-tab app |
| Build Tool | Vite | 10x faster than Create React App, instant hot reload |
| State Management | React Context API | Eliminated prop drilling bugs without extra dependencies |
| AI Model | Claude Haiku | Fastest Anthropic model — 5x quicker than Sonnet for JSON outputs |
| Backend Proxy | Vercel Serverless Function | Hides API key server-side, zero config, completely free |
| Hosting | Vercel | Free, auto-deploys on every GitHub push, global CDN |
| Analytics | Mixpanel | Industry standard product analytics — funnel and drop-off tracking |
| Version Control | GitHub | Industry standard, triggers Vercel auto-deploy pipeline |

---

## Architecture

```
User's Browser
      ↓
React App (Vercel CDN)
      ↓
/api/claude (Vercel Serverless Proxy)
      ↓
Anthropic API → Claude Haiku
      ↓
JSON response → parsed → displayed in UI
      ↓
Mixpanel → event tracked
```

---

## What I Learned Building This

- How to structure a PRD and translate it into a working product
- React Context API and how to avoid stale closure bugs in multi-component apps
- How serverless functions work as secure API proxies
- How to instrument a product with analytics to measure real user behaviour
- The full deployment pipeline — local development → GitHub → Vercel

---

## Target Users

- **Aspiring Founders** — validate ideas before committing time and money
- **Product Managers** — rapid ideation and opportunity sizing
- **Students & Hackathon participants** — structured startup thinking under time pressure
- **Indie Builders** — AI-assisted planning without a co-founder

---

## Future Roadmap

- [ ] Mixpanel funnel analysis — iterate on drop-off points
- [ ] Pitch deck generator
- [ ] "What If" simulator — adjust pricing/audience, see AI predictions
- [ ] Export pipeline results as PDF report
- [ ] Investor matching recommendations

---

## About

Built by **Shamitha** as a portfolio project to demonstrate product thinking, AI integration, and full-stack development skills.

> *Every decision in this project — from choosing Haiku over Sonnet to switching from prop drilling to Context API — was a deliberate product and engineering tradeoff, not just code.*

---

*Built with React · Vite · Claude AI · Vercel · Mixpanel*
