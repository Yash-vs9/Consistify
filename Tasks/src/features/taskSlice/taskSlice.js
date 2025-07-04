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
    }

})
export const { addTask, removeTask } = taskSlice.actions
export default taskSlice.reducer
