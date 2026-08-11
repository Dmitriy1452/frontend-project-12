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
      const message = error.response?.data?.message 
        || error.response?.data 
        || error.message 
        || 'Ошибка загрузки сообщений';
      return rejectWithValue(typeof message === 'string' ? message : 'Ошибка загрузки сообщений');
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
      const message = error.response?.data?.message 
        || error.response?.data 
        || error.message 
        || 'Ошибка отправки сообщения';
      return rejectWithValue(typeof message === 'string' ? message : 'Ошибка отправки сообщения');
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
    removeMessagesByChannel: (state, action) => {
      state.items = state.items.filter(msg => msg.channelId !== action.payload);
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
        state.error = action.payload || 'Ошибка загрузки сообщений';
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
        state.error = action.payload || 'Ошибка отправки сообщения';
      });
  },
});

export const { addMessage, clearMessages, removeMessagesByChannel, setError } = messagesSlice.actions;
export default messagesSlice.reducer;