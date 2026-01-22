import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { IntroSection } from "./components/IntroSection";
import { CandidateDetailsSection } from "./components/CandidateDetailsSection";
import { JEEAdvancedSection } from "./components/JEEAdvancedSection";
import { RanksSection } from "./components/RanksSection";
import { LockingSection } from "./components/LockingSection";
import { FilledChoicesSection } from "./components/FilledChoicesSection";
import { DeclarationSection } from "./components/DeclarationSection";
import { OutroSection } from "./components/OutroSection";

// Frame timings for each section (at 60fps)
// 600 frames = 10 seconds per section
const SECTION_DURATION = 600; // 10 seconds at 60fps

// 41 choices / 3 per subsection = 14 subsections (13 with 3 choices, 1 with 2 choices)
const CHOICES_SUBSECTIONS = 14;
const CHOICES_TOTAL_DURATION = CHOICES_SUBSECTIONS * SECTION_DURATION; // 8400 frames = 140 seconds

const SECTION_TIMINGS = {
  intro: { start: 0, duration: SECTION_DURATION }, // 10 seconds
  candidateDetails: { start: 600, duration: SECTION_DURATION }, // 10 seconds
  jeeAdvanced: { start: 1200, duration: SECTION_DURATION }, // 10 seconds
  ranks: { start: 1800, duration: SECTION_DURATION }, // 10 seconds
  locking: { start: 2400, duration: SECTION_DURATION }, // 10 seconds
  filledChoices: { start: 3000, duration: CHOICES_TOTAL_DURATION }, // 140 seconds (14 x 10s subsections)
  declaration: { start: 11400, duration: SECTION_DURATION }, // 10 seconds
  outro: { start: 12000, duration: SECTION_DURATION }, // 10 seconds
  // Total: 12600 frames = 210 seconds = 3 minutes 30 seconds
};

export const JoSAAExplainer: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#ffffff" }}>
      {/* SINGLE AUDIO FILE - plays throughout entire video */}
      {/* Place your audio file at: public/audio/narration.mp3 */}
      <Audio src={staticFile("audio/narration.mp3")} volume={1} />

      {/* Intro Section */}
      <Sequence
        from={SECTION_TIMINGS.intro.start}
        durationInFrames={SECTION_TIMINGS.intro.duration}
      >
        <IntroSection />
      </Sequence>

      {/* Candidate Details Section */}
      <Sequence
        from={SECTION_TIMINGS.candidateDetails.start}
        durationInFrames={SECTION_TIMINGS.candidateDetails.duration}
      >
        <CandidateDetailsSection />
      </Sequence>

      {/* JEE Advanced Details Section */}
      <Sequence
        from={SECTION_TIMINGS.jeeAdvanced.start}
        durationInFrames={SECTION_TIMINGS.jeeAdvanced.duration}
      >
        <JEEAdvancedSection />
      </Sequence>

      {/* Ranks Section */}
      <Sequence
        from={SECTION_TIMINGS.ranks.start}
        durationInFrames={SECTION_TIMINGS.ranks.duration}
      >
        <RanksSection />
      </Sequence>

      {/* Locking of Choices Section */}
      <Sequence
        from={SECTION_TIMINGS.locking.start}
        durationInFrames={SECTION_TIMINGS.locking.duration}
      >
        <LockingSection />
      </Sequence>

      {/* Filled Choices Section - 14 subsections of 3 choices each */}
      <Sequence
        from={SECTION_TIMINGS.filledChoices.start}
        durationInFrames={SECTION_TIMINGS.filledChoices.duration}
      >
        <FilledChoicesSection />
      </Sequence>

      {/* Declaration Section */}
      <Sequence
        from={SECTION_TIMINGS.declaration.start}
        durationInFrames={SECTION_TIMINGS.declaration.duration}
      >
        <DeclarationSection />
      </Sequence>

      {/* Outro Section */}
      <Sequence
        from={SECTION_TIMINGS.outro.start}
        durationInFrames={SECTION_TIMINGS.outro.duration}
      >
        <OutroSection />
      </Sequence>
    </AbsoluteFill>
  );
};
