import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Define the service interface
export interface Service {
  id: number;
  name: string;
  description: string;
  averageServiceTime?: number; // in minutes
}

interface ServicesState {
  services: Service[];
  loading: boolean;
  error: string | null;
}

const initialState: ServicesState = {
  services: [],
  loading: false,
  error: null,
};

// Async thunks for API interactions
export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/services');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch services');
    }
  }
);

export const addService = createAsyncThunk(
  'services/addService',
  async (serviceData: { name: string; description: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/services', serviceData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add service');
    }
  }
);

export const deleteService = createAsyncThunk(
  'services/deleteService',
  async (serviceId: number, { rejectWithValue }) => {
    try {
      await api.delete(`/api/services/${serviceId}`);
      return serviceId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete service');
    }
  }
);

export const updateService = createAsyncThunk(
  'services/updateService',
  async (
    { serviceId, data }: { serviceId: number; data: Partial<Service> },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(`/api/services/${serviceId}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update service');
    }
  }
);

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    updateAverageServiceTime: (
      state,
      action: PayloadAction<{ serviceId: number; time: number }>
    ) => {
      const { serviceId, time } = action.payload;
      const service = state.services.find((s) => s.id === serviceId);
      if (service) {
        service.averageServiceTime = time;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch services
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add service
      .addCase(addService.fulfilled, (state, action) => {
        state.services.push(action.payload);
      })
      // Delete service
      .addCase(deleteService.fulfilled, (state, action) => {
        state.services = state.services.filter((service) => service.id !== action.payload);
      })
      // Update service
      .addCase(updateService.fulfilled, (state, action) => {
        const index = state.services.findIndex((service) => service.id === action.payload.id);
        if (index !== -1) {
          state.services[index] = action.payload;
        }
      });
  },
});

export const { updateAverageServiceTime } = servicesSlice.actions;
export default servicesSlice.reducer;