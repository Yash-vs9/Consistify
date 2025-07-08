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

          const data = await response.json(); // ✅ parses JSON body
          const errorText = data.error; // read error body
          console.log(errorText)
          throw new Error(errorText || 'Something went wrong');
        }
  
        return await response.json();
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  )
  export const editTask = createAsyncThunk(
    'task/editTask',
    async (updatedTask, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem("authToken") || null;
        const response = await fetch(`http://localhost:8080/task/edit`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedTask),
        });
  
        if (!response.ok) {
          throw new Error('Failed to update task');
        }
  
        return await response.text(); // return updated task
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  
  export const deleteTask = createAsyncThunk(
    'task/deleteTask',
    async (taskName, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem("authToken") || null;
        const response = await fetch(`http://localhost:8080/task/delete/${taskName}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },

        });
  
        if (!response.ok) {
          throw new Error('Failed to delete task');
        }
  
        return response.text()
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
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
        },
        updateTask(state, action) {
            const index = state.tasks.findIndex(task => task.taskName === action.payload.oldName);
            if (index !== -1) {
                state.tasks[index] = action.payload;
            }
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
              .addCase(editTask.pending, (state) => {
                state.status = 'loading';
              })
              .addCase(editTask.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const updated = action.payload;
                const index = state.tasks.findIndex((task) => task.id === updated.id);
                if (index !== -1) {
                  state.tasks[index] = updated;
                }
              })
              .addCase(editTask.rejected, (state) => {
                state.status = 'failed';
              })
              
              .addCase(deleteTask.pending, (state) => {
                state.status = 'loading';
              })
              .addCase(deleteTask.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const id = action.payload;
                state.tasks = state.tasks.filter(task => task.id !== id);
              })
              .addCase(deleteTask.rejected, (state) => {
                state.status = 'failed';
              })
    }

})
export const { addTask, removeTask,updateTask } = taskSlice.actions
export default taskSlice.reducer
