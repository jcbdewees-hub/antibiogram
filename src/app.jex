import { useState, useMemo, useCallback, useEffect } from "react";

// ─── DATA ───────────────────────────────────────────────────────────────────

const PEDS_NON_URINE = {
  title: "Pediatric Non-Urine",
  period: "Jan 1 – Dec 31, 2024",
  notes: [
    "Pediatric MRSA rate: 22%",
    "P. aeruginosa susceptibilities exclude CF patients",
    "Erythromycin susceptibility surrogate for azithromycin in S. pneumoniae",
    "S. aureus susceptibility to oxacillin predicts susceptibility to cefazolin",
    "* Data based on isolates over 2 calendar years (2023–2024)"
  ],
  organisms: [
    { short: "E. cloacae*", full: "Enterobacter cloacae complex*", n: 37, gram: "neg" },
    { short: "E. coli", full: "Escherichia coli", n: 46, gram: "neg" },
    { short: "P. aeruginosa", full: "Pseudomonas aeruginosa", n: 68, gram: "neg" },
    { short: "All S. aureus", full: "All Staphylococcus aureus", n: 320, gram: "pos" },
    { short: "MRSA", full: "Methicillin-resistant S. aureus", n: 70, gram: "pos" },
    { short: "MSSA", full: "Methicillin-susceptible S. aureus", n: 250, gram: "pos" },
    { short: "S. pneumoniae*", full: "Streptococcus pneumoniae*", n: 74, gram: "pos" },
  ],
  antibiotics: [
    "Amikacin (restricted)",
    "Ampicillin",
    "Amoxicillin/clavulanate",
    "Cefazolin",
    "Cefepime",
    "Ceftazidime (restricted)",
    "Ceftriaxone",
    "Ceftriaxone (meningitis)",
    "Ceftriaxone (non-meningitis)",
    "Ciprofloxacin (restricted)",
    "Clindamycin",
    "Ertapenem (restricted)",
    "Erythromycin",
    "Gentamicin",
    "Levofloxacin (restricted)",
    "Meropenem (restricted)",
    "Oxacillin/nafcillin",
    "Penicillin (meningitis)",
    "Penicillin (non-meningitis)",
    "Piperacillin/tazobactam",
    "Tetracycline",
    "Tobramycin",
    "TMP/SMX",
    "Vancomycin",
  ],
  // rows: antibiotics, cols: organisms (same order as organisms array)
  data: [
    [100, 98, null, null, null, null, null],
    [null, 43, null, null, null, null, null],
    [null, 83, null, null, null, null, null],
    [null, 74, null, 78, null, 100, null],
    [97, 93, 97, null, null, null, null],
    [null, 93, 96, null, null, null, null],
    [null, 85, null, null, null, null, null],
    [null, null, null, null, null, null, 98],
    [null, null, null, null, null, null, 100],
    [97, 85, 91, null, null, null, null],
    [null, null, null, 88, 93, 87, null],
    [94, 100, null, null, null, null, null],
    [null, null, null, 98, null, 98, 69],
    [97, 93, null, 98, null, 98, null],
    [100, 85, 90, null, null, null, null],
    [100, 100, 94, null, null, null, null],
    [null, null, null, 78, null, 100, null],
    [null, null, null, null, null, null, 84],
    [null, null, null, null, null, null, 100],
    [null, 89, 96, null, null, null, null],
    [94, 61, null, 91, 79, 94, 97],
    [97, 89, 94, null, null, null, null],
    [100, 74, null, 98, 94, 99, 88],
    [null, null, null, 100, 100, 100, null],
  ],
};

const PEDS_URINE = {
  title: "Pediatric Urine",
  period: "Jan 1 – Dec 31, 2024",
  notes: [
    "Use for urine pathogens only",
    "S. aureus susceptibility to oxacillin predicts susceptibility to cefazolin",
    "* Data based on isolates over 2 calendar years (2023–2024)",
    "AmpC derepression risk with prolonged 3rd-gen cephalosporins"
  ],
  organisms: [
    { short: "E. coli", full: "Escherichia coli", n: 297, gram: "neg" },
    { short: "K. oxytoca*", full: "Klebsiella oxytoca*", n: 42, gram: "neg" },
    { short: "K. pneumoniae*", full: "Klebsiella pneumoniae*", n: 53, gram: "neg" },
    { short: "P. mirabilis*", full: "Proteus mirabilis*", n: 34, gram: "neg" },
    { short: "P. aeruginosa*", full: "Pseudomonas aeruginosa*", n: 36, gram: "neg" },
    { short: "E. faecalis", full: "Enterococcus faecalis", n: 59, gram: "pos" },
    { short: "S. aureus*", full: "Staphylococcus aureus*", n: 31, gram: "pos" },
    { short: "S. epidermidis*", full: "Staphylococcus epidermidis*", n: 40, gram: "pos" },
  ],
  antibiotics: [
    "Amikacin (restricted)",
    "Ampicillin",
    "Ampicillin/sulbactam",
    "Cefazolin",
    "Cefepime",
    "Cefoxitin",
    "Ceftazidime (restricted)",
    "Ceftriaxone",
    "Ciprofloxacin (restricted)",
    "Ertapenem",
    "Gentamicin",
    "Levofloxacin (restricted)",
    "Meropenem (restricted)",
    "Nitrofurantoin",
    "Oxacillin/nafcillin",
    "Penicillin G",
    "Piperacillin/tazobactam",
    "Tetracycline",
    "Tobramycin",
    "TMP/SMX",
    "Vancomycin",
  ],
  data: [
    [100, 98, 100, 97, 92, null, null, null],
    [60, null, null, 91, null, 100, null, null],
    [67, 81, 89, 94, null, null, null, null],
    [92, 57, 91, 97, null, null, 68, 38],
    [96, 93, 96, 100, 92, null, null, null],
    [97, 95, 94, 100, null, null, null, null],
    [95, 93, 92, 100, 94, null, null, null],
    [95, 88, 92, 100, null, null, null, null],
    [87, 90, 85, 100, 94, 90, null, null],
    [100, 95, 98, 100, null, null, null, null],
    [91, 93, 94, 94, null, null, null, null],
    [91, 90, 94, 100, 92, 100, null, null],
    [100, 98, 98, 100, 97, null, null, null],
    [98, 90, 64, null, null, 100, 100, 100],
    [null, null, null, null, null, null, 68, 38],
    [null, null, null, null, null, 100, null, null],
    [98, 93, 96, 100, 97, null, null, null],
    [82, 81, null, null, null, 31, 94, 85],
    [92, 88, 92, 94, 97, null, null, null],
    [75, 74, 77, 94, null, null, 100, 50],
    [null, null, null, null, null, 100, 100, 100],
  ],
};

