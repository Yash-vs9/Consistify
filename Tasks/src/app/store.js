import { configureStore } from "@reduxjs/toolkit";
import taskReducer from '../features/taskSlice/taskSlice';
import friendReducer from '../features/friendSlice/friendSlice';
export const store=configureStore({
    reducer: {
        task: taskReducer,
        friend: friendReducer
    }
})
export default store;