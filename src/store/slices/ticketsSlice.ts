import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Define the ticket interface
export interface Ticket {
  id: number;
  ticketNumber: string;
  serviceId: number;
  status: 'pending' | 'waiting' | 'serving' | 'served' | 'no-show';
  customerName: string;
  userId?: number | null; // User who created the ticket
  counterId?: number | null;
  createdAt: string;
  updatedAt: string;
  scannedAt?: string | null; // When customer arrives and activates the ticket
  servedAt?: string | null; // When customer is being served
  completedAt?: string | null; // When service is completed
}

interface TicketsState {
  tickets: Ticket[];
  currentTicket: Ticket | null;
  loading: boolean;
  error: string | null;
}

const initialState: TicketsState = {
  tickets: [],
  currentTicket: null,
  loading: false,
  error: null,
};

// Async thunks for API interactions
export const fetchTickets = createAsyncThunk(
  'tickets/fetchTickets',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/tickets');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tickets');
    }
  }
);

// Fetch only tickets for the authenticated user
export const fetchUserTickets = createAsyncThunk(
  'tickets/fetchUserTickets',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/tickets/user');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user tickets');
    }
  }
);

export const createTicket = createAsyncThunk(
  'tickets/createTicket',
  async (
    ticketData: { serviceId: number; customerName: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post('/api/tickets', ticketData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating ticket:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to create ticket');
    }
  }
);

export const activateTicket = createAsyncThunk(
  'tickets/activateTicket',
  async (ticketId: number, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/tickets/${ticketId}/activate`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to activate ticket');
    }
  }
);

export const callNextTicket = createAsyncThunk(
  'tickets/callNextTicket',
  async (
    { counterId, serviceId }: { counterId: number; serviceId: number },
    { rejectWithValue }
  ) => {
    try {
      console.log('counterId and serviceId', counterId, serviceId);
      const response = await api.post('/api/tickets/next', { counterId, serviceId });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to call next ticket');
    }
  }
);

export const completeTicket = createAsyncThunk(
  'tickets/completeTicket',
  async (ticketId: number, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/tickets/${ticketId}/complete`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to complete ticket');
    }
  }
);

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    setCurrentTicket: (state, action: PayloadAction<Ticket | null>) => {
      state.currentTicket = action.payload;
    },
    updateTicketStatus: (
      state,
      action: PayloadAction<{ ticketId: number; status: Ticket['status'] }>
    ) => {
      const { ticketId, status } = action.payload;
      const ticket = state.tickets.find((t) => t.id === ticketId);
      if (ticket) {
        ticket.status = status;
        ticket.updatedAt = new Date().toISOString();
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all tickets
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch user tickets
      .addCase(fetchUserTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload;
      })
      .addCase(fetchUserTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create ticket
      .addCase(createTicket.fulfilled, (state, action) => {
        state.tickets.push(action.payload);
      })
      // Activate ticket
      .addCase(activateTicket.fulfilled, (state, action) => {
        const index = state.tickets.findIndex((ticket) => ticket.id === action.payload.id);
        if (index !== -1) {
          state.tickets[index] = action.payload;
        }
      })
      // Call next ticket
      .addCase(callNextTicket.fulfilled, (state, action) => {
        state.currentTicket = action.payload;
        const index = state.tickets.findIndex((ticket) => ticket.id === action.payload.id);
        if (index !== -1) {
          state.tickets[index] = action.payload;
        }
      })
      // Complete ticket
      .addCase(completeTicket.fulfilled, (state, action) => {
        const index = state.tickets.findIndex((ticket) => ticket.id === action.payload.id);
        if (index !== -1) {
          state.tickets[index] = action.payload;
        }
        if (state.currentTicket?.id === action.payload.id) {
          state.currentTicket = null;
        }
      });
  },
});

export const { setCurrentTicket, updateTicketStatus } = ticketsSlice.actions;
export default ticketsSlice.reducer;