const ADULT_NON_URINE = {
  title: "Adult Non-Urine",
  period: "Jan 1 – Dec 31, 2024",
  notes: [
    "Adult MRSA rate: 42%",
    "P. aeruginosa susceptibilities exclude CF patients",
    "Erythromycin susceptibility surrogate for azithromycin in S. pneumoniae",
    "S. aureus susceptibility to oxacillin predicts susceptibility to cefazolin",
    "* Data based on isolates over 2 calendar years (2023–2024)"
  ],
  organisms: [
    { short: "C. freundii*", full: "Citrobacter freundii*", n: 44, gram: "neg" },
    { short: "E. cloacae*", full: "Enterobacter cloacae complex", n: 36, gram: "neg" },
    { short: "E. coli", full: "Escherichia coli", n: 327, gram: "neg" },
    { short: "K. aerogenes", full: "Klebsiella aerogenes", n: 31, gram: "neg" },
    { short: "K. oxytoca", full: "Klebsiella oxytoca", n: 70, gram: "neg" },
    { short: "K. pneumoniae", full: "Klebsiella pneumoniae", n: 139, gram: "neg" },
    { short: "P. mirabilis", full: "Proteus mirabilis", n: 97, gram: "neg" },
    { short: "P. aeruginosa", full: "Pseudomonas aeruginosa", n: 260, gram: "neg" },
    { short: "S. marcescens", full: "Serratia marcescens", n: 69, gram: "neg" },
    { short: "S. maltophilia*", full: "Stenotrophomonas maltophilia*", n: 56, gram: "neg" },
    { short: "E. faecalis", full: "Enterococcus faecalis", n: 202, gram: "pos" },
    { short: "E. faecium", full: "Enterococcus faecium", n: 60, gram: "pos" },
    { short: "All S. aureus", full: "All Staphylococcus aureus", n: 1300, gram: "pos" },
    { short: "MRSA", full: "Methicillin-resistant S. aureus", n: 545, gram: "pos" },
    { short: "MSSA", full: "Methicillin-susceptible S. aureus", n: 755, gram: "pos" },
    { short: "S. epidermidis", full: "Staphylococcus epidermidis", n: 197, gram: "pos" },
    { short: "S. lugdunensis", full: "Staphylococcus lugdunensis", n: 65, gram: "pos" },
    { short: "S. pneumoniae", full: "Streptococcus pneumoniae", n: 43, gram: "pos" },
  ],
  antibiotics: [
    "Amikacin (restricted)", "Ampicillin", "Amoxicillin/clavulanate", "Cefazolin",
    "Cefepime", "Ceftazidime (restricted)", "Ceftriaxone",
    "Ceftriaxone (meningitis)", "Ceftriaxone (non-meningitis)",
    "Ciprofloxacin", "Clindamycin", "Ertapenem (restricted)",
    "Erythromycin", "Gentamicin", "Levofloxacin",
    "Meropenem (restricted)", "Oxacillin/nafcillin",
    "Penicillin (meningitis)", "Penicillin",
    "Piperacillin/tazobactam", "Tetracycline", "Tobramycin",
    "TMP/SMX", "Vancomycin",
  ],
  data: [
    [100,100,100,100,100,100,99,null,100,null,null,null,null,null,null,null,null,null],
    [null,null,49,null,null,null,82,null,null,null,100,35,null,null,null,null,null,null],
    [null,null,72,null,85,78,85,null,null,null,null,null,null,null,null,null,null,null],
    [null,null,72,null,50,79,74,null,null,null,null,null,58,null,100,29,95,null],
    [91,92,91,96,96,89,99,89,100,null,null,null,null,null,null,null,null,null],
    [null,null,88,null,99,86,98,87,89,null,null,null,null,null,null,null,null,null],
    [null,null,84,null,89,84,98,null,90,null,null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,88],
    [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,91],
    [91,96,75,100,99,88,87,86,99,null,null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null,null,null,null,null,85,86,85,59,89,80],
    [95,88,99,94,97,99,100,null,98,null,null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,59],
    [93,97,88,100,97,95,93,null,100,null,null,null,null,null,null,null,null,null],
    [null,null,76,100,100,null,88,86,98,86,null,null,null,null,null,null,null,null],
    [100,99,100,100,99,100,100,89,99,null,null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null,null,null,null,null,58,null,100,30,98,null],
    [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,80],
    [null,null,null,null,null,null,null,null,null,null,98,null,null,null,null,null,null,93],
    [null,null,94,90,89,91,100,87,92,null,null,null,null,null,null,null,null,null],
    [82,91,72,90,89,77,null,null,30,null,null,null,73,49,null,77,90,78],
    [93,97,86,100,96,90,92,98,90,null,null,null,null,null,null,null,null,null],
    [89,92,74,97,94,77,77,null,100,89,null,null,94,92,96,53,100,71],
    [null,null,null,null,null,null,null,null,null,null,98,60,100,100,100,100,100,null],
  ],
};

