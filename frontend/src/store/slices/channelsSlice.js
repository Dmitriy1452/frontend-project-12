import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { channelsAPI } from '../../api';

export const fetchChannels = createAsyncThunk(
  'channels/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await channelsAPI.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Ошибка загрузки каналов');
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
      return rejectWithValue(error.response?.data || 'Ошибка создания канала');
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
      return rejectWithValue(error.response?.data || 'Ошибка обновления канала');
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
      return rejectWithValue(error.response?.data || 'Ошибка удаления канала');
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
        state.error = action.payload;
      })
      .addCase(createChannel.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createChannel.fulfilled, (state, action) => {
        state.isCreating = false;
        state.items.push(action.payload);
        state.currentChannelId = action.payload.id;
      })
      .addCase(createChannel.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload;
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
        state.error = action.payload;
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
        state.error = action.payload;
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