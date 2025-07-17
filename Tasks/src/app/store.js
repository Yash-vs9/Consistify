import { configureStore } from "@reduxjs/toolkit";
import taskReducer from '../features/taskSlice/taskSlice';
import friendReducer from '../features/friendSlice/friendSlice';
import userReducer from '../features/userSlice/userSlice'
export const store=configureStore({
    reducer: {
        task: taskReducer,
        friend: friendReducer,
        user: userReducer
    }
})
export default store;