const ADULT_URINE = {
  title: "Adult Urine",
  period: "Jan 1 – Dec 31, 2024",
  notes: [
    "Use for urine pathogens only",
    "S. aureus susceptibility to oxacillin predicts susceptibility to cefazolin",
    "* Data based on isolates over 2 calendar years (2023–2024)",
    "AmpC derepression risk with prolonged 3rd-gen cephalosporins"
  ],
  organisms: [
    { short: "C. freundii", full: "Citrobacter freundii", n: 79, gram: "neg" },
    { short: "E. cloacae", full: "Enterobacter cloacae complex", n: 118, gram: "neg" },
    { short: "E. coli", full: "Escherichia coli", n: 2677, gram: "neg" },
    { short: "K. aerogenes", full: "Klebsiella aerogenes", n: 52, gram: "neg" },
    { short: "K. oxytoca", full: "Klebsiella oxytoca", n: 99, gram: "neg" },
    { short: "K. pneumoniae", full: "Klebsiella pneumoniae", n: 448, gram: "neg" },
    { short: "M. morganii", full: "Morganella morganii", n: 34, gram: "neg" },
    { short: "P. mirabilis", full: "Proteus mirabilis", n: 245, gram: "neg" },
    { short: "P. aeruginosa", full: "Pseudomonas aeruginosa", n: 171, gram: "neg" },
    { short: "S. marcescens*", full: "Serratia marcescens*", n: 66, gram: "neg" },
    { short: "E. faecalis", full: "Enterococcus faecalis", n: 428, gram: "pos" },
    { short: "E. faecium", full: "Enterococcus faecium", n: 62, gram: "pos" },
    { short: "All S. aureus", full: "All Staphylococcus aureus", n: 105, gram: "pos" },
    { short: "S. epidermidis", full: "Staphylococcus epidermidis", n: 156, gram: "pos" },
    { short: "S. haemolyticus*", full: "Staphylococcus haemolyticus*", n: 39, gram: "pos" },
  ],
  antibiotics: [
    "Amikacin (restricted)", "Ampicillin", "Ampicillin/sulbactam",
    "Cefazolin", "Cefepime", "Cefoxitin", "Ceftazidime (restricted)",
    "Ceftriaxone", "Ciprofloxacin", "Ertapenem", "Gentamicin",
    "Levofloxacin", "Meropenem (restricted)", "Nitrofurantoin",
    "Oxacillin/nafcillin", "Penicillin G", "Piperacillin/tazobactam",
    "Tetracycline", "Tobramycin", "TMP/SMX", "Vancomycin",
  ],
  data: [
    [100,100,99,100,100,99,100,99,98,100,null,null,null,null,null],
    [null,null,60,null,null,null,null,86,null,null,99,23,null,null,null],
    [null,null,69,null,72,78,null,91,null,null,null,null,null,null,null],
    [null,null,89,null,51,84,null,91,null,null,null,null,65,42,24],
    [97,88,93,100,90,89,100,98,91,97,null,null,null,null,null],
    [null,null,97,null,97,94,81,97,null,null,null,null,null,null,null],
    [78,71,92,75,90,87,76,98,88,65,null,null,null,null,null],
    [70,68,91,65,88,86,81,97,null,70,null,null,null,null,null],
    [92,88,79,96,89,81,70,88,86,88,81,18,null,null,null],
    [96,85,100,96,100,99,100,100,null,98,null,null,null,null,null],
    [99,97,92,100,92,95,84,90,null,100,null,null,null,null,null],
    [94,93,83,96,97,89,73,90,81,91,91,27,null,null,null],
    [100,100,100,98,100,100,100,100,90,100,null,null,null,null,null],
    [95,46,98,40,96,52,null,null,null,null,99,55,100,100,97],
    [null,null,null,null,null,null,null,null,null,null,null,null,65,46,23],
    [null,null,null,null,null,null,null,null,null,null,99,21,null,null,null],
    [89,81,98,84,92,93,95,100,89,77,null,null,null,null,null],
    [92,88,76,90,85,77,59,null,null,null,33,42,82,81,62],
    [96,91,91,100,91,92,86,88,97,76,null,null,null,null,null],
    [90,84,77,92,84,82,70,84,null,98,null,null,97,63,62],
    [null,null,null,null,null,null,null,null,null,null,99,68,100,100,100],
  ],
};

const ALL_TABLES = {
  "peds-nonurine": PEDS_NON_URINE,
  "peds-urine": PEDS_URINE,
  "adult-nonurine": ADULT_NON_URINE,
  "adult-urine": ADULT_URINE,
};

// ─── LEARNER CONTENT ────────────────────────────────────────────────────────

