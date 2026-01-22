/**
 * Audio Generation Script for JoSAA Explainer Video
 *
 * This script helps generate audio files using free TTS services.
 *
 * OPTION 1: Use online TTS (Easiest)
 * ==================================
 * 1. Go to https://ttsmp3.com/ or https://www.naturalreaders.com/online/
 * 2. Copy each narration text from below
 * 3. Generate and download MP3
 * 4. Save to public/audio/ folder with the specified filename
 *
 * OPTION 2: Use ElevenLabs API (Best Quality)
 * ==========================================
 * 1. Sign up at https://elevenlabs.io (free tier available)
 * 2. Get your API key
 * 3. Run: ELEVENLABS_API_KEY=your_key node scripts/generate-audio.js
 */

const fs = require('fs');
const path = require('path');

// All narration texts for easy copying
const narrations = {
  'intro.mp3': `Welcome to this explainer video for the Joint Seat Allocation Authority, or JoSAA 2025.
This document shows the registration and locked choices for seat allotment at India's premier engineering institutions -
the IITs, NITs, IIITs, and other Government Funded Technical Institutions for the academic year 2025-26.
Let's go through each section to understand what this document contains.`,

  'candidate-details.mp3': `This section contains the candidate's personal details.
We can see the candidate's name is Kunche Naga Varun Sandeep from Andhra Pradesh.
The JEE Main application number is their unique identifier throughout the admission process.
Notice the category is GEN-EWS, which means General category with Economically Weaker Section status -
this provides additional reservation benefits during seat allocation.
The candidate is male, born on September 17, 2007, and is an Indian national who passed Class 12 within India.`,

  'jee-advanced.mp3': `Now let's look at the JEE Advanced details section.
This candidate has a JEE Advanced roll number and registration number, which means they qualified for JEE Advanced.
The DS Status shows NO, meaning they're not eligible for Defense Services quota.
AAT Passed is NO, indicating they didn't take the Architecture Aptitude Test.
Both Colour Blindness and One Eyed Vision are marked NO, meaning they meet medical requirements for all engineering programs.`,

  'ranks.mp3': `Here's the crucial Ranks section.
The candidate secured JEE Main rank of 15,540 and a better JEE Advanced rank of 8,541.
More importantly, in the GEN-EWS category, they have rank 2,040 in JEE Main and an excellent rank of 1,004 in JEE Advanced.
This EWS rank of 1,004 is particularly significant as it opens up reserved seats at top IITs.
The dashes in B.Arch and B.Planning columns indicate the candidate didn't appear for those papers.`,

  'locking.mp3': `The Locking of Choices section shows that 41 choices have been filled and the status is System Locked.
This means the choices were automatically locked by the system after the deadline.
The last save was on June 9, 2025 at 8:02 AM IST.
The locking code is a unique cryptographic hash that ensures the integrity of the locked choices -
this prevents any tampering after submission.`,

  'choices-1.mp3': `Let's explore the filled choices, starting with the top 3 preferences.
Choice 1 is IIT Bombay Computer Science - the most coveted seat in Indian engineering.
Choice 2 is IIT Bombay Electrical Engineering, another excellent program.
Choice 3 is IIT Kharagpur Computer Science. These top choices show the candidate's aspiration for premier CSE programs.`,

  'choices-2.mp3': `Choices 4 to 6 focus on IIT Hyderabad.
Computer Science, Artificial Intelligence, and Mathematics and Computing are all listed here.
IIT Hyderabad has emerged as a top choice with its modern curriculum and excellent placements,
especially in AI and tech-related fields.`,

  'choices-3.mp3': `Now we see IIT Kanpur choices - Computer Science at 7, Electrical Engineering at 8,
and an interesting choice of Statistics and Data Science at 9.
IIT Kanpur is renowned for its strong academic culture and research output.`,

  'choices-4.mp3': `Choices 10 and 11 are IIT Bhubaneswar's CSE and Mathematics programs.
Choice 12 is IIT Madras Computer Science - one of the most prestigious programs in India.
This mix shows a strategic approach to choice filling.`,

  'choices-5.mp3': `IIT Madras AI and Data Analytics at 13 is a newer but highly sought program.
Choices 14 and 15 are IIT ISM Dhanbad's Mathematics and Computing and CSE programs.
ISM Dhanbad offers quality education with growing placement records.`,

  'choices-6.mp3': `Choice 16 is Electronics at IIT ISM Dhanbad.
Choices 17 and 18 are IIT Patna's CSE and Electronics programs.
IIT Patna, though newer, has shown impressive growth in placements and infrastructure.`,

  'choices-7.mp3': `We now see Electrical Engineering choices - IIT Hyderabad at 19, IIT ISM Dhanbad at 20,
and IIT Patna's Electrical and Electronics at 21.
Electrical Engineering remains a solid choice for those interested in power systems and electronics.`,

  'choices-8.mp3': `Choices 22 to 24 shift to Chemical Engineering at three different IITs -
Kharagpur, Hyderabad, and Guwahati.
Chemical Engineering offers opportunities in pharmaceuticals, petrochemicals, and process industries.`,

  'choices-9.mp3': `Choice 25 is Chemical Engineering at IIT ISM Dhanbad.
Choices 26 and 27 are Civil Engineering at IIT Madras and IIT Kharagpur.
Civil Engineering at these premier institutes leads to careers in infrastructure and construction.`,

  'choices-10.mp3': `Choice 28 is Mechanical Engineering at IIT ISM Dhanbad.
Choice 29 is a strategic addition - IIT Palakkad CSE, a newer IIT with growing reputation.
Choice 30 is NIT Calicut Electronics, showing the mix of IIT and NIT preferences.`,

  'choices-11.mp3': `Now we see more NIT choices. NIT Karnataka Surathkal's Electrical at 31,
NIT Raipur CSE at 32, and MANIT Bhopal CSE at 33.
These NITs offer excellent education and are good backup options.`,

  'choices-12.mp3': `Choice 34 is SGSITS Indore Electronics.
Choice 35 is NIT Karnataka's AI program - a modern addition.
Choice 36 is NIT Patna CSE. These choices ensure good coverage across institutions.`,

  'choices-13.mp3': `Choice 37 is IIT Jodhpur CSE.
Choice 38 is particularly interesting - IIT Delhi's 5-year Dual Degree in CSE,
which includes both B.Tech and M.Tech.
Choice 39 is IIT Mandi's Data Science and AI program.`,

  'choices-14.mp3': `Finally, choices 40 and 41. IIT Jodhpur's AI and Data Science at 40,
and IIT Goa's Mathematics and Computing at 41.
With 41 well-planned choices covering top IITs, NITs, and various branches,
this candidate has maximized their chances of getting a good seat based on their EWS rank of 1,004.`,

  'declaration.mp3': `The final section is the Declaration.
By submitting this form, the candidate acknowledges that they have read and understood
all the business rules of JoSAA 2025.
They agree to abide by all rules and the admission process as specified.
This declaration is legally binding and ensures the candidate's commitment to the admission process.`,

  'outro.mp3': `That concludes our walkthrough of this JoSAA 2025 document.
To summarize: Kunche Naga Varun Sandeep from Andhra Pradesh, with a JEE Advanced rank of 8,541
and an EWS rank of 1,004, has locked 41 choices across IITs, NITs, and other institutions.
The strategic mix of choices, from IIT Bombay CSE to newer IITs,
shows a well-thought-out preference list. Thank you for watching!`,
};

