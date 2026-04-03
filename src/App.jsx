import { useState, useMemo } from "react";

// ─── ANTIBIOGRAM DATA ───────────────────────────────────────────────────────

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
    "Amikacin (restricted)","Ampicillin","Amoxicillin/clavulanate","Cefazolin",
    "Cefepime","Ceftazidime (restricted)","Ceftriaxone",
    "Ceftriaxone (meningitis)","Ceftriaxone (non-meningitis)",
    "Ciprofloxacin (restricted)","Clindamycin","Ertapenem (restricted)",
    "Erythromycin","Gentamicin","Levofloxacin (restricted)",
    "Meropenem (restricted)","Oxacillin/nafcillin",
    "Penicillin (meningitis)","Penicillin (non-meningitis)",
    "Piperacillin/tazobactam","Tetracycline","Tobramycin","TMP/SMX","Vancomycin",
  ],
  data: [
    [100,98,null,null,null,null,null],[null,43,null,null,null,null,null],
    [null,83,null,null,null,null,null],[null,74,null,78,null,100,null],
    [97,93,97,null,null,null,null],[null,93,96,null,null,null,null],
    [null,85,null,null,null,null,null],[null,null,null,null,null,null,98],
    [null,null,null,null,null,null,100],[97,85,91,null,null,null,null],
    [null,null,null,88,93,87,null],[94,100,null,null,null,null,null],
    [null,null,null,98,null,98,69],[97,93,null,98,null,98,null],
    [100,85,90,null,null,null,null],[100,100,94,null,null,null,null],
    [null,null,null,78,null,100,null],[null,null,null,null,null,null,84],
    [null,null,null,null,null,null,100],[null,89,96,null,null,null,null],
    [94,61,null,91,79,94,97],[97,89,94,null,null,null,null],
    [100,74,null,98,94,99,88],[null,null,null,100,100,100,null],
  ],
};

const PEDS_URINE = {
  title: "Pediatric Urine", period: "Jan 1 – Dec 31, 2024",
  notes: ["Use for urine pathogens only","S. aureus susceptibility to oxacillin predicts susceptibility to cefazolin","* Data based on isolates over 2 calendar years (2023–2024)","AmpC derepression risk with prolonged 3rd-gen cephalosporins"],
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
    "Amikacin (restricted)","Ampicillin","Ampicillin/sulbactam","Cefazolin",
    "Cefepime","Cefoxitin","Ceftazidime (restricted)","Ceftriaxone",
    "Ciprofloxacin (restricted)","Ertapenem","Gentamicin",
    "Levofloxacin (restricted)","Meropenem (restricted)","Nitrofurantoin",
    "Oxacillin/nafcillin","Penicillin G","Piperacillin/tazobactam",
    "Tetracycline","Tobramycin","TMP/SMX","Vancomycin",
  ],
  data: [
    [100,98,100,97,92,null,null,null],[60,null,null,91,null,100,null,null],
    [67,81,89,94,null,null,null,null],[92,57,91,97,null,null,68,38],
    [96,93,96,100,92,null,null,null],[97,95,94,100,null,null,null,null],
    [95,93,92,100,94,null,null,null],[95,88,92,100,null,null,null,null],
    [87,90,85,100,94,90,null,null],[100,95,98,100,null,null,null,null],
    [91,93,94,94,null,null,null,null],[91,90,94,100,92,100,null,null],
    [100,98,98,100,97,null,null,null],[98,90,64,null,null,100,100,100],
    [null,null,null,null,null,null,68,38],[null,null,null,null,null,100,null,null],
    [98,93,96,100,97,null,null,null],[82,81,null,null,null,31,94,85],
    [92,88,92,94,97,null,null,null],[75,74,77,94,null,null,100,50],
    [null,null,null,null,null,100,100,100],
  ],
};

