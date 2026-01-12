import React from "react";

import "./styles.scss";
import ModifierBoard from "../../components/ModifierBoard";
import RainToggleButton from "../../components/RainToggleButton";

import Footer from "../../layout/Footer";
import { useAppSelector, RootState } from "../../store/store";
import { VideoSource } from "../../types/interface";
import { shouldShowRainyBackground } from "../../store/slice/environmentSlice";

const Home = () => {
  const environment = useAppSelector((state: RootState) => state.environment);

  const { mode, backgroundNoise } = environment;

  const isRainy = shouldShowRainyBackground(backgroundNoise);
  const combineMode = `${mode}-${isRainy ? 'rain' : 'clear'}`;

  const videoSources: VideoSource = {
    "night-clear": "/assets/video/Night-clear.mp4",
    "night-rain": "/assets/video/Night-rainny.mp4",
    "day-clear": "/assets/video/Day-sunny.mp4",
    "day-rain": "/assets/video/Day-rainny.mp4",
  };
  return (
    <>
      {/* Render video elements */}
      {Object.keys(videoSources).map((key) => (
        <video
          key={key}
          className={combineMode === key ? "videoIn" : "videoOut"}
          autoPlay
          loop
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        >
          <source src={videoSources[key]} type="video/mp4" />
        </video>
      ))}
      <RainToggleButton />
      <ModifierBoard />
      <Footer />
    </>
  );
};

export default Home;
