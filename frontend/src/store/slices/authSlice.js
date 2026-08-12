import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../api';

const extractErrorMessage = (error, defaultMessage) => {
  if (!error) return defaultMessage;
  
  if (error.response) {
    const { status, data } = error.response;
    
    if (status === 401) {
      return 'Неверные имя пользователя или пароль';
    }
    
    if (status === 409) {
      return 'Такой пользователь уже существует';
    }
    
    if (data) {
      if (typeof data === 'string') return data;
      if (data.message) return data.message;
      if (data.error) return data.error;
    }
    
    return defaultMessage;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return defaultMessage;
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, 'Ошибка авторизации'));
    }
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.signup(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, 'Ошибка регистрации'));
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async () => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    return { token, username };
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
    isRegistering: false,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.username = null;
      state.isAuthenticated = false;
      state.error = null;
      state.isLoading = false;
      state.isRegistering = false;
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
      .addCase(signup.pending, (state) => {
        state.isRegistering = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isRegistering = false;
        state.token = action.payload.token;
        state.username = action.payload.username;
        state.isAuthenticated = true;
        state.error = null;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('username', action.payload.username);
      })
      .addCase(signup.rejected, (state, action) => {
        state.isRegistering = false;
        state.error = action.payload || 'Ошибка регистрации';
        state.isAuthenticated = false;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isAuthenticated = !!action.payload.token;
        state.token = action.payload.token;
        state.username = action.payload.username;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;