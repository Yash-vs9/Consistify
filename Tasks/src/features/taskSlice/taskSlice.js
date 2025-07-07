import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
const token= localStorage.getItem("authToken") || null
export const fetchTasks = createAsyncThunk(
    'task/fetchTasks',
    async () => {

        const response = await fetch('http://localhost:8080/task/getModel',{
            method:'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }
        )
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }
        return response.json()
    }
)
export const createTask = createAsyncThunk(
    'task/createTask',
    async (taskData, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem("authToken") || null;
        const response = await fetch('http://localhost:8080/task/create', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(taskData),
        });
  
        if (!response.ok) {
          throw new Error('Failed to create task');
        }
  
        return await response.json();
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  )
const initialState = {
    tasks: [],
    status: 'idle'
}

const taskSlice = createSlice({

    name: 'task',
    initialState,
    reducers: {
        addTask(state, action) {
            state.tasks.push(action.payload)
        },
        removeTask(state, action) {
            state.tasks = state.tasks.filter(task => task.id !== action.payload)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.tasks = action.payload
            })
            .addCase(fetchTasks.rejected, (state) => {
                state.status = 'failed'
            })
            .addCase(createTask.pending, (state) => {
                state.status = 'loading';
              })
              .addCase(createTask.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.tasks.push(action.payload);
              })
              .addCase(createTask.rejected, (state) => {
                state.status = 'failed';
              })
    }

})
export const { addTask, removeTask } = taskSlice.actions
export default taskSlice.reducer
