import { Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

interface AudioNarrationProps {
  audioFile: string;
  startFrom?: number;
  volume?: number;
}

/**
 * AudioNarration component for playing narration audio.
 *
 * To use this component:
 * 1. Generate audio files using a TTS service (ElevenLabs, Google TTS, Amazon Polly, etc.)
 * 2. Place the audio files in the /public folder
 * 3. Import and use this component in your sections
 *
 * Example usage:
 * <AudioNarration audioFile="intro-narration.mp3" />
 */
export const AudioNarration: React.FC<AudioNarrationProps> = ({
  audioFile,
  startFrom = 0,
  volume = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Only render audio if the file exists
  // In production, you would have actual audio files
  try {
    return (
      <Audio
        src={staticFile(audioFile)}
        startFrom={startFrom}
        volume={volume}
      />
    );
  } catch {
    // Audio file not found - this is expected during development
    // The component will silently not render audio
    return null;
  }
};

/**
 * Audio timing configuration for each section.
 * Update these values once you have the actual audio files.
 */
export const audioConfig = {
  intro: {
    file: "audio/intro.mp3",
    duration: 10, // seconds
  },
  candidateDetails: {
    file: "audio/candidate-details.mp3",
    duration: 10,
  },
  jeeAdvanced: {
    file: "audio/jee-advanced.mp3",
    duration: 10,
  },
  ranks: {
    file: "audio/ranks.mp3",
    duration: 10,
  },
  locking: {
    file: "audio/locking.mp3",
    duration: 10,
  },
  filledChoices: {
    // Array of audio files for each subsection (14 total)
    files: Array.from({ length: 14 }, (_, i) => `audio/choices-${i + 1}.mp3`),
    durationPerSubsection: 10,
  },
  declaration: {
    file: "audio/declaration.mp3",
    duration: 10,
  },
  outro: {
    file: "audio/outro.mp3",
    duration: 10,
  },
};
