import { configureStore } from '@reduxjs/toolkit';
import ticketsReducer from './slices/ticketsSlice';
import servicesReducer from './slices/servicesSlice';
import authReducer from './slices/authSlice';
import queueReducer from './slices/queueSlice'; // Import the queueSlice
import countersReducer from './slices/countersSlice'; // Import the countersSlice

const store = configureStore({
  reducer: {
    tickets: ticketsReducer,
    services: servicesReducer,
    auth: authReducer,
    queue: queueReducer, // Add the queue slice here
    counters: countersReducer, // Add the counters slice here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;