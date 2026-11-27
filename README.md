<div align="center">

# 💧 DripLoop

### Every drop deserves another job.

**Recovered water. Local possibilities.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel)](https://innocode26-rho.vercel.app/)
![InnoCode](https://img.shields.io/badge/InnoCode-2026-0891b2?style=for-the-badge)

*Built for the InnoCode 2026 Vibe Coding Hackathon.*

</div>

---

## About the project

DripLoop is a sustainability-focused web application that explores how air-conditioning condensate can be recovered and reused instead of being discarded. It connects buildings with surplus collected water to people looking for water for suitable non-potable purposes.

Designed with the UAE in mind, the prototype demonstrates a local circular-water economy where existing resources can be put to better use.

**[Explore DripLoop →](https://innocode26-rho.vercel.app/)**

## Key features

| Feature | Description |
| --- | --- |
| Water discovery | Browse available water sources and search by intended use. |
| Building dashboard | Create listings with available litres, area, collection frequency, access and quality notes. |
| Collector view | Find potential sources and claim a specified quantity of water. |
| Collection tracking | Confirm pickup and track claimed and collected water. |
| Urgency indicators | Display collection deadlines in UAE local time. |
| Impact dashboard | Track confirmed litres reused; additional environmental estimates require configured, sourced factors. |
| Accessible interface | High-contrast option, semantic controls and responsive styling. |
| Demo persistence | Save records locally in the browser and load or reset fictional demo data. |

## How it works

1. A building lists recovered AC condensate available for collection.
2. A collector searches for a suitable source based on the intended use.
3. The collector reviews the listing, including water-quality notes, and claims the required quantity.
4. Once pickup is confirmed in the prototype, the quantity is counted towards water reuse.

## Technology stack

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

- **HTML5 & CSS3:** Structure, layout and visual design.
- **Vanilla JavaScript:** Matching, listings, claims, interface logic and animations.
- **LocalStorage:** Browser-based persistence.
- **Vercel:** Website hosting.

## Project structure

```text
innocode26/
├── index.html       # Main website
├── style.css        # Core styling
├── cinematic.css    # Visual enhancements
├── data.js          # Demo listings and configuration
├── matching.js      # Intended-use matching
├── app.js           # Application state and logic
├── ui.js            # Interface enhancements
├── motion.js        # Motion effects
└── README.md        # Project documentation
```

## Run locally

```bash
git clone https://github.com/Riyan154/innocode26.git
cd innocode26
python3 -m http.server 8000
```

Open [localhost:8000](http://localhost:8000) in your browser. No package installation or backend server is required beyond the optional local static file server.

## Prototype scope & safety

This is a hackathon prototype, not an operational water distribution service. Building names and initial quantities are fictional, records are browser-local rather than shared across users, and environmental conversion factors are not yet configured.

AC condensate is non-potable and may contain contaminants. Actual reuse requires appropriate quality assessment and treatment for the intended application. It must not be used for drinking, cooking or animal drinking water.

## Hackathon

Developed for **InnoCode 2026**, a vibe coding hackathon, with a focus on sustainability, practical innovation and user-friendly web design.

---

<div align="center">

**Collected from cooling. Passed on with purpose.**

[Visit DripLoop](https://innocode26-rho.vercel.app/) · [Source code](https://github.com/Riyan154/innocode26)

</div>
