import { configureStore } from "@reduxjs/toolkit";
import taskReducer from '../features/taskSlice/taskSlice';
export const store=configureStore({
    reducer: {
        task: taskReducer
    }
})
export default store;