const TEACHING = {
  "what-is-antibiogram": {
    title: "What Is an Antibiogram?",
    content: "An antibiogram is a periodic summary (usually annual) of antimicrobial susceptibilities of local bacterial isolates from clinical cultures. It reflects your institution's local resistance patterns, which may differ significantly from national data. Numbers represent the percentage of tested isolates susceptible to each antibiotic. A minimum of 30 isolates is generally required for statistical reliability (CLSI M39 guideline). Each patient isolate is counted only once per year to avoid skewing from repeat cultures."
  },
  "reading-values": {
    title: "Reading the Numbers",
    content: "Each cell shows the % of isolates susceptible. ≥90% is generally considered reliable for empiric therapy. 80–89% may be acceptable depending on clinical context (infection severity, source, patient factors). <80% suggests the antibiotic is not a strong empiric choice for that organism. A dash (—) means insufficient data or intrinsic resistance/not tested. Always consider site of infection, drug penetration, bioavailability, and patient-specific factors alongside these numbers."
  },
  "mrsa-rate": {
    title: "MRSA Rates",
    content: "OHSU's pediatric MRSA rate is 22%, meaning ~1 in 5 S. aureus isolates in children are methicillin-resistant. The adult rate is 42%. This informs empiric coverage decisions: in pediatric soft tissue infections, cefazolin/cephalexin (anti-MSSA) may be reasonable first-line in many scenarios, while adults more often need MRSA-active agents empirically. Oxacillin susceptibility predicts cefazolin susceptibility — if an isolate is oxacillin-susceptible, cefazolin will work."
  },
  "restricted-abx": {
    title: "Restricted Antibiotics",
    content: "Antibiotics marked '(restricted)' require ID approval or specific clinical criteria at OHSU. This antimicrobial stewardship practice preserves efficacy of broad-spectrum agents (carbapenems, amikacin), reduces C. difficile risk, and slows resistance development. Ciprofloxacin is restricted in pediatrics due to musculoskeletal concerns in developing children. If you need a restricted agent, contact the ID pharmacist at pager 16695."
  },
  "ampc": {
    title: "AmpC β-Lactamase Producers",
    content: "Organisms like Enterobacter cloacae, Citrobacter freundii, Serratia marcescens, and Morganella morganii can harbor inducible AmpC β-lactamases. Initial susceptibility testing may show sensitivity to 3rd-gen cephalosporins, but resistance can emerge during therapy via derepression (typically within 3–4 days). Cefepime is generally stable against AmpC and is preferred over ceftriaxone for serious infections with these organisms. Carbapenems are definitive but should be reserved."
  },
  "empiric-uti": {
    title: "Empiric UTI Therapy Tips",
    content: "For uncomplicated pediatric UTI (E. coli most common): cephalexin or cefazolin have 92% susceptibility. TMP/SMX at 75% is lower than ideal but still used when culture is pending. Nitrofurantoin at 98% is excellent for lower tract infections but does NOT achieve therapeutic levels in renal tissue — not for pyelonephritis. For complicated UTI or pyelonephritis: ceftriaxone (95%) or cefepime (96%) are strong empiric choices. Always narrow based on culture results."
  },
  "gram-stain": {
    title: "Gram Stain Guidance",
    content: "Gram-negative organisms (pink/red on Gram stain) include Enterobacteriaceae (E. coli, Klebsiella, Proteus, Enterobacter) and non-fermenters (Pseudomonas, Stenotrophomonas). Gram-positive organisms (purple/blue) include staphylococci, streptococci, and enterococci. Empiric coverage should align with the most likely organism based on infection site and clinical scenario. The antibiogram then helps select the most likely effective agent within the appropriate drug class."
  }
};

// ─── COST DATA ───────────────────────────────────────────────────────────────

