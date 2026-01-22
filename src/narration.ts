// SINGLE COMBINED NARRATION SCRIPT - Use this for ONE audio file
// Total duration: approximately 3.5 minutes (210 seconds)

export const FULL_NARRATION_SCRIPT = `
Welcome to this explainer video for the Joint Seat Allocation Authority, or JoSAA 2025.
This document shows the registration and locked choices for seat allotment at India's premier engineering institutions - the IITs, NITs, IIITs, and other Government Funded Technical Institutions.
Let's go through each section.

Section 1: Candidate Details.
The candidate's name is Kunche Naga Varun Sandeep from Andhra Pradesh.
The category is GEN-EWS, meaning General category with Economically Weaker Section status.
This provides additional reservation benefits during seat allocation.
The candidate is male, born on September 17, 2007, and is an Indian national.

Section 2: JEE Advanced Details.
This candidate has qualified for JEE Advanced with roll number and registration number confirmed.
All medical requirements are met - they're eligible for all engineering programs.

Section 3: Rankings.
The candidate secured JEE Main rank of 15,540 and a better JEE Advanced rank of 8,541.
More importantly, in the GEN-EWS category, they have an excellent rank of 1,004 in JEE Advanced.
This EWS rank of 1,004 is particularly significant as it opens up reserved seats at top IITs.

Section 4: Locking of Choices.
41 choices have been filled and the status is System Locked.
The choices were automatically locked by the system after the deadline on June 9, 2025.
The locking code ensures the integrity of the submitted choices.

Section 5: Filled Choices.
Let's explore the 41 college preferences.

Choice 1 is IIT Bombay Computer Science - the most coveted seat in Indian engineering.
Choice 2 is IIT Bombay Electrical Engineering.
Choice 3 is IIT Kharagpur Computer Science.

Choices 4 to 6 focus on IIT Hyderabad - Computer Science, Artificial Intelligence, and Mathematics and Computing.
IIT Hyderabad has emerged as a top choice with its modern curriculum.

Choices 7 to 9 are IIT Kanpur programs - Computer Science, Electrical Engineering, and Statistics.
IIT Kanpur is renowned for its strong academic culture.

The list continues with IIT Bhubaneswar, IIT Madras, IIT ISM Dhanbad, and IIT Patna.

Chemical Engineering choices include IIT Kharagpur, Hyderabad, and Guwahati.
Civil Engineering at IIT Madras and Kharagpur are also included.

The candidate has wisely added newer IITs like Palakkad, Jodhpur, Mandi, and Goa.
NIT choices include NIT Calicut, NIT Karnataka Surathkal, NIT Raipur, and MANIT Bhopal.

Choice 38 is IIT Delhi's 5-year Dual Degree in Computer Science - an excellent strategic choice.
The final choices are IIT Jodhpur AI and IIT Goa Mathematics and Computing.

Section 6: Declaration.
By submitting this form, the candidate acknowledges they have read and understood all the business rules of JoSAA 2025.
This declaration is legally binding and ensures commitment to the admission process.

Summary:
Kunche Naga Varun Sandeep from Andhra Pradesh, with JEE Advanced rank 8,541 and EWS rank 1,004, has locked 41 choices across IITs, NITs, and other institutions.
The strategic mix of choices, from IIT Bombay CSE to newer IITs, maximizes their chances of admission.
Thank you for watching this JoSAA 2025 document explainer!
`;

// Short text for speech bubbles (displayed on screen)
export const narrationScripts = {
  intro: {
    text: "Welcome to JoSAA 2025! Let's explore this seat allocation document section by section.",
    duration: 10,
  },
  candidateDetails: {
    text: "Candidate: Kunche Naga Varun Sandeep | Category: GEN-EWS | State: Andhra Pradesh | DOB: 17-09-2007",
    duration: 10,
  },
  jeeAdvanced: {
    text: "JEE Advanced Qualified! All medical requirements met - eligible for all engineering programs.",
    duration: 10,
  },
  ranks: {
    text: "JEE Main: 15,540 | JEE Advanced: 8,541 | EWS Rank: 1,004 - Opens doors to top IITs!",
    duration: 10,
  },
  locking: {
    text: "41 choices System Locked on June 9, 2025. Choices are final and tamper-proof.",
    duration: 10,
  },
  declaration: {
    text: "Declaration acknowledged. Candidate agrees to all JoSAA 2025 rules.",
    duration: 10,
  },
  outro: {
    text: "Summary: EWS Rank 1,004 with 41 strategic choices. Thank you for watching!",
    duration: 10,
  },
  filledChoices: [
    "Top 3: IIT Bombay CSE, IIT Bombay EE, IIT Kharagpur CSE - Dream choices!",
    "IIT Hyderabad: CSE, AI, Math & Computing - Modern campus, great placements.",
    "IIT Kanpur: CSE, EE, Statistics - Strong academics and research.",
    "IIT Bhubaneswar & IIT Madras CSE - Mix of newer and established IITs.",
    "IIT ISM Dhanbad: Math & Computing, CSE - Quality education.",
    "IIT ISM Dhanbad ECE, IIT Patna CSE & ECE - Solid programs.",
    "Electrical Engineering at IIT Hyderabad, ISM Dhanbad, Patna.",
    "Chemical Engineering at IIT Kharagpur, Hyderabad, Guwahati.",
    "Civil Engineering at IIT Madras and Kharagpur.",
    "IIT Palakkad CSE, NIT Calicut ECE - IIT and NIT mix.",
    "NITs: Karnataka, Raipur, MANIT Bhopal - Great backups.",
    "SGSITS Indore, NIT Karnataka AI, NIT Patna CSE.",
    "IIT Jodhpur CSE, IIT Delhi Dual Degree, IIT Mandi AI.",
    "Final: IIT Jodhpur AI, IIT Goa Math & Computing. Smart strategy!",
  ],
};

// Helper to get narration for filled choices subsection
export const getFilledChoicesNarration = (subsectionIndex: number): string => {
  return narrationScripts.filledChoices[subsectionIndex] ||
    `Choices ${subsectionIndex * 3 + 1} to ${Math.min(subsectionIndex * 3 + 3, 41)}`;
};
