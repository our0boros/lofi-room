import rainReducer from './slice/rainSlice';
import moodReducer from './slice/moodSlice';
import modeReducer from './slice/modeSlice';
import changgeVolumeReducer from './slice/changeVolumeSlice';
import environmentReducer from './slice/environmentSlice';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export type RootState = ReturnType<typeof rootReducer>;

export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


const rootReducer = combineReducers({
    rain: rainReducer,
    mood: moodReducer,
    mode: modeReducer,
    volume: changgeVolumeReducer,
    environment: environmentReducer,
});

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),
});

export default store;
