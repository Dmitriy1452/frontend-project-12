import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { messagesAPI } from '../../api';
import { getSocket } from '../../socket/socket';

export const fetchMessages = createAsyncThunk(
  'messages/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await messagesAPI.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Ошибка загрузки сообщений');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'messages/send',
  async (messageData, { rejectWithValue }) => {
    try {
      const response = await messagesAPI.create(messageData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Ошибка отправки сообщения');
    }
  }
);

const initialState = {
  items: [],
  isLoading: false,
  error: null,
  sendingMessage: false,
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      const exists = state.items.some(msg => msg.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    clearMessages: (state) => {
      state.items = [];
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(sendMessage.pending, (state) => {
        state.sendingMessage = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sendingMessage = false;
        const exists = state.items.some(msg => msg.id === action.payload.id);
        if (!exists) {
          state.items.push(action.payload);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sendingMessage = false;
        state.error = action.payload;
      });
  },
});

export const { addMessage, clearMessages, setError } = messagesSlice.actions;
export default messagesSlice.reducer;