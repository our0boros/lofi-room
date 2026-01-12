import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  WeatherMode,
  MoodMode,
  BackgroundNoisePreset,
  MOOD_NOISE_PRESETS,
  WEATHER_NOISE_PRESETS,
  NOISE_VOLUME_OFFSETS,
  RAINY_BACKGROUND_CONFIG,
} from '../../config/audioConfig';

export interface IEnvironmentState {
  mode: 'day' | 'night';
  weather: WeatherMode;
  mood: MoodMode;
  backgroundNoise: BackgroundNoisePreset;
}

const initialState: IEnvironmentState = {
  mode: 'day',
  weather: 'clear',
  mood: 'chill',
  backgroundNoise: MOOD_NOISE_PRESETS.chill,
};

const environmentSlice = createSlice({
  name: 'environment',
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<'day' | 'night'>) => {
      state.mode = action.payload;
    },
    toggleDayNight: (state) => {
      state.mode = state.mode === 'day' ? 'night' : 'day';
    },
    setWeather: (state, action: PayloadAction<WeatherMode>) => {
      state.weather = action.payload;
      state.backgroundNoise = WEATHER_NOISE_PRESETS[action.payload];
    },
    toggleWeather: (state) => {
      const newWeather = state.weather === 'clear' ? 'rain' : 'clear';
      state.weather = newWeather;
      state.backgroundNoise = WEATHER_NOISE_PRESETS[newWeather];
    },
    setMood: (state, action: PayloadAction<MoodMode>) => {
      state.mood = action.payload;
      state.backgroundNoise = MOOD_NOISE_PRESETS[action.payload];
    },
    setBackgroundNoise: (state, action: PayloadAction<Partial<BackgroundNoisePreset>>) => {
      state.backgroundNoise = { ...state.backgroundNoise, ...action.payload };
    },
    resetBackgroundNoise: (state) => {
      state.backgroundNoise = MOOD_NOISE_PRESETS[state.mood];
    },
  },
});

export const {
  setMode,
  toggleDayNight,
  setWeather,
  toggleWeather,
  setMood,
  setBackgroundNoise,
  resetBackgroundNoise,
} = environmentSlice.actions;

export const getNoiseVolumeWithOffset = (
  noiseType: keyof BackgroundNoisePreset,
  baseVolume: number
): number => {
  const offset = NOISE_VOLUME_OFFSETS[noiseType];
  return Math.min(100, Math.max(0, baseVolume * offset));
};

export const shouldShowRainyBackground = (backgroundNoise: BackgroundNoisePreset): boolean => {
  const { noiseTypes, threshold } = RAINY_BACKGROUND_CONFIG;
  const rainRelatedVolume = noiseTypes.reduce((sum, type) => {
    return sum + backgroundNoise[type];
  }, 0);
  return rainRelatedVolume > threshold;
};

export default environmentSlice.reducer;