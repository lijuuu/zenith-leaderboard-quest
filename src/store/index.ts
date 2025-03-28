
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import leaderboardReducer from './slices/leaderboardSlice';
import compilerReducer from './slices/compilerSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    leaderboard: leaderboardReducer,
    xCodeCompiler: compilerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
