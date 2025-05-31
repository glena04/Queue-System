// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../store/slices/authSlice';
import queueReducer from '../../store/slices/queueSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    queue: queueReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;