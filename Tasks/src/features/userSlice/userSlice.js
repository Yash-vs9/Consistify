import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Get token from localStorage (you can move this inside the thunk too)
const token = localStorage.getItem("authToken") || null;

// Async thunk for fetching user
export const fetchUser = createAsyncThunk(
  "/user/fetchUser",
  async () => {
    try {
      const response = await fetch("http://localhost:8080/getUser", {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to fetch user");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Fetch user failed:", error.message);
      throw error;
    }
  }
);

// Initial state
const initialState = {
  user: {},
  status: "idle",     // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

// Slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
        state.user=action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  }
});

// Export reducer (important!)
export const { setUser } = userSlice.actions;

export default userSlice.reducer;