import { useState, useMemo } from "react";

/* ════════════════════════════════════════════════════════════════════════════
   OHSU ANTIBIOGRAM WIZARD
   Interactive susceptibility guide for OHSU Emergency Departments
   Data: Jan 1 – Dec 31, 2024 (HC-CKT-134-GUD Rev. 042425)
   ════════════════════════════════════════════════════════════════════════════ */

// ─── ANTIBIOGRAM DATA ───────────────────────────────────────────────────────

const PNU = { // Pediatric Non-Urine
  title:"Pediatric Non-Urine", period:"Jan 1 – Dec 31, 2024",
  notes:["Pediatric MRSA rate: 22%","P. aeruginosa susceptibilities exclude CF patients","Erythromycin susceptibility surrogate for azithromycin in S. pneumoniae","S. aureus susceptibility to oxacillin predicts susceptibility to cefazolin","* Data based on isolates over 2 calendar years (2023–2024)"],
  organisms:[
    {s:"E. cloacae*",f:"Enterobacter cloacae complex*",n:37,g:"n"},
    {s:"E. coli",f:"Escherichia coli",n:46,g:"n"},
    {s:"P. aeruginosa",f:"Pseudomonas aeruginosa",n:68,g:"n"},
    {s:"All S. aureus",f:"All Staphylococcus aureus",n:320,g:"p"},
    {s:"MRSA",f:"Methicillin-resistant S. aureus",n:70,g:"p"},
    {s:"MSSA",f:"Methicillin-susceptible S. aureus",n:250,g:"p"},
    {s:"S. pneumoniae*",f:"Streptococcus pneumoniae*",n:74,g:"p"},
  ],
  abx:["Amikacin (restricted)","Ampicillin","Amoxicillin/clavulanate","Cefazolin","Cefepime","Ceftazidime (restricted)","Ceftriaxone","Ceftriaxone (meningitis)","Ceftriaxone (non-meningitis)","Ciprofloxacin (restricted)","Clindamycin","Ertapenem (restricted)","Erythromycin","Gentamicin","Levofloxacin (restricted)","Meropenem (restricted)","Oxacillin/nafcillin","Penicillin (meningitis)","Penicillin (non-meningitis)","Piperacillin/tazobactam","Tetracycline","Tobramycin","TMP/SMX","Vancomycin"],
  d:[
    [100,98,null,null,null,null,null],[null,43,null,null,null,null,null],[null,83,null,null,null,null,null],[null,74,null,78,null,100,null],
    [97,93,97,null,null,null,null],[null,93,96,null,null,null,null],[null,85,null,null,null,null,null],[null,null,null,null,null,null,98],
    [null,null,null,null,null,null,100],[97,85,91,null,null,null,null],[null,null,null,88,93,87,null],[94,100,null,null,null,null,null],
    [null,null,null,98,null,98,69],[97,93,null,98,null,98,null],[100,85,90,null,null,null,null],[100,100,94,null,null,null,null],
    [null,null,null,78,null,100,null],[null,null,null,null,null,null,84],[null,null,null,null,null,null,100],[null,89,96,null,null,null,null],
    [94,61,null,91,79,94,97],[97,89,94,null,null,null,null],[100,74,null,98,94,99,88],[null,null,null,100,100,100,null],
  ],
};

const PU = { // Pediatric Urine
  title:"Pediatric Urine", period:"Jan 1 – Dec 31, 2024",
  notes:["Use for urine pathogens only","S. aureus oxacillin predicts cefazolin susceptibility","* Data over 2 calendar years (2023–2024)","AmpC derepression risk with prolonged 3rd-gen cephalosporins"],
  organisms:[
    {s:"E. coli",f:"Escherichia coli",n:297,g:"n"},{s:"K. oxytoca*",f:"Klebsiella oxytoca*",n:42,g:"n"},
    {s:"K. pneumoniae*",f:"Klebsiella pneumoniae*",n:53,g:"n"},{s:"P. mirabilis*",f:"Proteus mirabilis*",n:34,g:"n"},
    {s:"P. aeruginosa*",f:"Pseudomonas aeruginosa*",n:36,g:"n"},{s:"E. faecalis",f:"Enterococcus faecalis",n:59,g:"p"},
    {s:"S. aureus*",f:"Staphylococcus aureus*",n:31,g:"p"},{s:"S. epidermidis*",f:"Staphylococcus epidermidis*",n:40,g:"p"},
  ],
  abx:["Amikacin (restricted)","Ampicillin","Ampicillin/sulbactam","Cefazolin","Cefepime","Cefoxitin","Ceftazidime (restricted)","Ceftriaxone","Ciprofloxacin (restricted)","Ertapenem","Gentamicin","Levofloxacin (restricted)","Meropenem (restricted)","Nitrofurantoin","Oxacillin/nafcillin","Penicillin G","Piperacillin/tazobactam","Tetracycline","Tobramycin","TMP/SMX","Vancomycin"],
  d:[
    [100,98,100,97,92,null,null,null],[60,null,null,91,null,100,null,null],[67,81,89,94,null,null,null,null],[92,57,91,97,null,null,68,38],
    [96,93,96,100,92,null,null,null],[97,95,94,100,null,null,null,null],[95,93,92,100,94,null,null,null],[95,88,92,100,null,null,null,null],
    [87,90,85,100,94,90,null,null],[100,95,98,100,null,null,null,null],[91,93,94,94,null,null,null,null],[91,90,94,100,92,100,null,null],
    [100,98,98,100,97,null,null,null],[98,90,64,null,null,100,100,100],[null,null,null,null,null,null,68,38],[null,null,null,null,null,100,null,null],
    [98,93,96,100,97,null,null,null],[82,81,null,null,null,31,94,85],[92,88,92,94,97,null,null,null],[75,74,77,94,null,null,100,50],
    [null,null,null,null,null,100,100,100],
  ],
};

