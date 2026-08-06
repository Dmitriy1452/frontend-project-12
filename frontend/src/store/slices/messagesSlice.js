import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { messagesAPI } from '../../api';

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

export const createMessage = createAsyncThunk(
  'messages/create',
  async (messageData, { rejectWithValue }) => {
    try {
      const response = await messagesAPI.create(messageData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Ошибка создания сообщения');
    }
  }
);

export const updateMessage = createAsyncThunk(
  'messages/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await messagesAPI.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Ошибка обновления сообщения');
    }
  }
);

export const deleteMessage = createAsyncThunk(
  'messages/delete',
  async (id, { rejectWithValue }) => {
    try {
      await messagesAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Ошибка удаления сообщения');
    }
  }
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.items = [];
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
      .addCase(createMessage.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateMessage.fulfilled, (state, action) => {
        const index = state.items.findIndex(msg => msg.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.items = state.items.filter(msg => msg.id !== action.payload);
      });
  },
});

export const { clearMessages } = messagesSlice.actions;
export default messagesSlice.reducer;