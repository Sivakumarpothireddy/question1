import { Composition } from "remotion";
import { JoSAAExplainer } from "./JoSAAExplainer";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="JoSAAExplainer"
        component={JoSAAExplainer}
        durationInFrames={12600} // 210 seconds (3.5 minutes) at 60fps
        fps={60}
        width={1920}
        height={1080}
      />
    </>
  );
};
