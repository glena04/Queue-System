import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Define the User interface
export interface User {
  id: number;
  email: string;
  name?: string;
  role?: string;
  // Add other user properties as needed
}

// Define the auth state interface
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
}

export const loginAsync = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, thunkAPI) => {
    try {
      // Use configured api instance instead of axios directly
      const response = await api.post('/api/auth/login', { email, password });
      // Store token in localStorage for API authentication
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        console.log('Token stored in localStorage');
      }
      return response.data; // Return the complete response (user and token)
    } catch (error: any) {
      console.error('Login error:', error);
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: { 
    user: null, 
    isAuthenticated: false, 
    error: null 
  } as AuthState,
  reducers: {
    logout: (state) => {
      // Also remove token from localStorage on logout
      localStorage.removeItem('token');
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;