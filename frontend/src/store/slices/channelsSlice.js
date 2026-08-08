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
  async (data, { rejectWithValue }) => {
    try {
      const response = await channelsAPI.create(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Ошибка создания канала');
    }
  }
);

const initialState = {
  items: [],
  currentChannelId: null,
  isLoading: false,
  error: null,
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
      });
  },
});

export const { setCurrentChannel, clearChannels } = channelsSlice.actions;
export default channelsSlice.reducer;