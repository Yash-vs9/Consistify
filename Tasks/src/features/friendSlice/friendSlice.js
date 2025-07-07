// src/features/friendSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchFriends = createAsyncThunk(
  'friend/fetchFriends',
  async (token, { rejectWithValue }) => {
    try {
      const res = await fetch('http://localhost:8080/users/friends', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch');

      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const friendSlice = createSlice({
  name: 'friend',
  initialState: {
    friends: [],
    error: false,
    status: 'idle', // idle | loading | succeeded | failed
  },
  reducers: {
    clearFriends: (state) => {
      state.friends = [];
      state.error = false;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFriends.pending, (state) => {
        state.status = 'loading';
        state.error = false;
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.friends = action.payload;
        state.error = false;
      })
      .addCase(fetchFriends.rejected, (state) => {
        state.status = 'failed';
        state.error = true;
      });
  },
});

export const { clearFriends } = friendSlice.actions;
export default friendSlice.reducer;