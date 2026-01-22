import { Composition } from "remotion";
import { JoSAAExplainer } from "./JoSAAExplainer";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="JoSAAExplainer"
        component={JoSAAExplainer}
        durationInFrames={2040} // 34 seconds at 60fps
        fps={60}
        width={1920}
        height={1080}
      />
    </>
  );
};
