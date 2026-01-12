import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../store/store";

import "./styles.scss";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";
import { setMood, setBackgroundNoise, resetBackgroundNoise, getNoiseVolumeWithOffset } from "../../store/slice/environmentSlice";
import { AUDIO_FILE_NAME_MAP } from "../../config/audioConfig";

import ReactAudioPlayer from "react-audio-player";
import { changeVolume } from "../../store/slice/changeVolumeSlice";
import {
  MoodMode,
  IBackgroundNoise,
  IAudioSetting,
} from "../../types/interface";
import { RootState } from "../../store/store";

const ModifierBoard = () => {
  const dispatch = useAppDispatch();
  const environmentData = useAppSelector((state: RootState) => state.environment);
  const volumeData = useAppSelector((state: RootState) => state.volume);

  const { mood, backgroundNoise } = environmentData;
  const { volumeValue } = volumeData;

  const [openMood, setOpenMood] = useState<boolean>(false);

  const toggleMoodHandler = () => {
    setOpenMood(!openMood);
  };

  const changeMoodHandler = (mode: MoodMode) => {
    dispatch(setMood(mode));
  };

  const changeVolumeHandler = (value: number) => {
    dispatch(changeVolume(value));
  };

  const changeNoiseHandler = (type: keyof IBackgroundNoise, value: number) => {
    dispatch(setBackgroundNoise({ [type]: value }));
  };

  const resetNoiseHandler = () => {
    dispatch(resetBackgroundNoise());
  };

  const getAdjustedVolume = (baseVolume: number, noiseType: keyof IBackgroundNoise): number => {
    return getNoiseVolumeWithOffset(noiseType, baseVolume) / 100;
  };

  const getAudioFileName = (noiseType: keyof IBackgroundNoise): string => {
    return AUDIO_FILE_NAME_MAP[noiseType];
  };

  const audioSettings: IAudioSetting[] = [
    {
      src: `./assets/musics/${getAudioFileName('cityTraffic')}.mp3`,
      volume: getAdjustedVolume(backgroundNoise.cityTraffic, 'cityTraffic'),
    },
    {
      src: `./assets/musics/${getAudioFileName('cityRain')}.mp3`,
      volume: getAdjustedVolume(backgroundNoise.cityRain, 'cityRain'),
    },
    {
      src: `./assets/musics/${getAudioFileName('fireplace')}.mp3`,
      volume: getAdjustedVolume(backgroundNoise.fireplace, 'fireplace'),
    },
    {
      src: `./assets/musics/${getAudioFileName('snow')}.mp3`,
      volume: getAdjustedVolume(backgroundNoise.snow, 'snow'),
    },
    {
      src: `./assets/musics/${getAudioFileName('summerStorm')}.mp3`,
      volume: getAdjustedVolume(backgroundNoise.summerStorm, 'summerStorm'),
    },
    {
      src: `./assets/musics/${getAudioFileName('fan')}.mp3`,
      volume: getAdjustedVolume(backgroundNoise.fan, 'fan'),
    },
    {
      src: `./assets/musics/${getAudioFileName('forestNight')}.mp3`,
      volume: getAdjustedVolume(backgroundNoise.forestNight, 'forestNight'),
    },
    {
      src: `./assets/musics/${getAudioFileName('wave')}.mp3`,
      volume: getAdjustedVolume(backgroundNoise.wave, 'wave'),
    },
    {
      src: `./assets/musics/${getAudioFileName('wind')}.mp3`,
      volume: getAdjustedVolume(backgroundNoise.wind, 'wind'),
    },
    {
      src: `./assets/musics/${getAudioFileName('people')}.mp3`,
      volume: getAdjustedVolume(backgroundNoise.people, 'people'),
    },
    {
      src: `./assets/musics/${getAudioFileName('river')}.mp3`,
      volume: getAdjustedVolume(backgroundNoise.river, 'river'),
    },
    {
      src: `./assets/musics/${getAudioFileName('rainForest')}.mp3`,
      volume: getAdjustedVolume(backgroundNoise.rainForest, 'rainForest'),
    },
  ];

  return (
    <>
      {audioSettings.map(({ src, volume }) => (
        <ReactAudioPlayer
          key={src}
          preload="auto"
          autoPlay
          src={src}
          loop
          volume={volume}
        />
      ))}

      <div className={`modifier ${openMood ? "mood" : ""}`} onClick={toggleMoodHandler}>
        <div className="modifier__icon">
          <div className={`icon ${openMood ? "active" : ""}`}>
            <i className="fas fa-sliders-h fa-2x"></i>
          </div>
          {openMood && (
            <div className="modifierBox" onClick={(e) => e.stopPropagation()}>
              <h4>Mood</h4>
              <div className="options">
                {["sleep", "jazzy", "chill"].map((mode) => (
                  <div
                    key={mode}
                    id={mode}
                    onClick={() => changeMoodHandler(mode as MoodMode)}
                    className={`item ${mood === mode ? "active" : ""}`}
                  >
                    <i
                      id={mode}
                      className={`fas fa-${
                        mode === "sleep"
                          ? "moon"
                          : mode === "jazzy"
                          ? "guitar"
                          : "coffee"
                      } fa-2x`}
                    ></i>
                    <span id={mode}>
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="volume">
                <Stack
                  spacing={2}
                  direction="row"
                  sx={{ mb: 1 }}
                  alignItems="center"
                >
                  <i className="fas fa-volume-down fa-lg"></i>
                  <Slider
                    className="volume-slider"
                    value={volumeValue}
                    onChange={(e, value) =>
                      changeVolumeHandler(value as number)
                    }
                  />
                  <i className="fas fa-volume-up fa-lg"></i>
                </Stack>
              </div>
              <div className="reset-button">
                <button onClick={resetNoiseHandler}>Reset Noise</button>
              </div>
              <h5>Background Noise</h5>
              <div className="backgroundNoise">
                {Object.entries(backgroundNoise).map(([type, value]) => (
                  <div key={type} className="noise-option">
                    <p>
                      {type
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                    </p>
                    <Slider
                      className="slider"
                      value={value}
                      onChange={(e, newValue) =>
                        changeNoiseHandler(
                          type as keyof IBackgroundNoise,
                          newValue as number
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ModifierBoard;
