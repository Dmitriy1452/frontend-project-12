import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../api';

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Ошибка авторизации');
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async () => {
    const token = localStorage.getItem('token');
    return token;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token') || null,
    username: localStorage.getItem('username') || null,
    isLoading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem('token'),
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.username = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('username');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.username = action.payload.username;
        state.isAuthenticated = true;
        state.error = null;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('username', action.payload.username);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Ошибка авторизации';
        state.isAuthenticated = false;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isAuthenticated = !!action.payload;
        state.token = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;