// Print instructions and narration texts
console.log('='.repeat(60));
console.log('JoSAA EXPLAINER VIDEO - AUDIO GENERATION');
console.log('='.repeat(60));
console.log('');
console.log('To generate audio, go to: https://ttsmp3.com/');
console.log('Select voice: "Matthew" or "Joanna" (US English)');
console.log('');
console.log('Copy each text below and save as the specified filename');
console.log('Save all files to: public/audio/');
console.log('');
console.log('='.repeat(60));

Object.entries(narrations).forEach(([filename, text]) => {
  console.log('');
  console.log(`FILE: ${filename}`);
  console.log('-'.repeat(40));
  console.log(text);
  console.log('');
});

// Create the audio directory if it doesn't exist
const audioDir = path.join(__dirname, '..', 'public', 'audio');
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

// Save narrations to a text file for easy copying
const outputPath = path.join(audioDir, 'narration-scripts.txt');
let content = 'NARRATION SCRIPTS FOR JOSAA EXPLAINER VIDEO\n';
content += '='.repeat(50) + '\n\n';
content += 'Instructions:\n';
content += '1. Go to https://ttsmp3.com/\n';
content += '2. Select "Matthew" or "Joanna" voice\n';
content += '3. Copy each section, generate MP3, download\n';
content += '4. Save with the filename shown\n\n';
content += '='.repeat(50) + '\n\n';

Object.entries(narrations).forEach(([filename, text]) => {
  content += `\nFILENAME: ${filename}\n`;
  content += '-'.repeat(40) + '\n';
  content += text + '\n';
});

fs.writeFileSync(outputPath, content);
console.log(`\nNarration scripts saved to: ${outputPath}`);
console.log('');
console.log('Once you have the audio files, the video will play them automatically!');
