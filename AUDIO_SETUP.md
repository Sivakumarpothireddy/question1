# Audio Narration Setup Guide

This guide explains how to generate and add audio narration to your JoSAA Explainer video.

## Option 1: Using ElevenLabs (Recommended)

ElevenLabs provides high-quality AI voices with natural intonation.

1. Sign up at [elevenlabs.io](https://elevenlabs.io)
2. Go to the "Speech Synthesis" section
3. Select a voice (recommended: "Adam" or "Rachel" for professional narration)
4. Copy each narration script from `src/narration.ts`
5. Generate and download MP3 files
6. Place files in `public/audio/` folder

## Option 2: Using Google Cloud Text-to-Speech

```bash
# Install Google Cloud TTS
npm install @google-cloud/text-to-speech

# Run the generation script (create this script)
node scripts/generate-audio.js
```

## Option 3: Using Amazon Polly

1. Set up AWS credentials
2. Use the AWS Polly console or SDK
3. Select "Neural" voice for best quality (recommended: "Matthew" or "Joanna")

## Option 4: Using Microsoft Azure TTS

1. Create an Azure Speech Services resource
2. Use the Speech Studio or SDK
3. Select a neural voice

## Audio File Structure

Place your generated audio files in the `public/audio/` folder:

```
public/
  audio/
    intro.mp3
    candidate-details.mp3
    jee-advanced.mp3
    ranks.mp3
    locking.mp3
    choices-1.mp3
    choices-2.mp3
    choices-3.mp3
    ... (up to choices-14.mp3)
    declaration.mp3
    outro.mp3
```

## Narration Scripts

All narration scripts are available in `src/narration.ts`. Here's a summary:

| Section | Duration | Script Location |
|---------|----------|-----------------|
| Intro | 10s | `narrationScripts.intro.text` |
| Candidate Details | 10s | `narrationScripts.candidateDetails.text` |
| JEE Advanced | 10s | `narrationScripts.jeeAdvanced.text` |
| Ranks | 10s | `narrationScripts.ranks.text` |
| Locking | 10s | `narrationScripts.locking.text` |
| Choices 1-14 | 10s each | `narrationScripts.filledChoices[0-13]` |
| Declaration | 10s | `narrationScripts.declaration.text` |
| Outro | 10s | `narrationScripts.outro.text` |

## Tips for Best Results

1. **Voice Selection**: Choose a clear, professional voice
2. **Speed**: Set speaking rate to around 1.0x for clarity
3. **Format**: Export as MP3 (128kbps or higher)
4. **Length**: Ensure each audio file is close to 10 seconds (adjust TTS speed if needed)
5. **Consistency**: Use the same voice throughout for a cohesive experience

## Integration

Once audio files are in place, update the section components to use the AudioNarration component:

```tsx
import { AudioNarration } from "./AudioNarration";

// In your component's return:
<AudioNarration audioFile="audio/intro.mp3" />
```

## Quick Start with Free TTS

For quick testing, you can use free online TTS services:

1. [ttsreader.com](https://ttsreader.com)
2. [naturalreaders.com](https://naturalreaders.com)
3. [text-to-speech.online](https://text-to-speech.online)

Note: Free services may have quality limitations. For production, consider paid services like ElevenLabs or cloud TTS APIs.
