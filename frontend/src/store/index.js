import { configureStore } from '@reduxjs/toolkit'; // Core for creating the store
import tasksReducer from '../features/tasks/tasksSlice'; 

// Simple store with one reducer for tasks; easy to expand like ( add usersSlice later)
export const store = configureStore({
  reducer: {
    tasks: tasksReducer, // Mounts tasks state under state.tasks
  },
  // Assumption: No middleware needed yet; default handles thunks
});