const ADULT_NON_URINE = {
  title: "Adult Non-Urine", period: "Jan 1 – Dec 31, 2024",
  notes: ["Adult MRSA rate: 42%","P. aeruginosa susceptibilities exclude CF patients","Erythromycin susceptibility surrogate for azithromycin in S. pneumoniae","S. aureus susceptibility to oxacillin predicts susceptibility to cefazolin","* Data based on isolates over 2 calendar years (2023–2024)"],
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
    "Amikacin (restricted)","Ampicillin","Amoxicillin/clavulanate","Cefazolin",
    "Cefepime","Ceftazidime (restricted)","Ceftriaxone",
    "Ceftriaxone (meningitis)","Ceftriaxone (non-meningitis)",
    "Ciprofloxacin","Clindamycin","Ertapenem (restricted)",
    "Erythromycin","Gentamicin","Levofloxacin",
    "Meropenem (restricted)","Oxacillin/nafcillin",
    "Penicillin (meningitis)","Penicillin",
    "Piperacillin/tazobactam","Tetracycline","Tobramycin","TMP/SMX","Vancomycin",
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
  title: "Adult Urine", period: "Jan 1 – Dec 31, 2024",
  notes: ["Use for urine pathogens only","S. aureus susceptibility to oxacillin predicts susceptibility to cefazolin","* Data based on isolates over 2 calendar years (2023–2024)","AmpC derepression risk with prolonged 3rd-gen cephalosporins"],
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
    "Amikacin (restricted)","Ampicillin","Ampicillin/sulbactam",
    "Cefazolin","Cefepime","Cefoxitin","Ceftazidime (restricted)",
    "Ceftriaxone","Ciprofloxacin","Ertapenem","Gentamicin",
    "Levofloxacin","Meropenem (restricted)","Nitrofurantoin",
    "Oxacillin/nafcillin","Penicillin G","Piperacillin/tazobactam",
    "Tetracycline","Tobramycin","TMP/SMX","Vancomycin",
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

const ALL_TABLES = { "peds-nonurine": PEDS_NON_URINE, "peds-urine": PEDS_URINE, "adult-nonurine": ADULT_NON_URINE, "adult-urine": ADULT_URINE };

// ─── CLINICAL SYNDROMES ─────────────────────────────────────────────────────

const SYNDROMES = {
  appendicitis: {
    icon: "🔥", title: "Appendicitis",
    description: "Intra-abdominal — polymicrobial GNR + anaerobic coverage",
    peds: {
      tableKey: "peds-nonurine", organisms: ["E. coli", "P. aeruginosa"],
      teaching: "Appendicitis is polymicrobial: aerobic GNRs (primarily E. coli) plus anaerobes (B. fragilis — not on antibiogram). Empiric regimens must cover both. Piperacillin/tazobactam covers GNRs + anaerobes in one agent. Alternatively, ceftriaxone + metronidazole (metronidazole handles the anaerobic gap). For perforated/complicated cases, broader GNR + Pseudomonas coverage is typical.",
      regimens: [
        { name: "Simple appendicitis", drugs: ["Ceftriaxone + Metronidazole"], note: "Metronidazole for anaerobic coverage (B. fragilis not on antibiogram). Ceftriaxone covers E. coli at 85%." },
        { name: "Complicated / Perforated", drugs: ["Piperacillin/tazobactam"], note: "Pip/tazo covers GNRs + anaerobes. E. coli 89%, Pseudomonas 96%." },
        { name: "Complicated + PCN allergy", drugs: ["Cefepime + Metronidazole"], note: "Cefepime: E. coli 93%, Pseudomonas 97%. Add metronidazole for anaerobes." },
      ],
    },
    adult: {
      tableKey: "adult-nonurine", organisms: ["E. coli", "P. aeruginosa", "K. pneumoniae"],
      teaching: "Same polymicrobial principles. Adult regimens use pip/tazo or cefepime/ceftriaxone + metronidazole. E. coli resistance to fluoroquinolones (75%) and ampicillin (49%) makes these poor empiric choices.",
      regimens: [
        { name: "Simple appendicitis", drugs: ["Ceftriaxone + Metronidazole"], note: "Ceftriaxone: E. coli 84%. Metronidazole for anaerobes." },
        { name: "Complicated / Perforated", drugs: ["Piperacillin/tazobactam"], note: "E. coli 94%, Pseudomonas 87%, K. pneumoniae 91%." },
        { name: "Complicated + PCN allergy", drugs: ["Cefepime + Metronidazole"], note: "Cefepime: E. coli 91%, Pseudomonas 89%, K. pneumoniae 89%." },
      ],
    },
  },
  uti: {
    icon: "🧪", title: "Urinary Tract Infection",
    description: "Cystitis and pyelonephritis — uses urine antibiogram",
    peds: {
      tableKey: "peds-urine", organisms: ["E. coli", "K. pneumoniae*", "P. mirabilis*"],
      teaching: "E. coli causes ~80% of pediatric UTIs. For cystitis, cephalexin/cefazolin are first-line (E. coli 92%). TMP/SMX at 75% is below ideal. Nitrofurantoin (98%) is excellent for cystitis but has no renal tissue levels — never for pyelonephritis. For febrile UTI, ceftriaxone (95%) is standard parenteral therapy.",
      regimens: [
        { name: "Uncomplicated cystitis", drugs: ["Cephalexin (PO)"], note: "Cefazolin/cephalexin: E. coli 92%. Preferred first-line oral agent." },
        { name: "Cystitis — alternative", drugs: ["Nitrofurantoin (PO)"], note: "E. coli 98%. Lower tract ONLY — no renal tissue penetration." },
        { name: "Febrile UTI / Pyelonephritis", drugs: ["Ceftriaxone (IV)"], note: "E. coli 95%. Transition to PO cephalexin or TMP/SMX per culture." },
        { name: "Complex / structural anomaly", drugs: ["Cefepime (IV)"], note: "E. coli 96%, Pseudomonas 92%. Broader coverage for anatomic risk." },
      ],
    },
    adult: {
      tableKey: "adult-urine", organisms: ["E. coli", "K. pneumoniae", "P. mirabilis"],
      teaching: "E. coli dominates (n=2677). Nitrofurantoin (98%) is IDSA first-line for uncomplicated cystitis. TMP/SMX at 77% is below the 80% threshold at OHSU. Fluoroquinolones are no longer first-line per IDSA for uncomplicated UTI.",
      regimens: [
        { name: "Uncomplicated cystitis", drugs: ["Nitrofurantoin (PO)"], note: "E. coli 98%. IDSA first-line. 5-day macrocrystals 100mg BID." },
        { name: "Cystitis — alternative", drugs: ["TMP/SMX (PO)"], note: "E. coli 77% — below ideal. Use if culture confirms susceptibility." },
        { name: "Pyelonephritis (outpatient)", drugs: ["Ciprofloxacin (PO) or Ceftriaxone (IV)"], note: "Cipro: E. coli 79%. Ceftriaxone: E. coli 91%. Check culture." },
        { name: "Complicated / Sepsis", drugs: ["Cefepime (IV) or Pip/tazo (IV)"], note: "Cefepime: E. coli 93%. Pip/tazo: E. coli 98%." },
      ],
    },
  },
  cf_exacerbation: {
    icon: "🫁", title: "CF Pulmonary Exacerbation",
    description: "Cystic fibrosis — Pseudomonas-directed therapy",
    peds: {
      tableKey: "peds-nonurine", organisms: ["P. aeruginosa"],
      teaching: "CRITICAL: The OHSU antibiogram EXCLUDES CF patient isolates from P. aeruginosa data. The numbers shown do NOT reflect CF-specific resistance, which is typically much higher. CF Pseudomonas isolates are often MDR with mucoid phenotypes. Always use the patient's own prior culture data. These numbers are for reference only.",
      regimens: [
        { name: "Empiric (non-CF data)", drugs: ["Cefepime + Tobramycin"], note: "⚠️ Data EXCLUDES CF isolates. Non-CF: Cefepime 97%, Tobramycin 94%. Use patient-specific cultures." },
        { name: "Alternative", drugs: ["Pip/tazo + Tobramycin"], note: "⚠️ Non-CF data: Pip/tazo 96%. Dual therapy standard for CF exacerbations." },
        { name: "Meropenem-based (restricted)", drugs: ["Meropenem + Tobramycin"], note: "⚠️ Non-CF data: Meropenem 94%. Restricted — requires ID approval." },
      ],
    },
    adult: {
      tableKey: "adult-nonurine", organisms: ["P. aeruginosa"],
      teaching: "Same critical caveat: antibiogram EXCLUDES CF Pseudomonas isolates. Adult CF patients often harbor highly resistant organisms. Always reference patient-specific cultures.",
      regimens: [
        { name: "Empiric (non-CF data)", drugs: ["Cefepime + Tobramycin"], note: "⚠️ Non-CF data: Cefepime 89%, Tobramycin 98%. Use patient-specific cultures." },
        { name: "Alternative", drugs: ["Pip/tazo + Tobramycin"], note: "⚠️ Non-CF data: Pip/tazo 87%." },
        { name: "Meropenem-based (restricted)", drugs: ["Meropenem + Tobramycin"], note: "⚠️ Non-CF data: Meropenem 89%. Restricted." },
      ],
    },
  },
  skin_purulent: {
    icon: "🩹", title: "Purulent Skin / Soft Tissue Infection",
    description: "Abscess, furuncle, carbuncle — S. aureus / MRSA coverage",
    peds: {
      tableKey: "peds-nonurine", organisms: ["All S. aureus", "MRSA", "MSSA"],
      teaching: "Purulent SSTIs are predominantly S. aureus. Pediatric MRSA rate at OHSU is 22% — most S. aureus is MSSA. For uncomplicated abscess, I&D alone may suffice (IDSA). When antibiotics are needed: TMP/SMX (MRSA 94%) and clindamycin (MRSA 93%) are first-line oral MRSA agents. Clindamycin also covers strep. If MSSA confirmed, narrow to cephalexin (100%).",
      regimens: [
        { name: "Uncomplicated abscess", drugs: ["I&D alone"], note: "IDSA: I&D may suffice without antibiotics for simple abscess in immunocompetent child." },
        { name: "Abscess + cellulitis", drugs: ["I&D + TMP/SMX or Clindamycin"], note: "TMP/SMX: MRSA 94%. Clindamycin: MRSA 93% (also covers Strep)." },
        { name: "Severe / systemic", drugs: ["Vancomycin (IV)"], note: "MRSA 100%, MSSA 100%. Narrow on culture." },
        { name: "Culture-confirmed MSSA", drugs: ["Cephalexin (PO) or Cefazolin (IV)"], note: "MSSA 100% susceptible to oxacillin/cefazolin." },
      ],
    },
    adult: {
      tableKey: "adult-nonurine", organisms: ["All S. aureus", "MRSA", "MSSA"],
      teaching: "Adult MRSA rate is 42% — empiric MRSA coverage is more often warranted. TMP/SMX (MRSA 92%) is preferred oral. Clindamycin MRSA susceptibility is lower in adults (86%). For serious infections, vancomycin IV remains standard.",
      regimens: [
        { name: "Uncomplicated abscess", drugs: ["I&D + TMP/SMX (PO)"], note: "TMP/SMX: MRSA 92%." },
        { name: "Abscess + cellulitis", drugs: ["TMP/SMX + Cephalexin or Clindamycin alone"], note: "TMP/SMX for MRSA + cephalexin for Strep. Or clindamycin covers both (MRSA 86%)." },
        { name: "Severe / systemic", drugs: ["Vancomycin (IV)"], note: "MRSA 100%." },
        { name: "Culture-confirmed MSSA", drugs: ["Cephalexin or Cefazolin"], note: "MSSA 100% susceptible." },
      ],
    },
  },
  tonsillitis: {
    icon: "👅", title: "Tonsillitis / Pharyngitis",
    description: "GAS pharyngitis and peritonsillar abscess",
    peds: {
      tableKey: "peds-nonurine", organisms: ["S. pneumoniae*"],
      teaching: "GAS (S. pyogenes) is the primary bacterial target — it is NOT on the antibiogram because it remains universally susceptible to penicillin (no known resistance). S. pneumoniae is shown as the closest streptococcal reference but is a different organism. For peritonsillar abscess: mixed flora (GAS + oral anaerobes ± S. aureus). Do NOT use azithromycin empirically for GAS — macrolide resistance is rising and erythromycin susceptibility for S. pneumoniae is only 69% locally.",
      regimens: [
        { name: "GAS pharyngitis", drugs: ["Amoxicillin (PO) or Penicillin V"], note: "GAS is 100% penicillin-susceptible worldwide. No antibiogram needed." },
        { name: "PCN allergy", drugs: ["Cephalexin or Clindamycin"], note: "Cephalexin if non-severe allergy. Clindamycin if anaphylaxis. Avoid azithromycin." },
        { name: "Peritonsillar abscess", drugs: ["Ampicillin/sulbactam (IV) or Clindamycin"], note: "Polymicrobial: GAS + anaerobes ± S. aureus. Drainage is primary." },
        { name: "PTA + MRSA concern", drugs: ["Clindamycin ± Vancomycin"], note: "Clindamycin: S. aureus 88%. Add vancomycin if high MRSA suspicion." },
      ],
    },
    adult: {
      tableKey: "adult-nonurine", organisms: ["S. pneumoniae"],
      teaching: "Same principles. In young adults, consider Fusobacterium necrophorum (Lemierre syndrome risk) — anaerobic, not on antibiogram, susceptible to penicillins and metronidazole.",
      regimens: [
        { name: "GAS pharyngitis", drugs: ["Amoxicillin (PO) or Penicillin V"], note: "GAS: 100% penicillin-susceptible. 10-day course." },
        { name: "PCN allergy", drugs: ["Cephalexin or Clindamycin"], note: "Erythromycin (azithromycin surrogate) only 59% for S. pneumoniae — avoid macrolides." },
        { name: "Peritonsillar abscess", drugs: ["Ampicillin/sulbactam or Clindamycin"], note: "Drainage + broad aerobic/anaerobic coverage." },
        { name: "Lemierre concern", drugs: ["Ampicillin/sulbactam ± Metronidazole"], note: "F. necrophorum: anaerobic, susceptible to beta-lactam/BLI and metronidazole." },
      ],
    },
  },
};

// ─── LEARNER TEACHING TOPICS ────────────────────────────────────────────────

const TEACHING = {
  "what-is-antibiogram": { title: "What Is an Antibiogram?", content: "An antibiogram is a periodic summary of antimicrobial susceptibilities of local bacterial isolates. Numbers represent the % of isolates susceptible. Minimum 30 isolates per organism required (CLSI M39). Each patient isolate counted once per year." },
  "reading-values": { title: "Reading the Numbers", content: "≥90% = reliable for empiric therapy. 80–89% = acceptable depending on context. <80% = poor empiric choice. A dash (—) = not tested or intrinsic resistance. Always consider infection site, drug penetration, and patient factors." },
  "mrsa-rate": { title: "MRSA Rates", content: "OHSU pediatric MRSA: 22%. Adult MRSA: 42%. This drives empiric coverage decisions for skin and soft tissue infections. Oxacillin susceptibility predicts cefazolin susceptibility." },
  "restricted-abx": { title: "Restricted Antibiotics", content: "Marked '(restricted)' = requires ID approval. Preserves broad-spectrum efficacy, reduces C. diff risk, slows resistance. Ciprofloxacin restricted in peds (musculoskeletal concerns). ID pharmacist: pager 16695." },
  "ampc": { title: "AmpC β-Lactamase Producers", content: "Enterobacter, Citrobacter, Serratia, Morganella can harbor inducible AmpC. Initial susceptibility to 3rd-gen cephalosporins can revert to resistance during therapy (3–4 days). Cefepime is stable against AmpC. Carbapenems definitive but reserve." },
  "empiric-uti": { title: "Empiric UTI Tips", content: "Peds: cephalexin (E. coli 92%), nitrofurantoin (98% but lower tract only). TMP/SMX 75% — below ideal. Febrile UTI: ceftriaxone 95%. Always narrow on culture." },
  "gram-stain": { title: "Gram Stain Guidance", content: "Gram-negative (pink): Enterobacteriaceae + non-fermenters. Gram-positive (purple): staph, strep, enterococcus. Empiric coverage should match likely organism based on infection site, then use antibiogram to pick the best agent." }
};

const COST = {
  "Amikacin (restricted)":{iv:"<$",po:"—"},"Ampicillin":{iv:"<$",po:"<$"},"Amoxicillin/clavulanate":{iv:"<$",po:"<$"},
  "Ampicillin/sulbactam":{iv:"<$",po:"<$"},"Cefazolin":{iv:"<$",po:"<$"},"Cefepime":{iv:"<$",po:"—"},
  "Cefoxitin":{iv:"<$",po:"—"},"Ceftriaxone":{iv:"<$",po:"<$"},"Ceftriaxone (meningitis)":{iv:"<$",po:"—"},
  "Ceftriaxone (non-meningitis)":{iv:"<$",po:"<$"},"Ceftazidime (restricted)":{iv:"<$",po:"—"},
  "Ciprofloxacin":{iv:"<$",po:"<$"},"Ciprofloxacin (restricted)":{iv:"<$",po:"<$"},
  "Clindamycin":{iv:"<$",po:"$"},"Ertapenem (restricted)":{iv:"$$",po:"—"},"Ertapenem":{iv:"$$",po:"—"},
  "Erythromycin":{iv:"—",po:"—"},"Gentamicin":{iv:"<$",po:"—"},"Levofloxacin":{iv:"<$",po:"<$"},
  "Levofloxacin (restricted)":{iv:"<$",po:"<$"},"Meropenem (restricted)":{iv:"$$",po:"—"},
  "Nitrofurantoin":{iv:"—",po:"<$"},"Oxacillin/nafcillin":{iv:"$$",po:"—"},
  "Penicillin":{iv:"<$",po:"<$"},"Penicillin G":{iv:"<$",po:"<$"},
  "Penicillin (meningitis)":{iv:"<$",po:"—"},"Penicillin (non-meningitis)":{iv:"<$",po:"<$"},
  "Piperacillin/tazobactam":{iv:"$",po:"—"},"Tetracycline":{iv:"<$",po:"$$"},
  "Tobramycin":{iv:"<$",po:"—"},"TMP/SMX":{iv:"$$",po:"<$"},"Vancomycin":{iv:"<$",po:"—"},
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function badge(val, dk) {
  if (val == null) return { c: "bna", l: "—" };
  if (val >= 90) return { c: "bgood", l: val+"%" };
  if (val >= 80) return { c: "bok", l: val+"%" };
  if (val >= 70) return { c: "bwarn", l: val+"%" };
  return { c: "bpoor", l: val+"%" };
}

function cellColor(val, dk) {
  if (val == null) return { bg: "transparent", fg: dk?"#64748b":"#94a3b8" };
  if (val >= 90) return { bg: dk?"#064e3b":"#d1fae5", fg: dk?"#6ee7b7":"#065f46" };
  if (val >= 80) return { bg: dk?"#713f12":"#fef3c7", fg: dk?"#fcd34d":"#92400e" };
  if (val >= 70) return { bg: dk?"#7c2d12":"#ffedd5", fg: dk?"#fdba74":"#9a3412" };
  return { bg: dk?"#7f1d1d":"#fee2e2", fg: dk?"#fca5a5":"#991b1b" };
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function App() {
  const [dk, setDk] = useState(true);
  const [pop, setPop] = useState(null);
  const [src, setSrc] = useState(null);
  const [org, setOrg] = useState(null);
  const [learn, setLearn] = useState(false);
  const [openT, setOpenT] = useState(null);
  const [view, setView] = useState("wiz");
  const [search, setSearch] = useState("");
  const [entry, setEntry] = useState(null);
  const [syn, setSyn] = useState(null);

  const tKey = pop && src ? `${pop}-${src}` : null;
  const table = tKey ? ALL_TABLES[tKey] : null;

  const reset = () => { setPop(null); setSrc(null); setOrg(null); setSearch(""); setEntry(null); setSyn(null); setView("wiz"); };

  const orgResults = useMemo(() => {
    if (!table || org === null) return [];
    return table.antibiotics.map((a, i) => ({ name: a, value: table.data[i][org], cost: COST[a]||{iv:"?",po:"?"} }))
      .filter(r => r.value != null).sort((a, b) => b.value - a.value);
  }, [table, org]);

  const filtered = useMemo(() => {
    if (!search) return orgResults;
    const q = search.toLowerCase();
    return orgResults.filter(r => r.name.toLowerCase().includes(q));
  }, [orgResults, search]);

  const synData = syn ? SYNDROMES[syn]?.[pop === "peds" ? "peds" : "adult"] : null;
  const synTable = synData ? ALL_TABLES[synData.tableKey] : null;

  const synOrgData = useMemo(() => {
    if (!synData || !synTable) return [];
    return synData.organisms.map(name => {
      const idx = synTable.organisms.findIndex(o => o.short === name);
      if (idx === -1) return { name, data: [] };
      const o = synTable.organisms[idx];
      const d = synTable.antibiotics.map((a, i) => ({ name: a, value: synTable.data[i][idx] }))
        .filter(r => r.value != null).sort((a, b) => b.value - a.value);
      return { name: o.full, short: o.short, n: o.n, data: d };
    });
  }, [synData, synTable]);

  const V = dk ? {
    bg:"#0f172a",bg2:"#1e293b",bg3:"#273549",bd:"#1e3a5f",bd2:"#334155",
    tx:"#e2e8f0",tx2:"#cbd5e1",tx3:"#94a3b8",tx4:"#64748b",
    ac:"#3b82f6",acL:"#93c5fd",acBg:"#172554",
    gn:"#064e3b",gnT:"#6ee7b7",yw:"#713f12",ywT:"#fcd34d",
    or:"#7c2d12",orT:"#fdba74",rd:"#7f1d1d",rdT:"#fca5a5",
    gnB:"#2d4a3e",gnHB:"#064e3b",gnHBd:"#34d399",
    gpB:"#4a3560",gpHB:"#3b0764",gpHBd:"#a78bfa",
    lpBg:"linear-gradient(135deg,#172554,#1e1b4b)",chipBg:"#1e3a5f",chipTx:"#93c5fd",
    teachBg:"rgba(30,58,95,0.3)",tcBg:"rgba(30,58,95,0.4)",tcBgO:"rgba(30,58,95,0.6)",
    rTag:"#ef4444",rTagBg:"rgba(239,68,68,0.15)",shadow:"rgba(59,130,246,0.12)",
  } : {
    bg:"#f8fafc",bg2:"#ffffff",bg3:"#f1f5f9",bd:"#e2e8f0",bd2:"#cbd5e1",
    tx:"#0f172a",tx2:"#1e293b",tx3:"#475569",tx4:"#94a3b8",
    ac:"#2563eb",acL:"#3b82f6",acBg:"#eff6ff",
    gn:"#d1fae5",gnT:"#065f46",yw:"#fef3c7",ywT:"#92400e",
    or:"#ffedd5",orT:"#9a3412",rd:"#fee2e2",rdT:"#991b1b",
    gnB:"#a7f3d0",gnHB:"#d1fae5",gnHBd:"#059669",
    gpB:"#ddd6fe",gpHB:"#ede9fe",gpHBd:"#7c3aed",
    lpBg:"linear-gradient(135deg,#eff6ff,#eef2ff)",chipBg:"#dbeafe",chipTx:"#1e40af",
    teachBg:"rgba(37,99,235,0.04)",tcBg:"rgba(37,99,235,0.05)",tcBgO:"rgba(37,99,235,0.08)",
    rTag:"#dc2626",rTagBg:"rgba(220,38,38,0.1)",shadow:"rgba(37,99,235,0.08)",
  };

  return (
    <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", minHeight:"100vh", background:V.bg, color:V.tx, transition:"background .3s,color .3s" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap');*{box-sizing:border-box;margin:0;padding:0;}@keyframes sd{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}@keyframes fi{from{opacity:0}to{opacity:1}}`}</style>

      {/* HEADER */}
      <header style={{ background:V.bg2, borderBottom:`1px solid ${V.bd}`, padding:"14px 20px", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ maxWidth:900, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
          <div>
            <h1 style={{ fontSize:20, fontWeight:700, letterSpacing:"-0.01em" }}>OHSU Antibiogram</h1>
            <p style={{ fontSize:12, color:V.tx4, marginTop:2 }}>Interactive Susceptibility Guide · 2024 Data</p>
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <Btn V={V} onClick={() => setDk(!dk)}>{dk?"☀️":"🌙"}</Btn>
            <Btn V={V} active={learn} onClick={() => setLearn(!learn)}>{learn?"📖 Learner ON":"📕 Learner OFF"}</Btn>
            {table && entry==="organism" && <Btn V={V} onClick={() => setView(view==="wiz"?"tbl":"wiz")}>{view==="wiz"?"▦ Table":"◉ Wizard"}</Btn>}
          </div>
        </div>
      </header>

      <div style={{ maxWidth:900, margin:"0 auto", padding:"16px 16px 40px" }}>

        {/* LEARNER PANEL */}
        {learn && (
          <div style={{ background:V.lpBg, border:`1px solid ${V.bd}`, borderRadius:12, padding:16, marginBottom:20, animation:"sd .3s ease" }}>
            <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:12, color:V.acL, fontWeight:700, fontSize:13, letterSpacing:"0.04em", textTransform:"uppercase" }}>
              <span>📖</span><span>LEARNER MODE</span>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {Object.entries(TEACHING).map(([k, t]) => (
                <button key={k} onClick={() => setOpenT(openT===k?null:k)} style={{
                  background:openT===k?V.tcBgO:V.tcBg, border:`1px solid ${openT===k?V.ac:V.bd}`,
                  borderRadius:8, padding:0, cursor:"pointer", textAlign:"left", color:V.tx2, fontFamily:"inherit", transition:"all .15s"
                }}>
                  <div style={{ display:"flex", justifyContent:"space-between", padding:"10px 14px", fontSize:13, fontWeight:600 }}>
                    <span>{t.title}</span><span style={{ color:V.tx4 }}>{openT===k?"−":"+"}</span>
                  </div>
                  {openT===k && <div style={{ padding:"0 14px 12px", fontSize:12.5, lineHeight:1.65, color:V.tx3, borderTop:`1px solid ${V.bd}`, paddingTop:10 }}>{t.content}</div>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 1: POPULATION */}
        {!pop && (
          <Step>
            <SLabel>Select Patient Population</SLabel>
            <Grid2>
              <SelCard V={V} ico="👶" t="Pediatric" d="Doernbecher Children's Hospital" onClick={() => setPop("peds")} />
              <SelCard V={V} ico="🧑" t="Adult" d="OHSU Adult Hospital" onClick={() => setPop("adult")} />
            </Grid2>
            {learn && <Teach V={V}>💡 <strong>Why population matters:</strong> MRSA rate is 22% in peds vs. 42% in adults at OHSU.</Teach>}
          </Step>
        )}

        {/* STEP 2: ENTRY MODE */}
        {pop && !entry && (
          <Step>
            <Back onClick={() => setPop(null)} V={V} />
            <SLabel>How do you want to look up coverage?</SLabel>
            <Grid2>
              <SelCard V={V} ico="🩺" t="By Clinical Syndrome" d="Appendicitis, UTI, SSTI, etc." onClick={() => setEntry("syndrome")} />
              <SelCard V={V} ico="🦠" t="By Organism" d="Look up a specific pathogen" onClick={() => setEntry("organism")} />
            </Grid2>
            {learn && <Teach V={V}>💡 <strong>Syndrome vs. Organism:</strong> Syndrome pathway maps common ED presentations to likely pathogens and empiric regimens. Organism pathway is for when you know (or suspect) the specific bug.</Teach>}
          </Step>
        )}

        {/* ─── SYNDROME PATHWAY ─── */}
        {pop && entry==="syndrome" && !syn && (
          <Step>
            <Back onClick={() => setEntry(null)} V={V} />
            <SLabel>Select Clinical Syndrome — {pop==="peds"?"Pediatric":"Adult"}</SLabel>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {Object.entries(SYNDROMES).map(([k, s]) => (
                <button key={k} onClick={() => setSyn(k)} style={{
                  display:"flex", alignItems:"center", gap:14, padding:"16px 18px",
                  background:V.bg2, border:`1px solid ${V.bd2}`, borderRadius:10,
                  cursor:"pointer", fontFamily:"inherit", color:"inherit", textAlign:"left", transition:"all .2s"
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=V.ac; e.currentTarget.style.background=V.acBg; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor=V.bd2; e.currentTarget.style.background=V.bg2; }}>
                  <span style={{ fontSize:28, flexShrink:0 }}>{s.icon}</span>
                  <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
                    <span style={{ fontSize:14, fontWeight:700, color:V.tx }}>{s.title}</span>
                    <span style={{ fontSize:12, color:V.tx4 }}>{s.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </Step>
        )}

        {/* SYNDROME DETAIL */}
        {pop && entry==="syndrome" && syn && synData && (
          <Step>
            <Back onClick={() => setSyn(null)} V={V} label="Back to syndromes" />
            <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
              <span style={{ fontSize:28 }}>{SYNDROMES[syn].icon}</span>
              <div>
                <h2 style={{ fontSize:20, fontWeight:700, margin:0 }}>{SYNDROMES[syn].title}</h2>
                <p style={{ fontSize:12, color:V.tx4, marginTop:2 }}>{pop==="peds"?"Pediatric":"Adult"} · {SYNDROMES[syn].description}</p>
              </div>
            </div>
            {learn && <Teach V={V} style={{ marginBottom:16 }}>📖 <strong>Clinical Context</strong><br/>{synData.teaching}</Teach>}

            <SecLabel V={V}>Empiric Regimens</SecLabel>
            {synData.regimens.map((r, i) => (
              <div key={i} style={{ padding:"14px 16px", background:V.bg2, border:`1px solid ${V.bd2}`, borderRadius:10, marginBottom:8 }}>
                <div style={{ fontSize:13, fontWeight:700, color:V.tx, marginBottom:6 }}>{r.name}</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:8 }}>
                  {r.drugs.map((d, j) => <span key={j} style={{ padding:"4px 10px", borderRadius:6, fontSize:12, fontWeight:600, background:V.chipBg, color:V.chipTx }}>{d}</span>)}
                </div>
                <div style={{ fontSize:12, lineHeight:1.5, color:V.tx3 }}>{r.note}</div>
              </div>
            ))}

            <SecLabel V={V} style={{ marginTop:20 }}>Key Organism Susceptibilities</SecLabel>
            {synOrgData.map((o, i) => (
              <div key={i} style={{ background:V.bg2, border:`1px solid ${V.bd2}`, borderRadius:10, padding:"14px 16px", marginBottom:8 }}>
                <div style={{ display:"flex", alignItems:"baseline", gap:8, marginBottom:8 }}>
                  <span style={{ fontSize:14, fontWeight:700, fontStyle:"italic" }}>{o.name}</span>
                  {o.n && <span style={{ fontSize:11, color:V.tx4, fontFamily:"'IBM Plex Mono',monospace" }}>n={o.n}</span>}
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
                  {o.data.slice(0, 8).map((a, j) => {
                    const b = badge(a.value, dk);
                    return <MiniRow key={j} name={a.name} b={b} V={V} />;
                  })}
                  {o.data.length > 8 && <p style={{ fontSize:11, color:V.tx4, marginTop:4, fontStyle:"italic" }}>+ {o.data.length-8} more antibiotics tested</p>}
                </div>
              </div>
            ))}

            <NotesBox V={V}>
              <p style={{ fontWeight:700, marginBottom:6 }}>📋 Important Notes</p>
              <p>• Always narrow therapy based on culture & sensitivity.</p>
              <p>• Regimens shown are empiric starting points.</p>
              <p>• ID pharmacist: pager 16695.</p>
              {syn==="cf_exacerbation" && <p style={{ fontWeight:700 }}>• ⚠️ Antibiogram data EXCLUDES CF P. aeruginosa isolates.</p>}
            </NotesBox>
          </Step>
        )}

        {/* ─── ORGANISM PATHWAY ─── */}
        {pop && entry==="organism" && !src && (
          <Step>
            <Back onClick={() => setEntry(null)} V={V} />
            <SLabel>Select Infection Source</SLabel>
            <Grid2>
              <SelCard V={V} ico="🩸" t="Non-Urine" d="Blood, wound, respiratory, CSF, etc." onClick={() => setSrc("nonurine")} />
              <SelCard V={V} ico="🧪" t="Urine" d="Urinary tract isolates only" onClick={() => setSrc("urine")} />
            </Grid2>
            {learn && <Teach V={V}>💡 <strong>Why separate urine data?</strong> Drug concentrations in urine differ dramatically from serum. Nitrofurantoin only works in urine. The urine antibiogram reflects drugs tested specifically for urinary isolates.</Teach>}
          </Step>
        )}

        {/* Organism select */}
        {table && entry==="organism" && view==="wiz" && org===null && (
          <Step>
            <Back onClick={() => setSrc(null)} V={V} />
            <SLabel>Select Organism — {table.title}</SLabel>
            <p style={{ fontSize:12, color:V.tx4, marginTop:-12, marginBottom:16 }}>{table.period}</p>
            <SecLabel V={V}>Gram-Negative</SecLabel>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))", gap:8, marginBottom:4 }}>
              {table.organisms.map((o, i) => o.gram==="neg" ? <OrgCard key={i} o={o} V={V} gp={false} onClick={() => setOrg(i)} /> : null)}
            </div>
            <SecLabel V={V} style={{ marginTop:16 }}>Gram-Positive</SecLabel>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))", gap:8, marginBottom:4 }}>
              {table.organisms.map((o, i) => o.gram==="pos" ? <OrgCard key={i} o={o} V={V} gp={true} onClick={() => setOrg(i)} /> : null)}
            </div>
            {learn && <Teach V={V}>💡 <strong>Isolate counts matter.</strong> n= is isolates tested. CLSI recommends minimum 30. Interpret marginal counts with caution.</Teach>}
          </Step>
        )}

        {/* Results */}
        {table && entry==="organism" && view==="wiz" && org!==null && (
          <Step>
            <Back onClick={() => { setOrg(null); setSearch(""); }} V={V} label="Back to organisms" />
            <h2 style={{ fontSize:18, fontWeight:700, margin:0, fontStyle:"italic" }}>{table.organisms[org].full}</h2>
            <p style={{ fontSize:12, color:V.tx4, margin:"4px 0 12px", fontFamily:"'IBM Plex Mono',monospace" }}>n = {table.organisms[org].n} · {table.title} · {table.period}</p>
            <input type="text" placeholder="Filter antibiotics..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ width:"100%", padding:"10px 14px", background:V.bg2, border:`1px solid ${V.bd2}`, borderRadius:8, color:V.tx, fontSize:13, fontFamily:"inherit", marginBottom:12, outline:"none" }} />
            {learn && (
              <div style={{ display:"flex", flexWrap:"wrap", gap:12, marginBottom:12, fontSize:11, color:V.tx3 }}>
                <LegItem c={V.gn} b={V.gnT} l="≥90%" /><LegItem c={V.yw} b={V.ywT} l="80–89%" />
                <LegItem c={V.or} b={V.orT} l="70–79%" /><LegItem c={V.rd} b={V.rdT} l="<70%" />
              </div>
            )}
            <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
              {filtered.map((r, i) => {
                const b = badge(r.value, dk);
                return (
                  <div key={i} style={{
                    display:"flex", justifyContent:"space-between", alignItems:"center",
                    padding:"10px 14px", background:V.bg2, borderRadius:6,
                    borderLeft:r.name.includes("restricted")?`3px solid ${V.rTag}`:"none",
                  }}>
                    <div style={{ fontSize:13, fontWeight:500, color:V.tx2, display:"flex", alignItems:"center", gap:6 }}>
                      {r.name}{r.name.includes("restricted") && <RTag V={V} />}
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <span style={{ fontSize:11, color:V.tx4, fontFamily:"'IBM Plex Mono',monospace" }}>{r.cost.iv}{r.cost.po!=="—"?` / ${r.cost.po}`:""}</span>
                      <Badge b={b} V={V} />
                    </div>
                  </div>
                );
              })}
              {filtered.length===0 && <p style={{ color:V.tx4, padding:16, textAlign:"center" }}>No matching antibiotics</p>}
            </div>
            {learn && table.organisms[org].short.includes("cloacae") && (
              <Teach V={V}>⚠️ <strong>AmpC Producer Alert:</strong> Enterobacter cloacae harbors inducible AmpC. Resistance to 3rd-gen cephalosporins can emerge during therapy. Prefer cefepime for serious infections.</Teach>
            )}
            <NotesBox V={V}>
              <p style={{ fontWeight:700, marginBottom:6 }}>📋 Table Notes</p>
              {table.notes.map((n, i) => <p key={i}>• {n}</p>)}
            </NotesBox>
          </Step>
        )}

        {/* TABLE VIEW */}
        {table && entry==="organism" && view==="tbl" && (
          <Step>
            <Back onClick={() => setView("wiz")} V={V} label="Wizard View" />
            <h2 style={{ fontSize:16, fontWeight:700, marginBottom:12 }}>{table.title} — {table.period}</h2>
            <div style={{ overflowX:"auto", borderRadius:8, border:`1px solid ${V.bd}` }}>
              <table style={{ width:"max-content", minWidth:"100%", borderCollapse:"collapse", fontSize:12 }}>
                <thead>
                  <tr>
                    <th style={{ ...thStyle, position:"sticky", left:0, zIndex:4, background:V.bg2, color:V.tx3, minWidth:180 }}>Antibiotic</th>
                    {table.organisms.map((o, i) => (
                      <th key={i} style={{ ...thStyle, background:V.bg2, color:V.tx3, textAlign:"center", minWidth:70 }}>
                        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
                          <span>{o.short}</span>
                          <span style={{ fontSize:10, color:V.tx4, fontFamily:"'IBM Plex Mono',monospace", fontWeight:400 }}>n={o.n}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.antibiotics.map((abx, ai) => (
                    <tr key={ai}>
                      <td style={{ ...tdStyle, position:"sticky", left:0, zIndex:3, background:V.bg, fontWeight:500, color:V.tx2 }}>
                        {abx}{abx.includes("restricted") && <RTag V={V} />}
                      </td>
                      {table.organisms.map((_, oi) => {
                        const c = cellColor(table.data[ai][oi], dk);
                        return <td key={oi} style={{ ...tdStyle, background:c.bg, color:c.fg, textAlign:"center", fontWeight:table.data[ai][oi]!=null?600:400 }}>{table.data[ai][oi]!=null?table.data[ai][oi]+"%":"—"}</td>;
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <NotesBox V={V} style={{ marginTop:16 }}>
              {table.notes.map((n, i) => <p key={i}>• {n}</p>)}
            </NotesBox>
          </Step>
        )}

        {/* FOOTER */}
        <footer style={{ marginTop:32, padding:"16px 0", borderTop:`1px solid ${V.bd}`, textAlign:"center", fontSize:11, color:V.tx4, lineHeight:1.6 }}>
          <p>OHSU Antibiogram · Doc HC-CKT-134-GUD Rev. 042425 · Data: Jan–Dec 2024</p>
          <p>For clinical reference only. Always confirm with culture & sensitivity results.</p>
          {pop && <button onClick={reset} style={{ marginTop:12, background:"none", border:`1px solid ${V.bd2}`, color:V.tx4, padding:"6px 16px", borderRadius:6, cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>⟲ Start Over</button>}
        </footer>
      </div>
    </div>
  );
}

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

const thStyle = { padding:"6px 8px", border:"1px solid", fontWeight:600, whiteSpace:"nowrap" };
const tdStyle = { padding:"6px 8px", border:"1px solid", whiteSpace:"nowrap", fontSize:12 };

function Btn({ V, active, onClick, children }) {
  return <button onClick={onClick} style={{
    padding:"6px 14px", borderRadius:20, border:`1px solid ${active?V.ac:V.bd2}`,
    background:active?V.acBg:V.bg2, color:active?V.acL:V.tx3,
    fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit",
    boxShadow:active?`0 0 12px ${V.shadow}`:"none",
  }}>{children}</button>;
}

function SelCard({ V, ico, t, d, onClick }) {
  return <button onClick={onClick} style={{
    display:"flex", flexDirection:"column", alignItems:"center", gap:6,
    padding:"28px 16px", background:V.bg2, border:`1px solid ${V.bd2}`,
    borderRadius:12, cursor:"pointer", fontFamily:"inherit", color:"inherit", transition:"all .2s"
  }}
  onMouseEnter={e => { e.currentTarget.style.borderColor=V.ac; e.currentTarget.style.background=V.acBg; e.currentTarget.style.transform="translateY(-2px)"; }}
  onMouseLeave={e => { e.currentTarget.style.borderColor=V.bd2; e.currentTarget.style.background=V.bg2; e.currentTarget.style.transform="none"; }}>
    <span style={{ fontSize:32 }}>{ico}</span>
    <span style={{ fontSize:16, fontWeight:700, color:V.tx }}>{t}</span>
    <span style={{ fontSize:12, color:V.tx4 }}>{d}</span>
  </button>;
}

function OrgCard({ o, V, gp, onClick }) {
  const bdr = gp ? V.gpB : V.gnB;
  const hBg = gp ? V.gpHB : V.gnHB;
  const hBd = gp ? V.gpHBd : V.gnHBd;
  return <button onClick={onClick} style={{
    display:"flex", flexDirection:"column", gap:2, padding:"12px 14px",
    background:V.bg2, border:`1px solid ${bdr}`, borderRadius:8,
    cursor:"pointer", textAlign:"left", fontFamily:"inherit", color:"inherit", transition:"all .15s"
  }}
  onMouseEnter={e => { e.currentTarget.style.borderColor=hBd; e.currentTarget.style.background=hBg; }}
  onMouseLeave={e => { e.currentTarget.style.borderColor=bdr; e.currentTarget.style.background=V.bg2; }}>
    <span style={{ fontSize:13, fontWeight:600, fontStyle:"italic" }}>{o.short}</span>
    <span style={{ fontSize:11, color:V.tx4, fontFamily:"'IBM Plex Mono',monospace" }}>n={o.n}</span>
  </button>;
}

function MiniRow({ name, b, V }) {
  return <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"4px 0" }}>
    <span style={{ fontSize:12, color:V.tx2 }}>{name}</span>
    <Badge b={b} V={V} />
  </div>;
}

function Badge({ b, V }) {
  const colors = { bgood:{bg:V.gn,fg:V.gnT}, bok:{bg:V.yw,fg:V.ywT}, bwarn:{bg:V.or,fg:V.orT}, bpoor:{bg:V.rd,fg:V.rdT}, bna:{bg:"transparent",fg:V.tx4} };
  const s = colors[b.c] || colors.bna;
  return <span style={{ display:"inline-block", minWidth:48, textAlign:"center", padding:"4px 10px", borderRadius:6, fontSize:13, fontWeight:700, fontFamily:"'IBM Plex Mono',monospace", background:s.bg, color:s.fg }}>{b.l}</span>;
}

function RTag({ V }) {
  return <span style={{ fontSize:9, fontWeight:700, color:V.rTag, background:V.rTagBg, padding:"1px 5px", borderRadius:3, letterSpacing:"0.05em", marginLeft:4 }}>R</span>;
}

function Step({ children }) { return <div style={{ animation:"fi .25s ease" }}>{children}</div>; }
function SLabel({ children }) { return <p style={{ fontSize:16, fontWeight:700, marginBottom:16, letterSpacing:"-0.01em" }}>{children}</p>; }
function Grid2({ children }) { return <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>{children}</div>; }
function Back({ onClick, V, label }) { return <button onClick={onClick} style={{ background:"none", border:"none", color:V.ac, fontSize:13, fontWeight:500, cursor:"pointer", padding:"4px 0", marginBottom:12, fontFamily:"inherit" }}>← {label||"Back"}</button>; }
function SecLabel({ V, children, style }) { return <p style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", color:V.tx4, marginBottom:8, paddingLeft:4, ...style }}>{children}</p>; }
function LegItem({ c, b, l }) { return <span style={{ display:"flex", alignItems:"center", gap:5 }}><span style={{ width:10, height:10, borderRadius:3, background:c, border:`1px solid ${b}` }}></span>{l}</span>; }

function Teach({ V, children, style }) {
  return <div style={{ marginTop:16, padding:"12px 16px", background:V.teachBg, borderLeft:`3px solid ${V.ac}`, borderRadius:"0 8px 8px 0", fontSize:12.5, lineHeight:1.6, color:V.tx3, animation:"sd .3s ease", ...style }}>{children}</div>;
}

function NotesBox({ V, children, style }) {
  return <div style={{ marginTop:20, padding:"12px 16px", background:dk==="dark"?undefined:undefined, border:`1px solid ${V.bd}`, borderRadius:8, fontSize:12, color:V.tx4, lineHeight:1.5, ...style }}>{children}</div>;
}