const COST = {
  "Amikacin (restricted)": { iv: "<$", po: "—" },
  "Ampicillin": { iv: "<$", po: "<$" },
  "Amoxicillin/clavulanate": { iv: "<$", po: "<$" },
  "Ampicillin/sulbactam": { iv: "<$", po: "<$" },
  "Cefazolin": { iv: "<$", po: "<$" },
  "Cefepime": { iv: "<$", po: "—" },
  "Cefoxitin": { iv: "<$", po: "—" },
  "Ceftriaxone": { iv: "<$", po: "<$" },
  "Ceftriaxone (meningitis)": { iv: "<$", po: "—" },
  "Ceftriaxone (non-meningitis)": { iv: "<$", po: "<$" },
  "Ceftazidime (restricted)": { iv: "<$", po: "—" },
  "Ciprofloxacin": { iv: "<$", po: "<$" },
  "Ciprofloxacin (restricted)": { iv: "<$", po: "<$" },
  "Clindamycin": { iv: "<$", po: "$" },
  "Ertapenem (restricted)": { iv: "$$", po: "—" },
  "Ertapenem": { iv: "$$", po: "—" },
  "Erythromycin": { iv: "—", po: "—" },
  "Gentamicin": { iv: "<$", po: "—" },
  "Levofloxacin": { iv: "<$", po: "<$" },
  "Levofloxacin (restricted)": { iv: "<$", po: "<$" },
  "Meropenem (restricted)": { iv: "$$", po: "—" },
  "Nitrofurantoin": { iv: "—", po: "<$" },
  "Oxacillin/nafcillin": { iv: "$$", po: "—" },
  "Penicillin": { iv: "<$", po: "<$" },
  "Penicillin G": { iv: "<$", po: "<$" },
  "Penicillin (meningitis)": { iv: "<$", po: "—" },
  "Penicillin (non-meningitis)": { iv: "<$", po: "<$" },
  "Piperacillin/tazobactam": { iv: "$", po: "—" },
  "Tetracycline": { iv: "<$", po: "$$" },
  "Tobramycin": { iv: "<$", po: "—" },
  "TMP/SMX": { iv: "$$", po: "<$" },
  "Vancomycin": { iv: "<$", po: "—" },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function getSusceptColor(val) {
  if (val === null || val === undefined) return { bg: "transparent", text: "#94a3b8", label: "—" };
  if (val >= 90) return { bg: "#064e3b", text: "#6ee7b7", label: `${val}%` };
  if (val >= 80) return { bg: "#713f12", text: "#fcd34d", label: `${val}%` };
  if (val >= 70) return { bg: "#7c2d12", text: "#fdba74", label: `${val}%` };
  return { bg: "#7f1d1d", text: "#fca5a5", label: `${val}%` };
}

function getSusceptBadge(val) {
  if (val === null || val === undefined) return { className: "badge-na", label: "—" };
  if (val >= 90) return { className: "badge-good", label: `${val}%` };
  if (val >= 80) return { className: "badge-ok", label: `${val}%` };
  if (val >= 70) return { className: "badge-warn", label: `${val}%` };
  return { className: "badge-poor", label: `${val}%` };
}

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function AntibiogramWizard() {
  const [population, setPopulation] = useState(null); // "peds" | "adult"
  const [source, setSource] = useState(null); // "urine" | "nonurine"
  const [selectedOrganism, setSelectedOrganism] = useState(null);
  const [learnerMode, setLearnerMode] = useState(false);
  const [openTeaching, setOpenTeaching] = useState(null);
  const [viewMode, setViewMode] = useState("wizard"); // "wizard" | "table"
  const [searchAbx, setSearchAbx] = useState("");

  const tableKey = population && source ? `${population}-${source}` : null;
  const table = tableKey ? ALL_TABLES[tableKey] : null;

  const reset = () => {
    setPopulation(null);
    setSource(null);
    setSelectedOrganism(null);
    setSearchAbx("");
  };

  const orgResults = useMemo(() => {
    if (!table || selectedOrganism === null) return [];
    const orgIdx = selectedOrganism;
    return table.antibiotics.map((abx, abxIdx) => ({
      name: abx,
      value: table.data[abxIdx][orgIdx],
      cost: COST[abx] || { iv: "?", po: "?" },
    })).filter(r => r.value !== null && r.value !== undefined)
      .sort((a, b) => b.value - a.value);
  }, [table, selectedOrganism]);

  const filteredResults = useMemo(() => {
    if (!searchAbx) return orgResults;
    const q = searchAbx.toLowerCase();
    return orgResults.filter(r => r.name.toLowerCase().includes(q));
  }, [orgResults, searchAbx]);

  // ─── RENDER ──────────────────────────────────────────────────────────────

  return (
    <div style={styles.root}>
      <style>{cssText}</style>

      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div>
            <h1 style={styles.h1}>OHSU Antibiogram</h1>
            <p style={styles.subtitle}>Interactive Susceptibility Guide · 2024 Data</p>
          </div>
          <div style={styles.headerControls}>
            <button
              onClick={() => setLearnerMode(!learnerMode)}
              className={`learner-toggle ${learnerMode ? "active" : ""}`}
            >
              <span style={{ fontSize: 14 }}>{learnerMode ? "📖" : "📕"}</span>
              <span>Learner {learnerMode ? "ON" : "OFF"}</span>
            </button>
            {table && (
              <button
                onClick={() => setViewMode(viewMode === "wizard" ? "table" : "wizard")}
                className="view-toggle"
              >
                {viewMode === "wizard" ? "▦ Full Table" : "◉ Wizard"}
              </button>
            )}
          </div>
        </div>
      </header>

      <div style={styles.body}>
        {/* LEARNER PANEL */}
        {learnerMode && (
          <div className="learner-panel">
            <div className="learner-panel-header">
              <span style={{ fontSize: 15 }}>📖</span>
              <span style={{ fontWeight: 700, fontSize: 13, letterSpacing: "0.04em" }}>LEARNER MODE</span>
            </div>
            <div className="teaching-grid">
              {Object.entries(TEACHING).map(([key, t]) => (
                <button
                  key={key}
                  className={`teaching-card ${openTeaching === key ? "open" : ""}`}
                  onClick={() => setOpenTeaching(openTeaching === key ? null : key)}
                >
                  <div className="teaching-card-title">
                    <span>{t.title}</span>
                    <span className="teaching-chevron">{openTeaching === key ? "−" : "+"}</span>
                  </div>
                  {openTeaching === key && (
                    <div className="teaching-card-body">{t.content}</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 1: POPULATION */}
        {!population && (
          <div className="step-container">
            <p className="step-label">Select Patient Population</p>
            <div className="card-grid-2">
              <button className="select-card" onClick={() => setPopulation("peds")}>
                <span className="card-icon">👶</span>
                <span className="card-title">Pediatric</span>
                <span className="card-desc">Doernbecher Children's Hospital</span>
              </button>
              <button className="select-card" onClick={() => setPopulation("adult")}>
                <span className="card-icon">🧑</span>
                <span className="card-title">Adult</span>
                <span className="card-desc">OHSU Adult Hospital</span>
              </button>
            </div>
            {learnerMode && (
              <div className="inline-teach">
                <strong>💡 Why does population matter?</strong> Resistance patterns differ between pediatric and adult populations. For example, the MRSA rate is 22% in peds vs. 42% in adults at OHSU. Separate antibiograms reflect these differences and guide more accurate empiric therapy.
              </div>
            )}
          </div>
        )}

        {/* STEP 2: SOURCE */}
        {population && !source && (
          <div className="step-container">
            <button className="back-btn" onClick={() => setPopulation(null)}>← Back</button>
            <p className="step-label">Select Infection Source</p>
            <div className="card-grid-2">
              <button className="select-card" onClick={() => setSource("nonurine")}>
                <span className="card-icon">🩸</span>
                <span className="card-title">Non-Urine</span>
                <span className="card-desc">Blood, wound, respiratory, CSF, etc.</span>
              </button>
              <button className="select-card" onClick={() => setSource("urine")}>
                <span className="card-icon">🧪</span>
                <span className="card-title">Urine</span>
                <span className="card-desc">Urinary tract isolates only</span>
              </button>
            </div>
            {learnerMode && (
              <div className="inline-teach">
                <strong>💡 Why separate urine data?</strong> Urinary concentrations of many antibiotics differ dramatically from serum levels. Nitrofurantoin achieves therapeutic levels only in urine. Fluoroquinolone breakpoints may differ. The urine antibiogram reflects tested-and-reported antibiotics specific to urinary isolates.
              </div>
            )}
          </div>
        )}

        {/* STEP 3: ORGANISM or TABLE VIEW */}
        {table && viewMode === "wizard" && selectedOrganism === null && (
          <div className="step-container">
            <button className="back-btn" onClick={() => setSource(null)}>← Back</button>
            <p className="step-label">Select Organism — {table.title}</p>
            <p className="step-period">{table.period}</p>

            <div className="org-section-label">Gram-Negative</div>
            <div className="org-grid">
              {table.organisms.map((org, i) =>
                org.gram === "neg" ? (
                  <button key={i} className="org-card" onClick={() => setSelectedOrganism(i)}>
                    <span className="org-name">{org.short}</span>
                    <span className="org-n">n={org.n}</span>
                  </button>
                ) : null
              )}
            </div>

            <div className="org-section-label" style={{ marginTop: 16 }}>Gram-Positive</div>
            <div className="org-grid">
              {table.organisms.map((org, i) =>
                org.gram === "pos" ? (
                  <button key={i} className="org-card gp" onClick={() => setSelectedOrganism(i)}>
                    <span className="org-name">{org.short}</span>
                    <span className="org-n">n={org.n}</span>
                  </button>
                ) : null
              )}
            </div>

            {learnerMode && (
              <div className="inline-teach">
                <strong>💡 Isolate counts matter.</strong> The (n=) next to each organism is the number of isolates tested. Higher n means more statistically reliable susceptibility data. CLSI recommends a minimum of 30 isolates. An organism with n=31 is at the margin — interpret those percentages with more caution than one with n=250.
              </div>
            )}
          </div>
        )}

        {/* STEP 4: RESULTS */}
        {table && viewMode === "wizard" && selectedOrganism !== null && (
          <div className="step-container">
            <button className="back-btn" onClick={() => { setSelectedOrganism(null); setSearchAbx(""); }}>← Back to organisms</button>
            <div className="results-header">
              <div>
                <h2 className="results-org-name">{table.organisms[selectedOrganism].full}</h2>
                <p className="results-meta">n = {table.organisms[selectedOrganism].n} · {table.title} · {table.period}</p>
              </div>
            </div>

            <input
              type="text"
              placeholder="Filter antibiotics..."
              value={searchAbx}
              onChange={e => setSearchAbx(e.target.value)}
              className="abx-search"
            />

            {learnerMode && (
              <div className="legend-bar">
                <span className="legend-item"><span className="legend-dot good"></span> ≥90% — reliable empiric</span>
                <span className="legend-item"><span className="legend-dot ok"></span> 80–89% — consider context</span>
                <span className="legend-item"><span className="legend-dot warn"></span> 70–79% — caution</span>
                <span className="legend-item"><span className="legend-dot poor"></span> &lt;70% — poor empiric choice</span>
              </div>
            )}

            <div className="results-list">
              {filteredResults.map((r, i) => {
                const badge = getSusceptBadge(r.value);
                return (
                  <div key={i} className={`result-row ${r.name.includes("restricted") ? "restricted" : ""}`}>
                    <div className="result-name">
                      {r.name}
                      {r.name.includes("restricted") && <span className="restricted-tag">R</span>}
                    </div>
                    <div className="result-right">
                      <span className="cost-tag" title="IV / PO cost">
                        {r.cost.iv}{r.cost.po !== "—" ? ` / ${r.cost.po}` : ""}
                      </span>
                      <span className={`suscept-badge ${badge.className}`}>{badge.label}</span>
                    </div>
                  </div>
                );
              })}
              {filteredResults.length === 0 && (
                <p style={{ color: "#94a3b8", padding: 16, textAlign: "center" }}>No matching antibiotics</p>
              )}
            </div>

            {learnerMode && table.organisms[selectedOrganism].short.includes("cloacae") && (
              <div className="inline-teach">
                <strong>⚠️ AmpC Producer Alert:</strong> Enterobacter cloacae can harbor inducible AmpC β-lactamase. Even if initial susceptibility testing shows sensitivity to 3rd-gen cephalosporins (ceftriaxone, ceftazidime), resistance can emerge during therapy. Cefepime is stable against AmpC and preferred for serious infections. Consider infectious disease consultation.
              </div>
            )}

            <div className="notes-section">
              <p className="notes-title">📋 Table Notes</p>
              {table.notes.map((n, i) => (
                <p key={i} className="note-item">• {n}</p>
              ))}
            </div>
          </div>
        )}

        {/* FULL TABLE VIEW */}
        {table && viewMode === "table" && (
          <div className="step-container">
            <button className="back-btn" onClick={reset}>← Start Over</button>
            <h2 className="table-title">{table.title} — {table.period}</h2>
            <div className="table-scroll">
              <table className="full-table">
                <thead>
                  <tr>
                    <th className="sticky-col">Antibiotic</th>
                    {table.organisms.map((org, i) => (
                      <th key={i} className="org-th">
                        <div className="org-th-inner">
                          <span>{org.short}</span>
                          <span className="org-th-n">n={org.n}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.antibiotics.map((abx, abxIdx) => (
                    <tr key={abxIdx}>
                      <td className="sticky-col abx-cell">
                        {abx}
                        {abx.includes("restricted") && <span className="restricted-tag">R</span>}
                      </td>
                      {table.organisms.map((_, orgIdx) => {
                        const val = table.data[abxIdx][orgIdx];
                        const c = getSusceptColor(val);
                        return (
                          <td
                            key={orgIdx}
                            style={{
                              backgroundColor: c.bg,
                              color: c.text,
                              textAlign: "center",
                              fontWeight: val !== null ? 600 : 400,
                              fontSize: 12,
                            }}
                          >
                            {c.label}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="notes-section" style={{ marginTop: 16 }}>
              {table.notes.map((n, i) => (
                <p key={i} className="note-item">• {n}</p>
              ))}
            </div>
          </div>
        )}

        {/* FOOTER */}
        <footer style={styles.footer}>
          <p>OHSU Antibiogram · Doc HC-CKT-134-GUD Rev. 042425 · Data: Jan–Dec 2024</p>
          <p>For clinical reference only. Always confirm with culture & sensitivity results.</p>
          {(population || source) && viewMode === "wizard" && (
            <button className="reset-btn" onClick={reset}>⟲ Start Over</button>
          )}
        </footer>
      </div>
    </div>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────

const styles = {
  root: {
    fontFamily: "'IBM Plex Sans', 'SF Pro Text', -apple-system, sans-serif",
    minHeight: "100vh",
    background: "#0f172a",
    color: "#e2e8f0",
  },
  header: {
    background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
    borderBottom: "1px solid #1e3a5f",
    padding: "16px 20px",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  headerInner: {
    maxWidth: 900,
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
  },
  h1: {
    fontSize: 20,
    fontWeight: 700,
    margin: 0,
    color: "#f1f5f9",
    letterSpacing: "-0.01em",
  },
  subtitle: {
    fontSize: 12,
    color: "#64748b",
    margin: "2px 0 0",
    letterSpacing: "0.02em",
  },
  headerControls: {
    display: "flex",
    gap: 8,
    alignItems: "center",
  },
  body: {
    maxWidth: 900,
    margin: "0 auto",
    padding: "16px 16px 40px",
  },
  footer: {
    marginTop: 32,
    padding: "16px 0",
    borderTop: "1px solid #1e293b",
    textAlign: "center",
    fontSize: 11,
    color: "#475569",
    lineHeight: 1.6,
  },
};

const cssText = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

* { box-sizing: border-box; }

.learner-toggle {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 14px; border-radius: 20px;
  border: 1px solid #334155; background: #1e293b;
  color: #94a3b8; font-size: 12px; font-weight: 600;
  cursor: pointer; transition: all 0.2s;
  font-family: inherit;
}
.learner-toggle:hover { border-color: #3b82f6; color: #bfdbfe; }
.learner-toggle.active {
  background: #1e3a5f; border-color: #3b82f6; color: #93c5fd;
  box-shadow: 0 0 12px rgba(59,130,246,0.15);
}

.view-toggle {
  padding: 6px 14px; border-radius: 20px;
  border: 1px solid #334155; background: #1e293b;
  color: #94a3b8; font-size: 12px; font-weight: 600;
  cursor: pointer; transition: all 0.2s;
  font-family: inherit;
}
.view-toggle:hover { border-color: #64748b; color: #cbd5e1; }

.learner-panel {
  background: linear-gradient(135deg, #172554 0%, #1e1b4b 100%);
  border: 1px solid #1e3a5f;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  animation: slideDown 0.3s ease;
}
@keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }

.learner-panel-header {
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 12px; color: #93c5fd;
  text-transform: uppercase;
}

.teaching-grid {
  display: flex; flex-direction: column; gap: 6px;
}

.teaching-card {
  background: rgba(30,58,95,0.4);
  border: 1px solid #1e3a5f;
  border-radius: 8px;
  padding: 0;
  cursor: pointer;
  text-align: left;
  color: #cbd5e1;
  font-family: inherit;
  transition: all 0.15s;
}
.teaching-card:hover { border-color: #3b82f6; }
.teaching-card.open { border-color: #3b82f6; background: rgba(30,58,95,0.6); }

.teaching-card-title {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 14px;
  font-size: 13px; font-weight: 600;
}
.teaching-chevron { color: #64748b; font-size: 16px; font-weight: 400; }
.teaching-card-body {
  padding: 0 14px 12px;
  font-size: 12.5px; line-height: 1.65;
  color: #94a3b8;
  border-top: 1px solid #1e3a5f;
  padding-top: 10px;
  margin-top: 0;
}

.step-container {
  animation: fadeIn 0.25s ease;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.step-label {
  font-size: 16px; font-weight: 700; color: #f1f5f9;
  margin: 0 0 16px; letter-spacing: -0.01em;
}
.step-period {
  font-size: 12px; color: #64748b; margin: -12px 0 16px;
}

.back-btn {
  background: none; border: none; color: #3b82f6;
  font-size: 13px; font-weight: 500; cursor: pointer;
  padding: 4px 0; margin-bottom: 12px;
  font-family: inherit;
}
.back-btn:hover { color: #93c5fd; }

.card-grid-2 {
  display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
}
@media (max-width: 500px) { .card-grid-2 { grid-template-columns: 1fr; } }

.select-card {
  display: flex; flex-direction: column; align-items: center;
  gap: 6px; padding: 28px 16px;
  background: #1e293b;
  border: 1px solid #334155; border-radius: 12px;
  cursor: pointer; transition: all 0.2s;
  font-family: inherit; color: inherit;
}
.select-card:hover {
  border-color: #3b82f6;
  background: #172554;
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(59,130,246,0.12);
}
.card-icon { font-size: 32px; }
.card-title { font-size: 16px; font-weight: 700; color: #f1f5f9; }
.card-desc { font-size: 12px; color: #64748b; }

.org-section-label {
  font-size: 11px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.08em; color: #64748b;
  margin-bottom: 8px; padding-left: 4px;
}

.org-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 8px;
  margin-bottom: 4px;
}

.org-card {
  display: flex; flex-direction: column; gap: 2px;
  padding: 12px 14px;
  background: #1e293b; border: 1px solid #2d4a3e;
  border-radius: 8px; cursor: pointer;
  transition: all 0.15s;
  text-align: left;
  font-family: inherit; color: inherit;
}
.org-card:hover { border-color: #34d399; background: #064e3b; transform: translateY(-1px); }
.org-card.gp { border-color: #4a3560; }
.org-card.gp:hover { border-color: #a78bfa; background: #3b0764; }

.org-name {
  font-size: 13px; font-weight: 600; color: #e2e8f0;
  font-style: italic;
}
.org-n { font-size: 11px; color: #64748b; font-family: 'IBM Plex Mono', monospace; }

.inline-teach {
  margin-top: 16px; padding: 12px 16px;
  background: rgba(30,58,95,0.3);
  border-left: 3px solid #3b82f6;
  border-radius: 0 8px 8px 0;
  font-size: 12.5px; line-height: 1.6;
  color: #94a3b8;
  animation: slideDown 0.3s ease;
}

.results-header {
  margin-bottom: 12px;
}
.results-org-name {
  font-size: 18px; font-weight: 700; color: #f1f5f9;
  margin: 0; font-style: italic;
}
.results-meta {
  font-size: 12px; color: #64748b; margin: 4px 0 0;
  font-family: 'IBM Plex Mono', monospace;
}

.abx-search {
  width: 100%; padding: 10px 14px;
  background: #1e293b; border: 1px solid #334155;
  border-radius: 8px; color: #e2e8f0;
  font-size: 13px; font-family: inherit;
  margin-bottom: 12px;
  outline: none;
}
.abx-search:focus { border-color: #3b82f6; }
.abx-search::placeholder { color: #475569; }

.legend-bar {
  display: flex; flex-wrap: wrap; gap: 12px;
  margin-bottom: 12px; font-size: 11px; color: #94a3b8;
}
.legend-item { display: flex; align-items: center; gap: 5px; }
.legend-dot {
  width: 10px; height: 10px; border-radius: 3px;
}
.legend-dot.good { background: #064e3b; border: 1px solid #6ee7b7; }
.legend-dot.ok { background: #713f12; border: 1px solid #fcd34d; }
.legend-dot.warn { background: #7c2d12; border: 1px solid #fdba74; }
.legend-dot.poor { background: #7f1d1d; border: 1px solid #fca5a5; }

.results-list {
  display: flex; flex-direction: column; gap: 2px;
}

.result-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 14px;
  background: #1e293b;
  border-radius: 6px;
  transition: background 0.1s;
}
.result-row:hover { background: #273549; }
.result-row.restricted { border-left: 3px solid #ef4444; }

.result-name {
  font-size: 13px; font-weight: 500; color: #cbd5e1;
  display: flex; align-items: center; gap: 6px;
}
.restricted-tag {
  font-size: 9px; font-weight: 700; color: #ef4444;
  background: rgba(239,68,68,0.15);
  padding: 1px 5px; border-radius: 3px;
  letter-spacing: 0.05em;
}

.result-right {
  display: flex; align-items: center; gap: 10px;
}
.cost-tag {
  font-size: 11px; color: #64748b;
  font-family: 'IBM Plex Mono', monospace;
}

.suscept-badge {
  display: inline-block; min-width: 48px;
  text-align: center; padding: 4px 10px;
  border-radius: 6px;
  font-size: 13px; font-weight: 700;
  font-family: 'IBM Plex Mono', monospace;
}
.badge-good { background: #064e3b; color: #6ee7b7; }
.badge-ok { background: #713f12; color: #fcd34d; }
.badge-warn { background: #7c2d12; color: #fdba74; }
.badge-poor { background: #7f1d1d; color: #fca5a5; }
.badge-na { background: transparent; color: #475569; }

.notes-section {
  margin-top: 20px; padding: 12px 16px;
  background: rgba(30,41,59,0.5);
  border-radius: 8px; border: 1px solid #1e293b;
}
.notes-title { font-size: 12px; font-weight: 700; color: #64748b; margin: 0 0 6px; }
.note-item { font-size: 12px; color: #64748b; margin: 3px 0; line-height: 1.5; }

.reset-btn {
  margin-top: 12px;
  background: none; border: 1px solid #334155;
  color: #64748b; padding: 6px 16px;
  border-radius: 6px; cursor: pointer;
  font-size: 12px; font-family: inherit;
  transition: all 0.15s;
}
.reset-btn:hover { border-color: #64748b; color: #94a3b8; }

/* ── FULL TABLE ── */
.table-title {
  font-size: 16px; font-weight: 700; color: #f1f5f9;
  margin: 0 0 12px;
}
.table-scroll {
  overflow-x: auto; border-radius: 8px;
  border: 1px solid #1e293b;
}
.full-table {
  width: max-content; min-width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}
.full-table th, .full-table td {
  padding: 6px 8px;
  border: 1px solid #1e293b;
  white-space: nowrap;
}
.full-table thead th {
  background: #1e293b; color: #94a3b8;
  font-weight: 600; position: sticky; top: 0; z-index: 2;
}
.sticky-col {
  position: sticky; left: 0; z-index: 3;
  background: #0f172a !important;
  font-weight: 500; color: #cbd5e1;
  min-width: 180px;
}
.full-table thead .sticky-col { z-index: 4; background: #1e293b !important; }
.org-th { text-align: center; min-width: 70px; }
.org-th-inner { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.org-th-n { font-size: 10px; color: #475569; font-family: 'IBM Plex Mono', monospace; font-weight: 400; }
.abx-cell { font-size: 12px; }
`;
