import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../store/slices/authSlice';
import queueReducer from '../store/slices/queueSlice';
import countersReducer from '../store/slices/countersSlice';
import servicesReducer from '../store/slices/servicesSlice';
import ticketsReducer from '../store/slices/ticketsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    queue: queueReducer,
    counters: countersReducer,
    services: servicesReducer,
    tickets: ticketsReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;