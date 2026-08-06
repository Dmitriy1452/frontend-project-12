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

const channelsSlice = createSlice({
  name: 'channels',
  initialState: {
    items: [],
    currentChannelId: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    setCurrentChannel: (state, action) => {
      state.currentChannelId = action.payload;
    },
    clearChannels: (state) => {
      state.items = [];
      state.currentChannelId = null;
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
      .addCase(createChannel.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.currentChannelId = action.payload.id;
      })
      .addCase(updateChannel.fulfilled, (state, action) => {
        const index = state.items.findIndex(ch => ch.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteChannel.fulfilled, (state, action) => {
        state.items = state.items.filter(ch => ch.id !== action.payload);
        if (state.currentChannelId === action.payload) {
          state.currentChannelId = state.items[0]?.id || null;
        }
      });
  },
});

export const { setCurrentChannel, clearChannels } = channelsSlice.actions;
export default channelsSlice.reducer;