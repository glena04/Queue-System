import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the type for a ticket
interface Ticket {
  id: number;
  name: string;
}

// Define the initial state type
interface QueueState {
  tickets: Ticket[];
}

// Initial state
const initialState: QueueState = {
  tickets: [],
};

const queueSlice = createSlice({
  name: 'queue',
  initialState,
  reducers: {
    generateTicket: (state, action: PayloadAction<{ name: string }>) => {
      const newTicket: Ticket = {
        id: Date.now(),
        name: action.payload.name,
      };
      state.tickets.push(newTicket);
    },
    removeTicket: (state, action: PayloadAction<number>) => {
      state.tickets = state.tickets.filter((ticket) => ticket.id !== action.payload);
    },
  },
});

export const { generateTicket, removeTicket } = queueSlice.actions;
export default queueSlice.reducer;