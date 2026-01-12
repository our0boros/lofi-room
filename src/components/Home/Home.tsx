import React from "react";
import { useAppSelector, RootState } from "../../store/store";
import { shouldShowRainyBackground } from "../../store/slice/environmentSlice";
import ModifierBoard from "../ModifierBoard";
import RainToggleButton from "../RainToggleButton";
import Footer from "../../layout/Footer";

import "./Home.scss";

const Home = () => {
  const environment = useAppSelector((state: RootState) => state.environment);

  const { mode, backgroundNoise } = environment;

  const isRainy = shouldShowRainyBackground(backgroundNoise);
  const combineMode = `${mode}-${isRainy ? 'rain' : 'clear'}`;

  const renderVideo = (videoType: string, condition: boolean) => {
    return (
      <video
        className={combineMode === videoType ? "videoIn" : "videoOut"}
        autoPlay
        loop
        muted
      >
        <source src={`/assets/video/${videoType}.mp4`} type="video/mp4" />
      </video>
    );
  };

  return (
    <>
      {/* Night Videos */}
      {renderVideo("night-clear", combineMode === "night-clear")}
      {renderVideo("night-rain", combineMode === "night-rain")}
      {/* Day Videos */}
      {renderVideo("day-clear", combineMode === "day-clear")}
      {renderVideo("day-rain", combineMode === "day-rain")}

      <RainToggleButton />
      <ModifierBoard />
      <Footer />
    </>
  );
};

export default Home;
