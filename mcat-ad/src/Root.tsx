import { Composition } from "remotion";
import { McatAd } from "./McatAd";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="McatAd"
        component={McatAd}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1080}
      />
    </>
  );
};
