export type WeatherMode = 'clear' | 'rain';
export type MoodMode = 'sleep' | 'jazzy' | 'chill';

export interface BackgroundNoisePreset {
  cityTraffic: number;
  cityRain: number;
  fireplace: number;
  snow: number;
  summerStorm: number;
  fan: number;
  forestNight: number;
  wave: number;
  wind: number;
  people: number;
  river: number;
  rainForest: number;
}

export interface NoiseVolumeOffset {
  cityTraffic: number;
  cityRain: number;
  fireplace: number;
  snow: number;
  summerStorm: number;
  fan: number;
  forestNight: number;
  wave: number;
  wind: number;
  people: number;
  river: number;
  rainForest: number;
}

export interface AudioFileNameMap {
  cityTraffic: string;
  cityRain: string;
  fireplace: string;
  snow: string;
  summerStorm: string;
  fan: string;
  forestNight: string;
  wave: string;
  wind: string;
  people: string;
  river: string;
  rainForest: string;
}

export interface RainyBackgroundConfig {
  noiseTypes: (keyof BackgroundNoisePreset)[];
  threshold: number;
}

export const AUDIO_FILE_NAME_MAP: AudioFileNameMap = {
  cityTraffic: 'city_traffic',
  cityRain: 'rain_city',
  fireplace: 'fireplace',
  snow: 'snow',
  summerStorm: 'summer_storm',
  fan: 'fan',
  forestNight: 'forest_night',
  wave: 'waves',
  wind: 'wind',
  people: 'people_talk_inside',
  river: 'river',
  rainForest: 'rain_forest',
};

export const NOISE_VOLUME_OFFSETS: NoiseVolumeOffset = {
  cityTraffic: 1.0,
  cityRain: 1.0,
  fireplace: 1.2,
  snow: 0.8,
  summerStorm: 1.1,
  fan: 1.3,
  forestNight: 0.9,
  wave: 1.0,
  wind: 0.9,
  people: 0.8,
  river: 1.0,
  rainForest: 1.0,
};

export const RAINY_BACKGROUND_CONFIG: RainyBackgroundConfig = {
  noiseTypes: ['cityRain', 'summerStorm', 'rainForest'],
  threshold: 30,
};

export const MOOD_NOISE_PRESETS: Record<MoodMode, BackgroundNoisePreset> = {
  sleep: {
    cityTraffic: 0,
    cityRain: 0,
    fireplace: 0,
    snow: 0,
    summerStorm: 0,
    fan: 30,
    forestNight: 20,
    wave: 0,
    wind: 0,
    people: 0,
    river: 0,
    rainForest: 0,
  },
  jazzy: {
    cityTraffic: 20,
    cityRain: 0,
    fireplace: 0,
    snow: 0,
    summerStorm: 0,
    fan: 0,
    forestNight: 0,
    wave: 0,
    wind: 0,
    people: 10,
    river: 0,
    rainForest: 0,
  },
  chill: {
    cityTraffic: 0,
    cityRain: 0,
    fireplace: 25,
    snow: 0,
    summerStorm: 0,
    fan: 0,
    forestNight: 0,
    wave: 15,
    wind: 0,
    people: 0,
    river: 10,
    rainForest: 0,
  },
};

export const WEATHER_NOISE_PRESETS: Record<WeatherMode, BackgroundNoisePreset> = {
  clear: {
    cityTraffic: 0,
    cityRain: 0,
    fireplace: 0,
    snow: 0,
    summerStorm: 0,
    fan: 0,
    forestNight: 0,
    wave: 0,
    wind: 0,
    people: 0,
    river: 0,
    rainForest: 0,
  },
  rain: {
    cityTraffic: 0,
    cityRain: 40,
    fireplace: 0,
    snow: 0,
    summerStorm: 0,
    fan: 0,
    forestNight: 0,
    wave: 0,
    wind: 10,
    people: 0,
    river: 0,
    rainForest: 20,
  },
};
