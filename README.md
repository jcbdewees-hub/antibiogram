# OHSU Antibiogram Wizard

Interactive antimicrobial susceptibility guide for the OHSU Emergency Departments — Doernbecher Children's Hospital PED and OHSU Adult ED.

**Live:** [ohsu-antibiogram.vercel.app](https://ohsu-antibiogram.vercel.app)

---

## Overview

A step-by-step clinical decision support tool built on OHSU's 2024 institutional antibiogram data (HC-CKT-134-GUD Rev. 042425). Designed for rapid bedside lookup of empiric antibiotic susceptibility data during patient encounters.

### Features

- **Wizard workflow** — Population → Source → Organism → Ranked susceptibility results
- **Four complete antibiogram tables** — Pediatric non-urine, pediatric urine, adult non-urine, adult urine
- **Color-coded susceptibility** — ≥90% (green), 80–89% (yellow), 70–79% (orange), <70% (red)
- **Restricted antibiotic flagging** — Visual indicators for stewardship-restricted agents
- **Cost tier display** — IV/PO daily cost categories per OHSU formulary
- **Full table view** — Toggle to a traditional heatmap-style antibiogram grid
- **Learner Mode** — Expandable teaching content covering antibiogram interpretation, MRSA rates, AmpC producers, empiric UTI guidance, and Gram stain fundamentals. Context-sensitive callouts appear inline at relevant decision points.
- **Mobile-first** — Optimized for phone use at the bedside

## Tech Stack

- React (single-component, CDN-compatible)
- Tailwind CSS utility classes
- IBM Plex Sans / IBM Plex Mono typography
- No backend — all data is client-side

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm or yarn

### Local Development

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/ohsu-antibiogram.git
cd ohsu-antibiogram

# Install dependencies
npm install

# Start dev server
npm run dev
```

### Deploy to Vercel

1. Push the repo to GitHub
2. Import the repository at [vercel.com/new](https://vercel.com/new)
3. Framework preset: **Vite** (or Next.js if using that scaffold)
4. Deploy — no environment variables required

## Project Structure

```
ohsu-antibiogram/
├── src/
│   └── App.jsx              # Main antibiogram wizard component
├── public/
│   └── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Data Source

All susceptibility data is from the **OHSU Institutional Antibiogram, January 1 – December 31, 2024**, approved by the Antimicrobial Sub-Committee of CKTEC and the Clinical Knowledge and Therapeutics Executive Committee (effective 4/24/25).

- Minimum 30 isolates per organism per calendar year
- Each patient isolate counted once per year
- Some organisms use 2-year pooled data (2023–2024) where noted
- P. aeruginosa data excludes cystic fibrosis isolates

## Learner Mode Content

Toggle learner mode to access teaching material on:

| Topic | Coverage |
|---|---|
| What Is an Antibiogram? | CLSI M39 standards, isolate counting methodology |
| Reading the Numbers | Interpreting susceptibility percentages for empiric therapy |
| MRSA Rates | OHSU pediatric (22%) vs. adult (42%) rates and clinical implications |
| Restricted Antibiotics | Stewardship rationale, how to request restricted agents |
| AmpC β-Lactamase Producers | Inducible resistance risk with 3rd-gen cephalosporins |
| Empiric UTI Therapy | Agent selection by infection complexity, nitrofurantoin limitations |
| Gram Stain Guidance | Aligning empiric coverage with Gram stain morphology |

## Disclaimer

**For clinical reference only.** This tool supports but does not replace clinical judgment. Always confirm empiric selections with culture and sensitivity results. Antibiogram data reflects institutional resistance patterns and may not apply to outside facilities. Questions about the antibiogram should be directed to OHSU Lab Central at (503) 494-7383 or the ID Pharmacist at pager 16695.

## License

Internal OHSU clinical tool. Not for redistribution outside OHSU without approval from the Antimicrobial Sub-Committee of CKTEC.
