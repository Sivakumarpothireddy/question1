import { AbsoluteFill, Sequence } from "remotion";
import { IntroSection } from "./components/IntroSection";
import { CandidateDetailsSection } from "./components/CandidateDetailsSection";
import { JEEAdvancedSection } from "./components/JEEAdvancedSection";
import { RanksSection } from "./components/RanksSection";
import { LockingSection } from "./components/LockingSection";
import { FilledChoicesSection } from "./components/FilledChoicesSection";
import { DeclarationSection } from "./components/DeclarationSection";
import { OutroSection } from "./components/OutroSection";

// Frame timings for each section (at 60fps)
const SECTION_TIMINGS = {
  intro: { start: 0, duration: 180 }, // 3 seconds
  candidateDetails: { start: 180, duration: 300 }, // 5 seconds
  jeeAdvanced: { start: 480, duration: 240 }, // 4 seconds
  ranks: { start: 720, duration: 270 }, // 4.5 seconds
  locking: { start: 990, duration: 240 }, // 4 seconds
  filledChoices: { start: 1230, duration: 450 }, // 7.5 seconds
  declaration: { start: 1680, duration: 180 }, // 3 seconds
  outro: { start: 1860, duration: 180 }, // 3 seconds - Total: 34 seconds
};

export const JoSAAExplainer: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#ffffff" }}>
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

      {/* Filled Choices Section */}
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