const ANU = { // Adult Non-Urine
  title:"Adult Non-Urine", period:"Jan 1 – Dec 31, 2024",
  notes:["Adult MRSA rate: 42%","P. aeruginosa susceptibilities exclude CF patients","Erythromycin surrogate for azithromycin in S. pneumoniae","S. aureus oxacillin predicts cefazolin susceptibility","* Data over 2 calendar years (2023–2024)"],
  organisms:[
    {s:"C. freundii*",f:"Citrobacter freundii*",n:44,g:"n"},{s:"E. cloacae*",f:"Enterobacter cloacae complex",n:36,g:"n"},
    {s:"E. coli",f:"Escherichia coli",n:327,g:"n"},{s:"K. aerogenes",f:"Klebsiella aerogenes",n:31,g:"n"},
    {s:"K. oxytoca",f:"Klebsiella oxytoca",n:70,g:"n"},{s:"K. pneumoniae",f:"Klebsiella pneumoniae",n:139,g:"n"},
    {s:"P. mirabilis",f:"Proteus mirabilis",n:97,g:"n"},{s:"P. aeruginosa",f:"Pseudomonas aeruginosa",n:260,g:"n"},
    {s:"S. marcescens",f:"Serratia marcescens",n:69,g:"n"},{s:"S. maltophilia*",f:"Stenotrophomonas maltophilia*",n:56,g:"n"},
    {s:"E. faecalis",f:"Enterococcus faecalis",n:202,g:"p"},{s:"E. faecium",f:"Enterococcus faecium",n:60,g:"p"},
    {s:"All S. aureus",f:"All Staphylococcus aureus",n:1300,g:"p"},{s:"MRSA",f:"Methicillin-resistant S. aureus",n:545,g:"p"},
    {s:"MSSA",f:"Methicillin-susceptible S. aureus",n:755,g:"p"},{s:"S. epidermidis",f:"Staphylococcus epidermidis",n:197,g:"p"},
    {s:"S. lugdunensis",f:"Staphylococcus lugdunensis",n:65,g:"p"},{s:"S. pneumoniae",f:"Streptococcus pneumoniae",n:43,g:"p"},
  ],
  abx:["Amikacin (restricted)","Ampicillin","Amoxicillin/clavulanate","Cefazolin","Cefepime","Ceftazidime (restricted)","Ceftriaxone","Ceftriaxone (meningitis)","Ceftriaxone (non-meningitis)","Ciprofloxacin","Clindamycin","Ertapenem (restricted)","Erythromycin","Gentamicin","Levofloxacin","Meropenem (restricted)","Oxacillin/nafcillin","Penicillin (meningitis)","Penicillin","Piperacillin/tazobactam","Tetracycline","Tobramycin","TMP/SMX","Vancomycin"],
  d:[
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

const AU = { // Adult Urine
  title:"Adult Urine", period:"Jan 1 – Dec 31, 2024",
  notes:["Use for urine pathogens only","S. aureus oxacillin predicts cefazolin susceptibility","* Data over 2 calendar years (2023–2024)","AmpC derepression risk with prolonged 3rd-gen cephalosporins"],
  organisms:[
    {s:"C. freundii",f:"Citrobacter freundii",n:79,g:"n"},{s:"E. cloacae",f:"Enterobacter cloacae complex",n:118,g:"n"},
    {s:"E. coli",f:"Escherichia coli",n:2677,g:"n"},{s:"K. aerogenes",f:"Klebsiella aerogenes",n:52,g:"n"},
    {s:"K. oxytoca",f:"Klebsiella oxytoca",n:99,g:"n"},{s:"K. pneumoniae",f:"Klebsiella pneumoniae",n:448,g:"n"},
    {s:"M. morganii",f:"Morganella morganii",n:34,g:"n"},{s:"P. mirabilis",f:"Proteus mirabilis",n:245,g:"n"},
    {s:"P. aeruginosa",f:"Pseudomonas aeruginosa",n:171,g:"n"},{s:"S. marcescens*",f:"Serratia marcescens*",n:66,g:"n"},
    {s:"E. faecalis",f:"Enterococcus faecalis",n:428,g:"p"},{s:"E. faecium",f:"Enterococcus faecium",n:62,g:"p"},
    {s:"All S. aureus",f:"All Staphylococcus aureus",n:105,g:"p"},{s:"S. epidermidis",f:"Staphylococcus epidermidis",n:156,g:"p"},
    {s:"S. haemolyticus*",f:"Staphylococcus haemolyticus*",n:39,g:"p"},
  ],
  abx:["Amikacin (restricted)","Ampicillin","Ampicillin/sulbactam","Cefazolin","Cefepime","Cefoxitin","Ceftazidime (restricted)","Ceftriaxone","Ciprofloxacin","Ertapenem","Gentamicin","Levofloxacin","Meropenem (restricted)","Nitrofurantoin","Oxacillin/nafcillin","Penicillin G","Piperacillin/tazobactam","Tetracycline","Tobramycin","TMP/SMX","Vancomycin"],
  d:[
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

const TABLES = { "peds-nonurine":PNU, "peds-urine":PU, "adult-nonurine":ANU, "adult-urine":AU };

// ─── SYNDROME CATEGORIES (modeled on UCSF IDMP) ────────────────────────────

const SYN_CATEGORIES = [
  { id:"skin", label:"Skin & Soft Tissue", icon:"🩹" },
  { id:"resp", label:"Respiratory", icon:"🫁" },
  { id:"gi", label:"GI / Intra-abdominal", icon:"🔥" },
  { id:"gu", label:"Genitourinary", icon:"🧪" },
  { id:"cns", label:"CNS", icon:"🧠" },
  { id:"msk", label:"Musculoskeletal", icon:"🦴" },
  { id:"bsi", label:"Bloodstream", icon:"🩸" },
  { id:"ent", label:"Head & Neck / ENT", icon:"👅" },
];

// syn(key, icon, title, desc, category, pedsData, adultData)
const SYNDROMES = {
  // ── SKIN & SOFT TISSUE ──
  abscess: {
    cat:"skin", icon:"🩹", title:"Purulent SSTI / Abscess",
    desc:"Abscess, furuncle, carbuncle — S. aureus directed",
    peds:{ tk:"peds-nonurine", orgs:["All S. aureus","MRSA","MSSA"],
      teach:"Purulent SSTIs are predominantly S. aureus. Pediatric MRSA rate at OHSU is 22%. For uncomplicated abscess, I&D alone may suffice (IDSA). When antibiotics are needed: TMP/SMX (MRSA 94%) and clindamycin (MRSA 93%) are first-line oral MRSA agents. Clindamycin also covers streptococci. If MSSA confirmed, narrow to cephalexin (100%).",
      rx:[
        {name:"Uncomplicated abscess",drugs:["I&D alone"],note:"IDSA: I&D may suffice without antibiotics for simple abscess in immunocompetent child."},
        {name:"Abscess + cellulitis",drugs:["I&D + TMP/SMX or Clindamycin"],note:"TMP/SMX: MRSA 94%. Clindamycin: MRSA 93% (also covers Strep)."},
        {name:"Severe / systemic",drugs:["Vancomycin (IV)"],note:"MRSA & MSSA 100%. Narrow on culture."},
        {name:"Culture-confirmed MSSA",drugs:["Cephalexin (PO) or Cefazolin (IV)"],note:"MSSA 100% susceptible to oxacillin/cefazolin."},
      ]},
    adult:{ tk:"adult-nonurine", orgs:["All S. aureus","MRSA","MSSA"],
      teach:"Adult MRSA rate is 42% — empiric MRSA coverage more frequently warranted. TMP/SMX (MRSA 92%) is preferred oral agent. Clindamycin MRSA susceptibility lower in adults (86%).",
      rx:[
        {name:"Uncomplicated abscess",drugs:["I&D + TMP/SMX (PO)"],note:"TMP/SMX: MRSA 92%."},
        {name:"Abscess + cellulitis",drugs:["TMP/SMX + Cephalexin or Clindamycin alone"],note:"TMP/SMX for MRSA + cephalexin for Strep. Clindamycin alone covers both (MRSA 86%)."},
        {name:"Severe / systemic",drugs:["Vancomycin (IV)"],note:"MRSA 100%."},
        {name:"Culture-confirmed MSSA",drugs:["Cephalexin or Cefazolin"],note:"MSSA 100% susceptible."},
      ]},
  },
  cellulitis: {
    cat:"skin", icon:"🔴", title:"Non-Purulent Cellulitis / Erysipelas",
    desc:"No drainable focus — streptococcal coverage first-line",
    peds:{ tk:"peds-nonurine", orgs:["All S. aureus","MSSA"],
      teach:"Non-purulent cellulitis is most commonly caused by beta-hemolytic streptococci (GAS, Group B, C, G). MRSA coverage is NOT routinely needed unless purulence is present. Cephalexin is first-line. Clindamycin is an alternative for penicillin-allergic patients. Add MRSA coverage only if cellulitis fails to improve on beta-lactam therapy or if there are specific MRSA risk factors.",
      rx:[
        {name:"Mild/moderate cellulitis",drugs:["Cephalexin (PO)"],note:"First-line for non-purulent cellulitis. Covers streptococci and MSSA."},
        {name:"PCN allergy",drugs:["Clindamycin (PO)"],note:"Covers streptococci and staphylococci. S. aureus 88%."},
        {name:"Moderate/severe (IV)",drugs:["Cefazolin (IV)"],note:"Parenteral equivalent. Transition to PO cephalexin when improving."},
        {name:"Failing beta-lactam / MRSA concern",drugs:["Vancomycin (IV) or TMP/SMX + cephalexin"],note:"Add MRSA coverage if no improvement at 48–72h or MRSA risk factors present."},
      ]},
    adult:{ tk:"adult-nonurine", orgs:["All S. aureus","MSSA"],
      teach:"Same streptococcal-predominant etiology. Higher adult MRSA rate (42%) means lower threshold for adding MRSA coverage if failing initial therapy. Cefazolin/cephalexin remain first-line for non-purulent cellulitis.",
      rx:[
        {name:"Mild/moderate cellulitis",drugs:["Cephalexin (PO)"],note:"Covers streptococci and MSSA (100%)."},
        {name:"Moderate/severe (IV)",drugs:["Cefazolin (IV)"],note:"MSSA 100%. Transition to PO when improving."},
        {name:"Failing or MRSA risk",drugs:["Vancomycin (IV)"],note:"MRSA 100%. Consider if no improvement at 48–72h."},
      ]},
  },
  bite: {
    cat:"skin", icon:"🐕", title:"Bite Wound (Animal / Human)",
    desc:"Polymicrobial — Pasteurella, anaerobes, strep, staph",
    peds:{ tk:"peds-nonurine", orgs:["All S. aureus"],
      teach:"Bite wounds are polymicrobial: Pasteurella (dog/cat), Eikenella (human), streptococci, anaerobes, and S. aureus. Pasteurella and Eikenella are not on the antibiogram but are susceptible to amoxicillin/clavulanate. Augmentin is the standard of care for bite wound prophylaxis and treatment — it covers the full polymicrobial spectrum. First-gen cephalosporins do NOT cover Pasteurella.",
      rx:[
        {name:"Bite wound (prophylaxis or treatment)",drugs:["Amoxicillin/clavulanate (PO)"],note:"Covers Pasteurella, Eikenella, streptococci, S. aureus, anaerobes. Standard of care."},
        {name:"PCN allergy (non-severe)",drugs:["Cephalexin + Metronidazole"],note:"Cephalexin for GP coverage; metronidazole for anaerobes. Incomplete Pasteurella coverage."},
        {name:"Severe / IV needed",drugs:["Ampicillin/sulbactam (IV)"],note:"Parenteral equivalent of augmentin. Broad polymicrobial coverage."},
      ]},
    adult:{ tk:"adult-nonurine", orgs:["All S. aureus"],
      teach:"Same polymicrobial principles. Amoxicillin/clavulanate is standard. For severe infections or IV therapy, ampicillin/sulbactam or piperacillin/tazobactam.",
      rx:[
        {name:"Bite wound",drugs:["Amoxicillin/clavulanate (PO)"],note:"Standard of care for all bite wounds."},
        {name:"Severe / IV needed",drugs:["Ampicillin/sulbactam (IV)"],note:"Broad coverage including anaerobes and Pasteurella."},
        {name:"PCN allergy",drugs:["TMP/SMX + Metronidazole or Doxycycline"],note:"Doxycycline covers Pasteurella. Add metronidazole for anaerobes."},
      ]},
  },
  // ── RESPIRATORY ──
  cap: {
    cat:"resp", icon:"🫁", title:"Community-Acquired Pneumonia",
    desc:"Typical and atypical pathogens",
    peds:{ tk:"peds-nonurine", orgs:["S. pneumoniae*"],
      teach:"Pediatric CAP: S. pneumoniae is the most common bacterial cause. Viral etiologies are very common, especially in young children. Amoxicillin is first-line for outpatient bacterial CAP (S. pneumoniae non-meningitis susceptibility 100%). For inpatient, ampicillin IV is first-line. Add azithromycin only if atypical pathogens suspected (Mycoplasma, Chlamydia). Ceftriaxone is reserved for complicated/empyema or failure of ampicillin.",
      rx:[
        {name:"Outpatient (>3 months)",drugs:["Amoxicillin (PO)"],note:"S. pneumoniae 100% (non-meningitis). Standard first-line per IDSA/PIDS."},
        {name:"Outpatient + atypical suspected",drugs:["Amoxicillin + Azithromycin"],note:"Add azithromycin for Mycoplasma/Chlamydia if school-age child or compatible presentation."},
        {name:"Inpatient (uncomplicated)",drugs:["Ampicillin (IV)"],note:"Ampicillin covers S. pneumoniae. Transition to amoxicillin PO when improving."},
        {name:"Complicated / Empyema",drugs:["Ceftriaxone (IV) ± Vancomycin"],note:"Ceftriaxone: S. pneumoniae 100% (non-meningitis). Add vancomycin if concern for MRSA pneumonia."},
      ]},
    adult:{ tk:"adult-nonurine", orgs:["S. pneumoniae"],
      teach:"Adult CAP: S. pneumoniae, H. influenzae, Moraxella, atypicals (Mycoplasma, Chlamydia, Legionella). Outpatient mild: amoxicillin ± azithromycin or doxycycline. Inpatient: ceftriaxone + azithromycin (or respiratory fluoroquinolone monotherapy). S. pneumoniae non-meningitis susceptibility at OHSU is 91%.",
      rx:[
        {name:"Outpatient (healthy, no comorbidities)",drugs:["Amoxicillin (PO) ± Doxycycline"],note:"S. pneumoniae: penicillin 93%. Add doxycycline for atypical coverage."},
        {name:"Outpatient (comorbidities)",drugs:["Amoxicillin/clavulanate + Azithromycin or Levofloxacin alone"],note:"Levofloxacin: S. pneumoniae — respiratory fluoroquinolone monotherapy option."},
        {name:"Inpatient (non-ICU)",drugs:["Ceftriaxone + Azithromycin"],note:"Ceftriaxone: S. pneumoniae 91% (non-meningitis)."},
        {name:"ICU / Severe",drugs:["Ceftriaxone + Azithromycin ± Vancomycin"],note:"Add vancomycin if MRSA CAP suspected (post-influenza, cavitary disease)."},
      ]},
  },
  cf: {
    cat:"resp", icon:"🌬️", title:"CF Pulmonary Exacerbation",
    desc:"Pseudomonas-directed — antibiogram EXCLUDES CF isolates",
    peds:{ tk:"peds-nonurine", orgs:["P. aeruginosa"],
      teach:"CRITICAL: OHSU antibiogram EXCLUDES CF patient P. aeruginosa isolates. The numbers shown do NOT reflect CF-specific resistance, which is typically much higher due to chronic antibiotic exposure and mucoid phenotypes. Always use the patient's own prior respiratory culture data. These numbers are for reference only.",
      rx:[
        {name:"Empiric (non-CF data)",drugs:["Cefepime + Tobramycin"],note:"⚠️ Data EXCLUDES CF isolates. Non-CF: Cefepime 97%, Tobramycin 94%. Use patient-specific cultures."},
        {name:"Alternative",drugs:["Pip/tazo + Tobramycin"],note:"⚠️ Non-CF data: Pip/tazo 96%."},
        {name:"Meropenem-based (restricted)",drugs:["Meropenem + Tobramycin"],note:"⚠️ Non-CF data: Meropenem 94%. Requires ID approval."},
      ]},
    adult:{ tk:"adult-nonurine", orgs:["P. aeruginosa"],
      teach:"Same critical caveat — antibiogram EXCLUDES CF isolates. Adult CF patients often harbor highly resistant organisms. Always reference patient-specific cultures.",
      rx:[
        {name:"Empiric (non-CF data)",drugs:["Cefepime + Tobramycin"],note:"⚠️ Non-CF data: Cefepime 89%, Tobramycin 98%."},
        {name:"Alternative",drugs:["Pip/tazo + Tobramycin"],note:"⚠️ Non-CF data: Pip/tazo 87%."},
        {name:"Meropenem-based (restricted)",drugs:["Meropenem + Tobramycin"],note:"⚠️ Non-CF data: Meropenem 89%. Restricted."},
      ]},
  },
  // ── GI / INTRA-ABDOMINAL ──
  appendicitis: {
    cat:"gi", icon:"🔥", title:"Appendicitis",
    desc:"Polymicrobial GNR + anaerobic coverage",
    peds:{ tk:"peds-nonurine", orgs:["E. coli","P. aeruginosa"],
      teach:"Appendicitis is polymicrobial: aerobic GNRs (primarily E. coli) plus anaerobes (B. fragilis — not on antibiogram). Pip/tazo covers both. Alternatively, ceftriaxone + metronidazole. For complicated/perforated cases, broader coverage including Pseudomonas.",
      rx:[
        {name:"Simple",drugs:["Ceftriaxone + Metronidazole"],note:"Ceftriaxone: E. coli 85%. Metronidazole for anaerobes."},
        {name:"Complicated / Perforated",drugs:["Piperacillin/tazobactam"],note:"E. coli 89%, Pseudomonas 96%."},
        {name:"PCN allergy",drugs:["Cefepime + Metronidazole"],note:"Cefepime: E. coli 93%, Pseudomonas 97%."},
      ]},
    adult:{ tk:"adult-nonurine", orgs:["E. coli","P. aeruginosa","K. pneumoniae"],
      teach:"Same polymicrobial principles. E. coli resistance to fluoroquinolones (75%) and ampicillin (49%) makes these poor empiric choices.",
      rx:[
        {name:"Simple",drugs:["Ceftriaxone + Metronidazole"],note:"Ceftriaxone: E. coli 84%."},
        {name:"Complicated / Perforated",drugs:["Piperacillin/tazobactam"],note:"E. coli 94%, Pseudomonas 87%, K. pneumoniae 91%."},
        {name:"PCN allergy",drugs:["Cefepime + Metronidazole"],note:"Cefepime: E. coli 91%, Pseudomonas 89%."},
      ]},
  },
  peritonitis: {
    cat:"gi", icon:"💧", title:"Secondary Peritonitis / Intra-abdominal Infection",
    desc:"Bowel perforation, diverticulitis — polymicrobial",
    peds:{ tk:"peds-nonurine", orgs:["E. coli","P. aeruginosa","E. cloacae*"],
      teach:"Secondary peritonitis shares the same polymicrobial profile as appendicitis — GNRs plus anaerobes. Coverage principles are identical. For healthcare-associated infections, consider broader GNR coverage including Pseudomonas and resistant Enterobacteriaceae.",
      rx:[
        {name:"Community-acquired",drugs:["Ceftriaxone + Metronidazole"],note:"Ceftriaxone: E. coli 85%."},
        {name:"Healthcare-associated",drugs:["Pip/tazo or Cefepime + Metronidazole"],note:"Pip/tazo: E. coli 89%, Pseudomonas 96%. Cefepime: E. coli 93%."},
        {name:"Severe / prior resistant organisms",drugs:["Meropenem (restricted)"],note:"Meropenem: E. coli 100%, Pseudomonas 94%. ID consult recommended."},
      ]},
    adult:{ tk:"adult-nonurine", orgs:["E. coli","P. aeruginosa","K. pneumoniae","E. cloacae*"],
      teach:"Adult secondary peritonitis: diverticulitis, bowel perforation, post-surgical. Same GNR + anaerobe paradigm. Add enterococcal coverage (ampicillin or vancomycin) for healthcare-associated infections if Enterococcus suspected.",
      rx:[
        {name:"Community-acquired (mild/moderate)",drugs:["Ceftriaxone + Metronidazole"],note:"E. coli 84%."},
        {name:"Community-acquired (severe)",drugs:["Pip/tazo"],note:"E. coli 94%, K. pneumoniae 91%, Pseudomonas 87%."},
        {name:"Healthcare-associated",drugs:["Pip/tazo or Meropenem (restricted)"],note:"Meropenem: E. coli 100%, Pseudomonas 89%. Add vancomycin if VRE concern."},
      ]},
  },
  // ── GENITOURINARY ──
  uti: {
    cat:"gu", icon:"🧪", title:"Urinary Tract Infection",
    desc:"Cystitis and pyelonephritis — uses urine antibiogram",
    peds:{ tk:"peds-urine", orgs:["E. coli","K. pneumoniae*","P. mirabilis*"],
      teach:"E. coli causes ~80% of pediatric UTIs. Cephalexin/cefazolin first-line for cystitis (E. coli 92%). TMP/SMX at 75% is below ideal. Nitrofurantoin (98%) excellent for cystitis but has no renal tissue levels — never for pyelonephritis. Febrile UTI: ceftriaxone (95%) is standard parenteral therapy.",
      rx:[
        {name:"Uncomplicated cystitis",drugs:["Cephalexin (PO)"],note:"E. coli 92%. First-line oral agent."},
        {name:"Cystitis — alternative",drugs:["Nitrofurantoin (PO)"],note:"E. coli 98%. Lower tract ONLY — no renal levels."},
        {name:"Febrile UTI / Pyelonephritis",drugs:["Ceftriaxone (IV)"],note:"E. coli 95%. Transition to PO per culture."},
        {name:"Complex / structural anomaly",drugs:["Cefepime (IV)"],note:"E. coli 96%, Pseudomonas 92%."},
      ]},
    adult:{ tk:"adult-urine", orgs:["E. coli","K. pneumoniae","P. mirabilis"],
      teach:"E. coli dominates (n=2677). Nitrofurantoin (98%) IDSA first-line for uncomplicated cystitis. TMP/SMX at 77% is below ideal at OHSU. Fluoroquinolones no longer first-line per IDSA for uncomplicated UTI.",
      rx:[
        {name:"Uncomplicated cystitis",drugs:["Nitrofurantoin (PO)"],note:"E. coli 98%. IDSA first-line."},
        {name:"Cystitis — alternative",drugs:["TMP/SMX (PO)"],note:"E. coli 77% — below ideal threshold. Use if culture confirms."},
        {name:"Pyelonephritis (outpatient)",drugs:["Ciprofloxacin (PO) or Ceftriaxone (IV)"],note:"Cipro: E. coli 79%. Ceftriaxone: E. coli 91%."},
        {name:"Complicated / Sepsis",drugs:["Cefepime or Pip/tazo (IV)"],note:"Cefepime: E. coli 93%. Pip/tazo: E. coli 98%."},
      ]},
  },
  // ── CNS ──
  meningitis: {
    cat:"cns", icon:"🧠", title:"Bacterial Meningitis",
    desc:"Empiric coverage by age — meningitis breakpoints apply",
    peds:{ tk:"peds-nonurine", orgs:["S. pneumoniae*","E. coli"],
      teach:"Meningitis breakpoints are STRICTER than non-meningitis — a different susceptibility standard. For neonates (<1 month): ampicillin (Listeria, GBS) + cefotaxime or gentamicin (E. coli, GNR). For infants/children (>1 month): ceftriaxone + vancomycin empirically. S. pneumoniae meningitis breakpoint susceptibility is 98% at OHSU. Always add dexamethasone for suspected pneumococcal meningitis (before or with first antibiotic dose). Acyclovir if HSV suspected.",
      rx:[
        {name:"Neonate (<1 month)",drugs:["Ampicillin + Cefotaxime (or Gentamicin)"],note:"Covers GBS, E. coli, Listeria. Gentamicin: E. coli 93%."},
        {name:"Infant/Child (>1 month)",drugs:["Ceftriaxone + Vancomycin"],note:"Ceftriaxone (meningitis): S. pneumoniae 98%. Vancomycin for resistant pneumococcus."},
        {name:"Add dexamethasone",drugs:["Dexamethasone"],note:"Give before or with first antibiotic dose for suspected pneumococcal meningitis."},
      ]},
    adult:{ tk:"adult-nonurine", orgs:["S. pneumoniae","E. coli"],
      teach:"Adult meningitis empiric: ceftriaxone + vancomycin. Add ampicillin for Listeria coverage in age >50, immunocompromised, or alcoholism. S. pneumoniae meningitis susceptibility is 88% at OHSU — vancomycin is essential empirically. Dexamethasone before first antibiotic dose.",
      rx:[
        {name:"Immunocompetent adult",drugs:["Ceftriaxone + Vancomycin"],note:"Ceftriaxone (meningitis): S. pneumoniae 88%. Vancomycin for resistant strains."},
        {name:"Age >50 or immunocompromised",drugs:["Ceftriaxone + Vancomycin + Ampicillin"],note:"Ampicillin for Listeria coverage."},
        {name:"Add dexamethasone",drugs:["Dexamethasone"],note:"Before or with first antibiotic dose for suspected pneumococcal meningitis."},
      ]},
  },
  // ── MSK ──
  septic_joint: {
    cat:"msk", icon:"🦴", title:"Septic Arthritis / Osteomyelitis",
    desc:"S. aureus predominates — age-dependent etiology",
    peds:{ tk:"peds-nonurine", orgs:["All S. aureus","MRSA","MSSA"],
      teach:"S. aureus is the most common cause of septic arthritis and osteomyelitis in children. Kingella kingae is important in children <5 years (susceptible to cephalosporins; not on antibiogram). Empiric coverage should include anti-staphylococcal therapy. With MRSA rate of 22%, cefazolin is reasonable first-line unless MRSA risk factors present. Surgical source control (aspiration/washout) is essential for septic arthritis.",
      rx:[
        {name:"Empiric (no MRSA risk factors)",drugs:["Cefazolin (IV)"],note:"MSSA 100%. Covers Kingella. Narrow on culture."},
        {name:"MRSA risk factors",drugs:["Vancomycin (IV)"],note:"MRSA 100%. Add ceftriaxone if GNR concern or neonatal age."},
        {name:"Culture-confirmed MSSA",drugs:["Cefazolin → Cephalexin (PO step-down)"],note:"MSSA 100%. Prolonged course (3–6 weeks for osteo)."},
        {name:"Culture-confirmed MRSA",drugs:["Vancomycin (IV) → Clindamycin or TMP/SMX (PO)"],note:"Clindamycin: MRSA 93%. TMP/SMX: MRSA 94%. PO step-down per ID."},
      ]},
    adult:{ tk:"adult-nonurine", orgs:["All S. aureus","MRSA","MSSA"],
      teach:"S. aureus (including MRSA at 42%) is the dominant pathogen. For native joint/acute osteomyelitis: vancomycin empirically given high MRSA rate. For prosthetic joint infections, broader coverage and ID consultation essential. Coagulase-negative staphylococci (S. epidermidis 29% cefazolin) are relevant in prosthetic infections.",
      rx:[
        {name:"Native joint / Acute osteo",drugs:["Vancomycin (IV)"],note:"MRSA 100%. Adult MRSA rate 42% — empiric MRSA coverage warranted."},
        {name:"Culture-confirmed MSSA",drugs:["Cefazolin (IV) → Cephalexin (PO)"],note:"MSSA 100%. Prolonged course required."},
        {name:"Prosthetic joint (empiric)",drugs:["Vancomycin + Cefepime"],note:"Broad coverage pending operative cultures. ID consult recommended."},
      ]},
  },
  // ── BLOODSTREAM ──
  sepsis: {
    cat:"bsi", icon:"🩸", title:"Sepsis / Bacteremia (Unknown Source)",
    desc:"Broad empiric coverage pending cultures",
    peds:{ tk:"peds-nonurine", orgs:["E. coli","All S. aureus","P. aeruginosa"],
      teach:"Empiric sepsis coverage depends on age, suspected source, and risk factors. For neonates: ampicillin + gentamicin (or cefotaxime). For older infants/children without clear source: ceftriaxone + vancomycin provides broad GNR + GPC coverage. Add Pseudomonas coverage for immunocompromised or healthcare-associated infections.",
      rx:[
        {name:"Neonate (<28 days)",drugs:["Ampicillin + Gentamicin"],note:"Covers GBS, E. coli, Listeria. Gentamicin: E. coli 93%."},
        {name:"Infant/Child (community)",drugs:["Ceftriaxone + Vancomycin"],note:"Ceftriaxone: E. coli 85%. Vancomycin: S. aureus 100%."},
        {name:"Healthcare-associated / Immunocompromised",drugs:["Cefepime + Vancomycin"],note:"Cefepime: E. coli 93%, Pseudomonas 97%. Vancomycin: S. aureus 100%."},
        {name:"Neutropenic fever",drugs:["Cefepime (monotherapy)"],note:"Cefepime 97% Pseudomonas, 93% E. coli. Add vancomycin per institutional criteria."},
      ]},
    adult:{ tk:"adult-nonurine", orgs:["E. coli","All S. aureus","P. aeruginosa","K. pneumoniae"],
      teach:"Broad empiric approach. Vancomycin for MRSA (42% rate). Cefepime or pip/tazo for GNR coverage. Source-directed narrowing is essential once cultures and imaging clarify the picture.",
      rx:[
        {name:"Community-acquired",drugs:["Ceftriaxone + Vancomycin"],note:"Ceftriaxone: E. coli 84%. Vancomycin: S. aureus 100%."},
        {name:"Healthcare-associated",drugs:["Cefepime + Vancomycin"],note:"Cefepime: E. coli 91%, Pseudomonas 89%."},
        {name:"Severe / Shock",drugs:["Meropenem (restricted) + Vancomycin"],note:"Meropenem: E. coli 100%, Pseudomonas 89%. Broadest empiric GNR coverage."},
      ]},
  },
  // ── HEAD & NECK / ENT ──
  pharyngitis: {
    cat:"ent", icon:"👅", title:"Pharyngitis / Tonsillitis",
    desc:"GAS pharyngitis and peritonsillar abscess",
    peds:{ tk:"peds-nonurine", orgs:["S. pneumoniae*"],
      teach:"GAS (S. pyogenes) is universally penicillin-susceptible — no antibiogram needed. S. pneumoniae shown as closest streptococcal reference. For peritonsillar abscess: mixed flora (GAS + oral anaerobes ± S. aureus). Do NOT use azithromycin empirically for GAS — erythromycin (surrogate) only 69% for S. pneumoniae locally.",
      rx:[
        {name:"GAS pharyngitis",drugs:["Amoxicillin (PO) or Penicillin V"],note:"GAS: 100% penicillin-susceptible worldwide. No antibiogram needed."},
        {name:"PCN allergy",drugs:["Cephalexin or Clindamycin"],note:"Cephalexin if non-severe allergy. Clindamycin if anaphylaxis. Avoid azithromycin."},
        {name:"Peritonsillar abscess",drugs:["Ampicillin/sulbactam or Clindamycin (IV)"],note:"Polymicrobial: GAS + anaerobes ± S. aureus. Drainage is primary."},
        {name:"PTA + MRSA concern",drugs:["Clindamycin ± Vancomycin"],note:"Clindamycin: S. aureus 88%."},
      ]},
    adult:{ tk:"adult-nonurine", orgs:["S. pneumoniae"],
      teach:"Same principles. Consider Fusobacterium necrophorum (Lemierre syndrome) in young adults — anaerobic, susceptible to penicillins and metronidazole.",
      rx:[
        {name:"GAS pharyngitis",drugs:["Amoxicillin (PO) or Penicillin V"],note:"GAS: 100% penicillin-susceptible. 10-day course."},
        {name:"PCN allergy",drugs:["Cephalexin or Clindamycin"],note:"Erythromycin (azithromycin surrogate) only 59% for S. pneumoniae."},
        {name:"Peritonsillar abscess",drugs:["Ampicillin/sulbactam or Clindamycin"],note:"Drainage + broad aerobic/anaerobic coverage."},
        {name:"Lemierre concern",drugs:["Ampicillin/sulbactam ± Metronidazole"],note:"F. necrophorum: anaerobic, susceptible to beta-lactam/BLI."},
      ]},
  },
  aom: {
    cat:"ent", icon:"👂", title:"Acute Otitis Media",
    desc:"S. pneumoniae, H. influenzae, Moraxella",
    peds:{ tk:"peds-nonurine", orgs:["S. pneumoniae*"],
      teach:"AOM: S. pneumoniae, non-typeable H. influenzae, Moraxella catarrhalis. H. influenzae and Moraxella are not on the antibiogram. High-dose amoxicillin (80–90 mg/kg/day) is first-line — achieves middle ear levels above the pneumococcal MIC. Amoxicillin/clavulanate for treatment failure or beta-lactamase producing organisms. Observation without antibiotics is appropriate for mild AOM in children ≥2 years.",
      rx:[
        {name:"First-line",drugs:["Amoxicillin high-dose (PO)"],note:"80–90 mg/kg/day. Covers S. pneumoniae (non-meningitis 100%)."},
        {name:"Treatment failure (48–72h)",drugs:["Amoxicillin/clavulanate high-dose (PO)"],note:"Adds beta-lactamase coverage for H. influenzae and Moraxella."},
        {name:"PCN allergy (non-severe)",drugs:["Cephalexin or Cefdinir"],note:"Second-gen/third-gen cephalosporins if non-anaphylactic allergy."},
        {name:"Severe PCN allergy",drugs:["Azithromycin (reluctantly) or Clindamycin"],note:"Erythromycin/azithromycin surrogate: S. pneumoniae only 69%. Suboptimal."},
      ]},
    adult:{ tk:"adult-nonurine", orgs:["S. pneumoniae"],
      teach:"Less common in adults but same pathogen profile. Amoxicillin or amoxicillin/clavulanate is first-line.",
      rx:[
        {name:"Standard treatment",drugs:["Amoxicillin or Amoxicillin/clavulanate (PO)"],note:"S. pneumoniae: penicillin 93% (non-meningitis)."},
        {name:"PCN allergy",drugs:["Doxycycline or respiratory fluoroquinolone"],note:"Levofloxacin available for adults (not restricted like peds)."},
      ]},
  },
  sinusitis: {
    cat:"ent", icon:"🤧", title:"Acute Bacterial Sinusitis",
    desc:"S. pneumoniae, H. influenzae, Moraxella",
    peds:{ tk:"peds-nonurine", orgs:["S. pneumoniae*"],
      teach:"Same pathogen profile as AOM. Most sinusitis is viral — bacterial sinusitis diagnosed by ≥10 days of symptoms without improvement, severe onset (≥3 days high fever + purulent discharge), or worsening after initial improvement. Amoxicillin/clavulanate is first-line (preferred over amoxicillin alone to cover beta-lactamase producing H. influenzae).",
      rx:[
        {name:"First-line",drugs:["Amoxicillin/clavulanate (PO)"],note:"Covers S. pneumoniae (100% non-meningitis), H. influenzae, Moraxella."},
        {name:"PCN allergy",drugs:["Cephalexin or Clindamycin"],note:"Limited options in peds with true PCN allergy."},
        {name:"Severe / treatment failure",drugs:["Ceftriaxone (IV/IM)"],note:"S. pneumoniae 100% (non-meningitis). Consider for failed oral therapy."},
      ]},
    adult:{ tk:"adult-nonurine", orgs:["S. pneumoniae"],
      teach:"Same principles. Amoxicillin/clavulanate preferred first-line. Doxycycline is an alternative. Respiratory fluoroquinolones (levofloxacin) reserved for treatment failure or true beta-lactam allergy.",
      rx:[
        {name:"First-line",drugs:["Amoxicillin/clavulanate (PO)"],note:"S. pneumoniae: penicillin 93%."},
        {name:"PCN allergy",drugs:["Doxycycline (PO)"],note:"Reasonable alternative in adults."},
        {name:"Treatment failure",drugs:["Levofloxacin (PO)"],note:"Respiratory fluoroquinolone. Reserve for failures."},
      ]},
  },
};

// ─── LEARNER TOPICS ─────────────────────────────────────────────────────────

const TEACH_TOPICS = {
  "what-is":{t:"What Is an Antibiogram?",c:"An antibiogram is a periodic summary of antimicrobial susceptibilities of local bacterial isolates. Numbers = % isolates susceptible. Minimum 30 isolates per organism (CLSI M39). Each patient isolate counted once per year."},
  "reading":{t:"Reading the Numbers",c:"≥90% = reliable for empiric therapy. 80–89% = context-dependent. <80% = poor empiric choice. Dash (—) = not tested or intrinsic resistance. Always consider infection site, drug penetration, and patient factors."},
  "mrsa":{t:"MRSA Rates",c:"OHSU pediatric MRSA: 22%. Adult MRSA: 42%. Drives empiric SSTI coverage decisions. Oxacillin susceptibility predicts cefazolin susceptibility."},
  "restricted":{t:"Restricted Antibiotics",c:"Marked '(restricted)' = requires ID approval. Preserves broad-spectrum efficacy, reduces C. diff, slows resistance. Ciprofloxacin restricted in peds. ID pharmacist: pager 16695."},
  "ampc":{t:"AmpC β-Lactamase",c:"Enterobacter, Citrobacter, Serratia, Morganella harbor inducible AmpC. 3rd-gen cephalosporin resistance can emerge during therapy (3–4 days). Cefepime is stable against AmpC."},
  "uti-tips":{t:"Empiric UTI Tips",c:"Peds: cephalexin (E. coli 92%), nitrofurantoin (98% but lower tract only). TMP/SMX 75%. Febrile UTI: ceftriaxone 95%. Adults: nitrofurantoin 98% IDSA first-line cystitis."},
  "gram":{t:"Gram Stain Guidance",c:"Gram-neg (pink): Enterobacteriaceae + non-fermenters. Gram-pos (purple): staph, strep, enterococcus. Match empiric coverage to likely organism based on infection site."},
};

const COST={
  "Amikacin (restricted)":{i:"<$",o:"—"},"Ampicillin":{i:"<$",o:"<$"},"Amoxicillin/clavulanate":{i:"<$",o:"<$"},
  "Ampicillin/sulbactam":{i:"<$",o:"<$"},"Cefazolin":{i:"<$",o:"<$"},"Cefepime":{i:"<$",o:"—"},
  "Cefoxitin":{i:"<$",o:"—"},"Ceftriaxone":{i:"<$",o:"<$"},"Ceftriaxone (meningitis)":{i:"<$",o:"—"},
  "Ceftriaxone (non-meningitis)":{i:"<$",o:"<$"},"Ceftazidime (restricted)":{i:"<$",o:"—"},
  "Ciprofloxacin":{i:"<$",o:"<$"},"Ciprofloxacin (restricted)":{i:"<$",o:"<$"},"Clindamycin":{i:"<$",o:"$"},
  "Ertapenem (restricted)":{i:"$$",o:"—"},"Ertapenem":{i:"$$",o:"—"},"Erythromycin":{i:"—",o:"—"},
  "Gentamicin":{i:"<$",o:"—"},"Levofloxacin":{i:"<$",o:"<$"},"Levofloxacin (restricted)":{i:"<$",o:"<$"},
  "Meropenem (restricted)":{i:"$$",o:"—"},"Nitrofurantoin":{i:"—",o:"<$"},"Oxacillin/nafcillin":{i:"$$",o:"—"},
  "Penicillin":{i:"<$",o:"<$"},"Penicillin G":{i:"<$",o:"<$"},"Penicillin (meningitis)":{i:"<$",o:"—"},
  "Penicillin (non-meningitis)":{i:"<$",o:"<$"},"Piperacillin/tazobactam":{i:"$",o:"—"},
  "Tetracycline":{i:"<$",o:"$$"},"Tobramycin":{i:"<$",o:"—"},"TMP/SMX":{i:"$$",o:"<$"},"Vancomycin":{i:"<$",o:"—"},
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function bdg(v){
  if(v==null)return{c:0,l:"—"};if(v>=90)return{c:1,l:v+"%"};if(v>=80)return{c:2,l:v+"%"};if(v>=70)return{c:3,l:v+"%"};return{c:4,l:v+"%"};
}
function bdgStyle(c,V){
  return[{bg:"transparent",fg:V.tx4},{bg:V.gn,fg:V.gnT},{bg:V.yw,fg:V.ywT},{bg:V.or,fg:V.orT},{bg:V.rd,fg:V.rdT}][c];
}
function cellStyle(v,V){
  if(v==null)return{backgroundColor:"transparent",color:V.tx4};
  if(v>=90)return{backgroundColor:V.gn,color:V.gnT};if(v>=80)return{backgroundColor:V.yw,color:V.ywT};
  if(v>=70)return{backgroundColor:V.or,color:V.orT};return{backgroundColor:V.rd,color:V.rdT};
}

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function App(){
  const[dk,setDk]=useState(true);
  const[pop,setPop]=useState(null); // peds|adult
  const[entry,setEntry]=useState(null); // syndrome|organism
  const[synCat,setSynCat]=useState(null);
  const[syn,setSyn]=useState(null);
  const[src,setSrc]=useState(null); // urine|nonurine
  const[org,setOrg]=useState(null);
  const[learn,setLearn]=useState(false);
  const[openT,setOpenT]=useState(null);
  const[view,setView]=useState("wiz");
  const[search,setSearch]=useState("");

  const tKey=pop&&src?`${pop}-${src}`:null;
  const table=tKey?TABLES[tKey]:null;
  const reset=()=>{setPop(null);setEntry(null);setSynCat(null);setSyn(null);setSrc(null);setOrg(null);setSearch("");setView("wiz");};

  const V=dk?{
    bg:"#0f172a",bg2:"#1e293b",bg3:"#273549",bd:"#1e3a5f",bd2:"#334155",
    tx:"#e2e8f0",tx2:"#cbd5e1",tx3:"#94a3b8",tx4:"#64748b",
    ac:"#3b82f6",acL:"#93c5fd",acBg:"#172554",
    gn:"#064e3b",gnT:"#6ee7b7",yw:"#713f12",ywT:"#fcd34d",or:"#7c2d12",orT:"#fdba74",rd:"#7f1d1d",rdT:"#fca5a5",
    gnB:"#2d4a3e",gnHB:"#064e3b",gnHBd:"#34d399",gpB:"#4a3560",gpHB:"#3b0764",gpHBd:"#a78bfa",
    chipBg:"#1e3a5f",chipTx:"#93c5fd",teachBg:"rgba(30,58,95,0.3)",
    lpBg:"linear-gradient(135deg,#172554,#1e1b4b)",tcBg:"rgba(30,58,95,0.4)",tcBgO:"rgba(30,58,95,0.6)",
    rTag:"#ef4444",rTagBg:"rgba(239,68,68,0.15)",shadow:"rgba(59,130,246,0.12)",
  }:{
    bg:"#f8fafc",bg2:"#ffffff",bg3:"#f1f5f9",bd:"#e2e8f0",bd2:"#cbd5e1",
    tx:"#0f172a",tx2:"#1e293b",tx3:"#475569",tx4:"#94a3b8",
    ac:"#2563eb",acL:"#3b82f6",acBg:"#eff6ff",
    gn:"#d1fae5",gnT:"#065f46",yw:"#fef3c7",ywT:"#92400e",or:"#ffedd5",orT:"#9a3412",rd:"#fee2e2",rdT:"#991b1b",
    gnB:"#a7f3d0",gnHB:"#d1fae5",gnHBd:"#059669",gpB:"#ddd6fe",gpHB:"#ede9fe",gpHBd:"#7c3aed",
    chipBg:"#dbeafe",chipTx:"#1e40af",teachBg:"rgba(37,99,235,0.04)",
    lpBg:"linear-gradient(135deg,#eff6ff,#eef2ff)",tcBg:"rgba(37,99,235,0.05)",tcBgO:"rgba(37,99,235,0.08)",
    rTag:"#dc2626",rTagBg:"rgba(220,38,38,0.1)",shadow:"rgba(37,99,235,0.08)",
  };

  // Organism results
  const orgRes=useMemo(()=>{
    if(!table||org===null)return[];
    return table.abx.map((a,i)=>({name:a,value:table.d[i][org],cost:COST[a]||{i:"?",o:"?"}}))
      .filter(r=>r.value!=null).sort((a,b)=>b.value-a.value);
  },[table,org]);
  const filtered=useMemo(()=>{if(!search)return orgRes;const q=search.toLowerCase();return orgRes.filter(r=>r.name.toLowerCase().includes(q));},[orgRes,search]);

  // Syndrome data
  const synInfo=syn?SYNDROMES[syn]:null;
  const synData=synInfo?synInfo[pop==="peds"?"peds":"adult"]:null;
  const synTable=synData?TABLES[synData.tk]:null;
  const synOrgData=useMemo(()=>{
    if(!synData||!synTable)return[];
    return synData.orgs.map(name=>{
      const idx=synTable.organisms.findIndex(o=>o.s===name);
      if(idx===-1)return{name,data:[]};
      const o=synTable.organisms[idx];
      const d=synTable.abx.map((a,i)=>({name:a,value:synTable.d[i][idx]})).filter(r=>r.value!=null).sort((a,b)=>b.value-a.value);
      return{name:o.f,short:o.s,n:o.n,data:d};
    });
  },[synData,synTable]);

  // Syndromes filtered by category
  const catSyndromes=synCat?Object.entries(SYNDROMES).filter(([,s])=>s.cat===synCat):[];

  const s={
    root:{fontFamily:"'IBM Plex Sans',sans-serif",minHeight:"100vh",background:V.bg,color:V.tx,transition:"background .3s,color .3s"},
    hdr:{background:V.bg2,borderBottom:`1px solid ${V.bd}`,padding:"14px 20px",position:"sticky",top:0,zIndex:100},
    hdrIn:{maxWidth:900,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10},
    body:{maxWidth:900,margin:"0 auto",padding:"16px 16px 40px"},
    footer:{marginTop:32,padding:"16px 0",borderTop:`1px solid ${V.bd}`,textAlign:"center",fontSize:11,color:V.tx4,lineHeight:1.6},
  };

  return(
    <div style={s.root}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap');*{box-sizing:border-box;margin:0;padding:0;}@keyframes sd{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}@keyframes fi{from{opacity:0}to{opacity:1}}`}</style>

      <header style={s.hdr}><div style={s.hdrIn}>
        <div>
          <h1 style={{fontSize:20,fontWeight:700,letterSpacing:"-0.01em"}}>OHSU Antibiogram</h1>
          <p style={{fontSize:12,color:V.tx4,marginTop:2}}>Interactive Susceptibility Guide · 2024 Data</p>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <Btn V={V} onClick={()=>setDk(!dk)}>{dk?"☀️":"🌙"}</Btn>
          <Btn V={V} active={learn} onClick={()=>setLearn(!learn)}>{learn?"📖 ON":"📕 Learner"}</Btn>
          {table&&entry==="organism"&&<Btn V={V} onClick={()=>setView(view==="wiz"?"tbl":"wiz")}>{view==="wiz"?"▦ Table":"◉ Wizard"}</Btn>}
        </div>
      </div></header>

      <div style={s.body}>
        {learn&&<LearnPanel V={V} openT={openT} setOpenT={setOpenT}/>}

        {/* STEP 1: POPULATION */}
        {!pop&&<Fade>
          <SL>Select Patient Population</SL>
          <G2><SC V={V} i="👶" t="Pediatric" d="Doernbecher Children's Hospital" onClick={()=>setPop("peds")}/><SC V={V} i="🧑" t="Adult" d="OHSU Adult Hospital" onClick={()=>setPop("adult")}/></G2>
          {learn&&<Tch V={V}>💡 <b>Why population matters:</b> MRSA rate is 22% in peds vs. 42% in adults.</Tch>}
        </Fade>}

        {/* STEP 2: ENTRY MODE */}
        {pop&&!entry&&<Fade>
          <Bk V={V} onClick={()=>setPop(null)}/>
          <SL>How do you want to look up coverage?</SL>
          <G2><SC V={V} i="🩺" t="By Clinical Syndrome" d="Appendicitis, UTI, pneumonia, etc." onClick={()=>setEntry("syndrome")}/><SC V={V} i="🦠" t="By Organism" d="Look up a specific pathogen" onClick={()=>setEntry("organism")}/></G2>
          {learn&&<Tch V={V}>💡 <b>Syndrome vs. Organism:</b> Syndrome pathway maps ED presentations to likely pathogens and empiric regimens. Organism pathway for when you know the specific bug.</Tch>}
        </Fade>}

        {/* ═══ SYNDROME PATHWAY ═══ */}
        {/* Category select */}
        {pop&&entry==="syndrome"&&!synCat&&<Fade>
          <Bk V={V} onClick={()=>setEntry(null)}/>
          <SL>Select Infection Category — {pop==="peds"?"Pediatric":"Adult"}</SL>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:8}}>
            {SYN_CATEGORIES.map(c=><button key={c.id} onClick={()=>setSynCat(c.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"14px 16px",background:V.bg2,border:`1px solid ${V.bd2}`,borderRadius:10,cursor:"pointer",fontFamily:"inherit",color:"inherit",textAlign:"left",transition:"all .2s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=V.ac;e.currentTarget.style.background=V.acBg;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=V.bd2;e.currentTarget.style.background=V.bg2;}}>
              <span style={{fontSize:24}}>{c.icon}</span>
              <span style={{fontSize:13,fontWeight:600}}>{c.label}</span>
            </button>)}
          </div>
        </Fade>}

        {/* Syndrome select within category */}
        {pop&&entry==="syndrome"&&synCat&&!syn&&<Fade>
          <Bk V={V} onClick={()=>setSynCat(null)} label="Back to categories"/>
          <SL>{SYN_CATEGORIES.find(c=>c.id===synCat)?.icon} {SYN_CATEGORIES.find(c=>c.id===synCat)?.label}</SL>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {catSyndromes.map(([k,si])=><button key={k} onClick={()=>setSyn(k)} style={{display:"flex",alignItems:"center",gap:14,padding:"16px 18px",background:V.bg2,border:`1px solid ${V.bd2}`,borderRadius:10,cursor:"pointer",fontFamily:"inherit",color:"inherit",textAlign:"left",transition:"all .2s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=V.ac;e.currentTarget.style.background=V.acBg;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=V.bd2;e.currentTarget.style.background=V.bg2;}}>
              <span style={{fontSize:28,flexShrink:0}}>{si.icon}</span>
              <div style={{display:"flex",flexDirection:"column",gap:2}}>
                <span style={{fontSize:14,fontWeight:700}}>{si.title}</span>
                <span style={{fontSize:12,color:V.tx4}}>{si.desc}</span>
              </div>
            </button>)}
          </div>
        </Fade>}

        {/* Syndrome detail */}
        {pop&&entry==="syndrome"&&syn&&synData&&<Fade>
          <Bk V={V} onClick={()=>setSyn(null)} label="Back to conditions"/>
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}>
            <span style={{fontSize:28}}>{synInfo.icon}</span>
            <div>
              <h2 style={{fontSize:20,fontWeight:700,margin:0}}>{synInfo.title}</h2>
              <p style={{fontSize:12,color:V.tx4,marginTop:2}}>{pop==="peds"?"Pediatric":"Adult"} · {synInfo.desc}</p>
            </div>
          </div>
          {learn&&<Tch V={V} style={{marginBottom:16}}>📖 <b>Clinical Context</b><br/>{synData.teach}</Tch>}

          <SecL V={V}>Empiric Regimens</SecL>
          {synData.rx.map((r,i)=><div key={i} style={{padding:"14px 16px",background:V.bg2,border:`1px solid ${V.bd2}`,borderRadius:10,marginBottom:8}}>
            <div style={{fontSize:13,fontWeight:700,marginBottom:6}}>{r.name}</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>
              {r.drugs.map((d,j)=><span key={j} style={{padding:"4px 10px",borderRadius:6,fontSize:12,fontWeight:600,background:V.chipBg,color:V.chipTx}}>{d}</span>)}
            </div>
            <div style={{fontSize:12,lineHeight:1.5,color:V.tx3}}>{r.note}</div>
          </div>)}

          <SecL V={V} style={{marginTop:20}}>Key Organism Susceptibilities</SecL>
          {synOrgData.map((o,i)=><div key={i} style={{background:V.bg2,border:`1px solid ${V.bd2}`,borderRadius:10,padding:"14px 16px",marginBottom:8}}>
            <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:8}}>
              <span style={{fontSize:14,fontWeight:700,fontStyle:"italic"}}>{o.name}</span>
              {o.n&&<span style={{fontSize:11,color:V.tx4,fontFamily:"'IBM Plex Mono',monospace"}}>n={o.n}</span>}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:2}}>
              {o.data.slice(0,8).map((a,j)=>{const b=bdg(a.value);const bs=bdgStyle(b.c,V);return(
                <div key={j} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0"}}>
                  <span style={{fontSize:12,color:V.tx2}}>{a.name}</span>
                  <span style={{display:"inline-block",minWidth:48,textAlign:"center",padding:"4px 10px",borderRadius:6,fontSize:13,fontWeight:700,fontFamily:"'IBM Plex Mono',monospace",background:bs.bg,color:bs.fg}}>{b.l}</span>
                </div>);})}
              {o.data.length>8&&<p style={{fontSize:11,color:V.tx4,marginTop:4,fontStyle:"italic"}}>+ {o.data.length-8} more tested</p>}
            </div>
          </div>)}

          <NB V={V}>
            <p style={{fontWeight:700,marginBottom:6}}>📋 Important Notes</p>
            <p>• Always narrow therapy based on culture & sensitivity.</p>
            <p>• Regimens shown are empiric starting points.</p>
            <p>• ID pharmacist: pager 16695.</p>
            {syn==="cf"&&<p style={{fontWeight:700}}>• ⚠️ Antibiogram EXCLUDES CF P. aeruginosa isolates.</p>}
          </NB>
        </Fade>}

        {/* ═══ ORGANISM PATHWAY ═══ */}
        {pop&&entry==="organism"&&!src&&<Fade>
          <Bk V={V} onClick={()=>setEntry(null)}/>
          <SL>Select Infection Source</SL>
          <G2><SC V={V} i="🩸" t="Non-Urine" d="Blood, wound, respiratory, CSF" onClick={()=>setSrc("nonurine")}/><SC V={V} i="🧪" t="Urine" d="Urinary tract isolates only" onClick={()=>setSrc("urine")}/></G2>
          {learn&&<Tch V={V}>💡 <b>Separate urine data:</b> Drug concentrations in urine differ from serum. Nitrofurantoin only works in urine.</Tch>}
        </Fade>}

        {table&&entry==="organism"&&view==="wiz"&&org===null&&<Fade>
          <Bk V={V} onClick={()=>setSrc(null)}/>
          <SL>Select Organism — {table.title}</SL>
          <p style={{fontSize:12,color:V.tx4,marginTop:-12,marginBottom:16}}>{table.period}</p>
          <SecL V={V}>Gram-Negative</SecL>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:8,marginBottom:4}}>
            {table.organisms.map((o,i)=>o.g==="n"?<OC key={i} o={o} V={V} gp={false} onClick={()=>setOrg(i)}/>:null)}
          </div>
          <SecL V={V} style={{marginTop:16}}>Gram-Positive</SecL>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:8,marginBottom:4}}>
            {table.organisms.map((o,i)=>o.g==="p"?<OC key={i} o={o} V={V} gp={true} onClick={()=>setOrg(i)}/>:null)}
          </div>
          {learn&&<Tch V={V}>💡 <b>Isolate counts:</b> n= is isolates tested. CLSI recommends minimum 30.</Tch>}
        </Fade>}

        {table&&entry==="organism"&&view==="wiz"&&org!==null&&<Fade>
          <Bk V={V} onClick={()=>{setOrg(null);setSearch("");}} label="Back to organisms"/>
          <h2 style={{fontSize:18,fontWeight:700,margin:0,fontStyle:"italic"}}>{table.organisms[org].f}</h2>
          <p style={{fontSize:12,color:V.tx4,margin:"4px 0 12px",fontFamily:"'IBM Plex Mono',monospace"}}>n={table.organisms[org].n} · {table.title} · {table.period}</p>
          <input type="text" placeholder="Filter antibiotics..." value={search} onChange={e=>setSearch(e.target.value)}
            style={{width:"100%",padding:"10px 14px",background:V.bg2,border:`1px solid ${V.bd2}`,borderRadius:8,color:V.tx,fontSize:13,fontFamily:"inherit",marginBottom:12,outline:"none"}}/>
          {learn&&<div style={{display:"flex",flexWrap:"wrap",gap:12,marginBottom:12,fontSize:11,color:V.tx3}}>
            {[[V.gn,V.gnT,"≥90%"],[V.yw,V.ywT,"80–89%"],[V.or,V.orT,"70–79%"],[V.rd,V.rdT,"<70%"]].map(([bg,bd,l],i)=>(
              <span key={i} style={{display:"flex",alignItems:"center",gap:5}}><span style={{width:10,height:10,borderRadius:3,background:bg,border:`1px solid ${bd}`}}/>{l}</span>))}
          </div>}
          <div style={{display:"flex",flexDirection:"column",gap:2}}>
            {filtered.map((r,i)=>{const b=bdg(r.value);const bs=bdgStyle(b.c,V);return(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",background:V.bg2,borderRadius:6,borderLeft:r.name.includes("restricted")?`3px solid ${V.rTag}`:"none"}}>
                <div style={{fontSize:13,fontWeight:500,color:V.tx2,display:"flex",alignItems:"center",gap:6}}>
                  {r.name}{r.name.includes("restricted")&&<RT V={V}/>}
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:11,color:V.tx4,fontFamily:"'IBM Plex Mono',monospace"}}>{r.cost.i}{r.cost.o!=="—"?` / ${r.cost.o}`:""}</span>
                  <span style={{display:"inline-block",minWidth:48,textAlign:"center",padding:"4px 10px",borderRadius:6,fontSize:13,fontWeight:700,fontFamily:"'IBM Plex Mono',monospace",background:bs.bg,color:bs.fg}}>{b.l}</span>
                </div>
              </div>);})}
            {filtered.length===0&&<p style={{color:V.tx4,padding:16,textAlign:"center"}}>No matching antibiotics</p>}
          </div>
          {learn&&table.organisms[org].s.includes("cloacae")&&<Tch V={V}>⚠️ <b>AmpC Alert:</b> Enterobacter cloacae — resistance to 3rd-gen cephalosporins can emerge during therapy. Prefer cefepime.</Tch>}
          <NB V={V}><p style={{fontWeight:700,marginBottom:6}}>📋 Table Notes</p>{table.notes.map((n,i)=><p key={i}>• {n}</p>)}</NB>
        </Fade>}

        {/* TABLE VIEW */}
        {table&&entry==="organism"&&view==="tbl"&&<Fade>
          <Bk V={V} onClick={()=>setView("wiz")} label="Wizard View"/>
          <h2 style={{fontSize:16,fontWeight:700,marginBottom:12}}>{table.title} — {table.period}</h2>
          <div style={{overflowX:"auto",borderRadius:8,border:`1px solid ${V.bd}`}}>
            <table style={{width:"max-content",minWidth:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead><tr>
                <th style={{padding:"6px 8px",border:`1px solid ${V.bd}`,fontWeight:600,whiteSpace:"nowrap",position:"sticky",left:0,zIndex:4,background:V.bg2,color:V.tx3,minWidth:180}}>Antibiotic</th>
                {table.organisms.map((o,i)=><th key={i} style={{padding:"6px 8px",border:`1px solid ${V.bd}`,background:V.bg2,color:V.tx3,textAlign:"center",minWidth:70,whiteSpace:"nowrap"}}>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}><span>{o.s}</span><span style={{fontSize:10,color:V.tx4,fontFamily:"'IBM Plex Mono',monospace",fontWeight:400}}>n={o.n}</span></div>
                </th>)}
              </tr></thead>
              <tbody>{table.abx.map((abx,ai)=><tr key={ai}>
                <td style={{padding:"6px 8px",border:`1px solid ${V.bd}`,position:"sticky",left:0,zIndex:3,background:V.bg,fontWeight:500,color:V.tx2,whiteSpace:"nowrap",fontSize:12}}>
                  {abx}{abx.includes("restricted")&&<RT V={V}/>}
                </td>
                {table.organisms.map((_,oi)=>{const v=table.d[ai][oi];const cs=cellStyle(v,V);return(
                  <td key={oi} style={{padding:"6px 8px",border:`1px solid ${V.bd}`,textAlign:"center",fontWeight:v!=null?600:400,fontSize:12,...cs}}>{v!=null?v+"%":"—"}</td>
                );})}
              </tr>)}</tbody>
            </table>
          </div>
          <NB V={V} style={{marginTop:16}}>{table.notes.map((n,i)=><p key={i}>• {n}</p>)}</NB>
        </Fade>}

        <footer style={s.footer}>
          <p>OHSU Antibiogram · HC-CKT-134-GUD Rev. 042425 · Data: Jan–Dec 2024</p>
          <p>For clinical reference only. Always confirm with culture & sensitivity.</p>
          {pop&&<button onClick={reset} style={{marginTop:12,background:"none",border:`1px solid ${V.bd2}`,color:V.tx4,padding:"6px 16px",borderRadius:6,cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>⟲ Start Over</button>}
        </footer>
      </div>
    </div>
  );
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Btn({V,active,onClick,children}){
  return<button onClick={onClick} style={{padding:"6px 14px",borderRadius:20,border:`1px solid ${active?V.ac:V.bd2}`,background:active?V.acBg:V.bg2,color:active?V.acL:V.tx3,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",boxShadow:active?`0 0 12px ${V.shadow}`:"none"}}>{children}</button>;
}
function SC({V,i,t,d,onClick}){
  return<button onClick={onClick} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,padding:"28px 16px",background:V.bg2,border:`1px solid ${V.bd2}`,borderRadius:12,cursor:"pointer",fontFamily:"inherit",color:"inherit",transition:"all .2s"}}
    onMouseEnter={e=>{e.currentTarget.style.borderColor=V.ac;e.currentTarget.style.background=V.acBg;e.currentTarget.style.transform="translateY(-2px)";}}
    onMouseLeave={e=>{e.currentTarget.style.borderColor=V.bd2;e.currentTarget.style.background=V.bg2;e.currentTarget.style.transform="none";}}>
    <span style={{fontSize:32}}>{i}</span><span style={{fontSize:16,fontWeight:700}}>{t}</span><span style={{fontSize:12,color:V.tx4}}>{d}</span>
  </button>;
}
function OC({o,V,gp,onClick}){
  const bd=gp?V.gpB:V.gnB,hBg=gp?V.gpHB:V.gnHB,hBd=gp?V.gpHBd:V.gnHBd;
  return<button onClick={onClick} style={{display:"flex",flexDirection:"column",gap:2,padding:"12px 14px",background:V.bg2,border:`1px solid ${bd}`,borderRadius:8,cursor:"pointer",textAlign:"left",fontFamily:"inherit",color:"inherit",transition:"all .15s"}}
    onMouseEnter={e=>{e.currentTarget.style.borderColor=hBd;e.currentTarget.style.background=hBg;}}
    onMouseLeave={e=>{e.currentTarget.style.borderColor=bd;e.currentTarget.style.background=V.bg2;}}>
    <span style={{fontSize:13,fontWeight:600,fontStyle:"italic"}}>{o.s}</span>
    <span style={{fontSize:11,color:V.tx4,fontFamily:"'IBM Plex Mono',monospace"}}>n={o.n}</span>
  </button>;
}
function RT({V}){return<span style={{fontSize:9,fontWeight:700,color:V.rTag,background:V.rTagBg,padding:"1px 5px",borderRadius:3,letterSpacing:"0.05em",marginLeft:4}}>R</span>;}
function Fade({children}){return<div style={{animation:"fi .25s ease"}}>{children}</div>;}
function SL({children}){return<p style={{fontSize:16,fontWeight:700,marginBottom:16,letterSpacing:"-0.01em"}}>{children}</p>;}
function G2({children}){return<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>{children}</div>;}
function Bk({V,onClick,label}){return<button onClick={onClick} style={{background:"none",border:"none",color:V.ac,fontSize:13,fontWeight:500,cursor:"pointer",padding:"4px 0",marginBottom:12,fontFamily:"inherit"}}>← {label||"Back"}</button>;}
function SecL({V,children,style}){return<p style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",color:V.tx4,marginBottom:8,paddingLeft:4,...style}}>{children}</p>;}
function Tch({V,children,style}){return<div style={{marginTop:16,padding:"12px 16px",background:V.teachBg,borderLeft:`3px solid ${V.ac}`,borderRadius:"0 8px 8px 0",fontSize:12.5,lineHeight:1.6,color:V.tx3,animation:"sd .3s ease",...style}}>{children}</div>;}
function NB({V,children,style}){return<div style={{marginTop:20,padding:"12px 16px",border:`1px solid ${V.bd}`,borderRadius:8,fontSize:12,color:V.tx4,lineHeight:1.5,...style}}>{children}</div>;}

function LearnPanel({V,openT,setOpenT}){
  return<div style={{background:V.lpBg,border:`1px solid ${V.bd}`,borderRadius:12,padding:16,marginBottom:20,animation:"sd .3s ease"}}>
    <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:12,color:V.acL,fontWeight:700,fontSize:13,letterSpacing:"0.04em",textTransform:"uppercase"}}>
      <span>📖</span><span>LEARNER MODE</span>
    </div>
    <div style={{display:"flex",flexDirection:"column",gap:6}}>
      {Object.entries(TEACH_TOPICS).map(([k,t])=><button key={k} onClick={()=>setOpenT(openT===k?null:k)} style={{
        background:openT===k?V.tcBgO:V.tcBg,border:`1px solid ${openT===k?V.ac:V.bd}`,borderRadius:8,padding:0,cursor:"pointer",textAlign:"left",color:V.tx2,fontFamily:"inherit",transition:"all .15s"}}>
        <div style={{display:"flex",justifyContent:"space-between",padding:"10px 14px",fontSize:13,fontWeight:600}}><span>{t.t}</span><span style={{color:V.tx4}}>{openT===k?"−":"+"}</span></div>
        {openT===k&&<div style={{padding:"0 14px 12px",fontSize:12.5,lineHeight:1.65,color:V.tx3,borderTop:`1px solid ${V.bd}`,paddingTop:10}}>{t.c}</div>}
      </button>)}
    </div>
  </div>;
}
