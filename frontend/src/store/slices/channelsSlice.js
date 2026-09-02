import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { channelsAPI } from '../../api';

const extractErrorMessage = (error) => {
  if (!error) return 'Ошибка загрузки каналов';
  
  if (typeof error === 'string') return error;
  
  if (error.message) return error.message;
  
  if (error.data) {
    if (typeof error.data === 'string') return error.data;
    if (error.data.message) return error.data.message;
  }
  
  return 'Ошибка загрузки каналов';
};

export const fetchChannels = createAsyncThunk(
  'channels/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await channelsAPI.getAll();
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message 
        || error.response?.data 
        || error.message 
        || 'Ошибка загрузки каналов';
      return rejectWithValue(typeof message === 'string' ? message : 'Ошибка загрузки каналов');
    }
  }
);

export const createChannel = createAsyncThunk(
  'channels/create',
  async (channelData, { rejectWithValue }) => {
    try {
      const response = await channelsAPI.create(channelData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message 
        || error.response?.data 
        || error.message 
        || 'Ошибка создания канала';
      return rejectWithValue(typeof message === 'string' ? message : 'Ошибка создания канала');
    }
  }
);

export const updateChannel = createAsyncThunk(
  'channels/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await channelsAPI.update(id, data);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message 
        || error.response?.data 
        || error.message 
        || 'Ошибка обновления канала';
      return rejectWithValue(typeof message === 'string' ? message : 'Ошибка обновления канала');
    }
  }
);

export const deleteChannel = createAsyncThunk(
  'channels/delete',
  async (id, { rejectWithValue }) => {
    try {
      await channelsAPI.delete(id);
      return id;
    } catch (error) {
      const message = error.response?.data?.message 
        || error.response?.data 
        || error.message 
        || 'Ошибка удаления канала';
      return rejectWithValue(typeof message === 'string' ? message : 'Ошибка удаления канала');
    }
  }
);

const initialState = {
  items: [],
  currentChannelId: null,
  isLoading: false,
  error: null,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
};

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setCurrentChannel: (state, action) => {
      state.currentChannelId = action.payload;
    },
    clearChannels: (state) => {
      state.items = [];
      state.currentChannelId = null;
    },
    addChannel: (state, action) => {
      const exists = state.items.some(ch => ch.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
        if (!state.currentChannelId) {
          state.currentChannelId = action.payload.id;
        }
      }
    },
    removeChannel: (state, action) => {
      state.items = state.items.filter(ch => ch.id !== action.payload);
      if (state.currentChannelId === action.payload) {
        const defaultChannel = state.items.find(ch => ch.name === 'general') || state.items[0];
        state.currentChannelId = defaultChannel?.id || null;
      }
    },
    renameChannel: (state, action) => {
      const index = state.items.findIndex(ch => ch.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        if (!state.currentChannelId && state.items.length > 0) {
          state.currentChannelId = state.items[0].id;
        }
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Ошибка загрузки каналов';
      })
      .addCase(createChannel.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createChannel.fulfilled, (state, action) => {
        state.isCreating = false;
        const exists = state.items.some(ch => ch.id === action.payload.id);
        if (!exists) {
          state.items.push(action.payload);
        }
        state.currentChannelId = action.payload.id;
      })
      .addCase(createChannel.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload || 'Ошибка создания канала';
      })
      .addCase(updateChannel.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateChannel.fulfilled, (state, action) => {
        state.isUpdating = false;
        const index = state.items.findIndex(ch => ch.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateChannel.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload || 'Ошибка обновления канала';
      })
      .addCase(deleteChannel.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteChannel.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.items = state.items.filter(ch => ch.id !== action.payload);
        if (state.currentChannelId === action.payload) {
          const defaultChannel = state.items.find(ch => ch.name === 'general') || state.items[0];
          state.currentChannelId = defaultChannel?.id || null;
        }
      })
      .addCase(deleteChannel.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload || 'Ошибка удаления канала';
      });
  },
});

export const { 
  setCurrentChannel, 
  clearChannels,
  addChannel,
  removeChannel,
  renameChannel
} = channelsSlice.actions;

export default channelsSlice.reducer;