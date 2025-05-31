import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Define the counter interface
export interface Counter {
  id: number;
  name: string;
  currentTicket?: string | null;
  serviceId?: number | null;
  isActive?: boolean;
}

interface CountersState {
  counters: Counter[];
  loading: boolean;
  error: string | null;
}

const initialState: CountersState = {
  counters: [],
  loading: false,
  error: null,
};

// Async thunks for API interactions
export const fetchCounters = createAsyncThunk(
  'counters/fetchCounters',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/counters');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch counters');
    }
  }
);

export const addCounter = createAsyncThunk(
  'counters/addCounter',
  async (counterData: { name: string, serviceId?: number }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/counters', counterData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add counter');
    }
  }
);

export const deleteCounter = createAsyncThunk(
  'counters/deleteCounter',
  async (counterId: number, { rejectWithValue }) => {
    try {
      await api.delete(`/api/counters/${counterId}`);
      return counterId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete counter');
    }
  }
);

export const updateCounter = createAsyncThunk(
  'counters/updateCounter',
  async (
    { counterId, data }: { counterId: number; data: Partial<Counter> },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(`/api/counters/${counterId}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update counter');
    }
  }
);

export const assignServiceToCounter = createAsyncThunk(
  'counters/assignService',
  async (
    { counterId, serviceId }: { counterId: number; serviceId: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(`/api/counters/${counterId}/assign-service`, {
        serviceId,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to assign service to counter'
      );
    }
  }
);

const countersSlice = createSlice({
  name: 'counters',
  initialState,
  reducers: {
    setCurrentTicket: (
      state,
      action: PayloadAction<{ counterId: number; ticketNumber: string | null }>
    ) => {
      const { counterId, ticketNumber } = action.payload;
      const counter = state.counters.find((c) => c.id === counterId);
      if (counter) {
        counter.currentTicket = ticketNumber;
      }
    },
    toggleCounterActive: (state, action: PayloadAction<number>) => {
      const counter = state.counters.find((c) => c.id === action.payload);
      if (counter) {
        counter.isActive = !counter.isActive;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch counters
      .addCase(fetchCounters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCounters.fulfilled, (state, action) => {
        state.loading = false;
        state.counters = action.payload;
      })
      .addCase(fetchCounters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add counter
      .addCase(addCounter.fulfilled, (state, action) => {
        state.counters.push(action.payload);
      })
      // Delete counter
      .addCase(deleteCounter.fulfilled, (state, action) => {
        state.counters = state.counters.filter((counter) => counter.id !== action.payload);
      })
      // Update counter
      .addCase(updateCounter.fulfilled, (state, action) => {
        const index = state.counters.findIndex((counter) => counter.id === action.payload.id);
        if (index !== -1) {
          state.counters[index] = action.payload;
        }
      })
      // Assign service to counter
      .addCase(assignServiceToCounter.fulfilled, (state, action) => {
        const index = state.counters.findIndex((counter) => counter.id === action.payload.id);
        if (index !== -1) {
          state.counters[index] = action.payload;
        }
      });
  },
});

export const { setCurrentTicket, toggleCounterActive } = countersSlice.actions;
export default countersSlice.reducer;
