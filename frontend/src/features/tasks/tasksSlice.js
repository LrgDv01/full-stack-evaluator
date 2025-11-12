import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { taskService } from '../../api/taskService'; // Our API wrapper

// Initial state: Includes loading/error for each action type if needed; here, global for simplicity
const initialState = {
  tasks: [], // Array of tasks
  loading: false, // Global loading flag (true during any async op)
  error: null, // Error message if failed
};

// Async thunks: Wrap taskService calls; auto-add pending/fulfilled/rejected
// getAllTasks: Fetches all tasks
export const getAllTasks = createAsyncThunk('tasks/getAll', async () => {
  return await taskService.getAll(); // Handles promise; rejects on error
});

// createTask: Creates a new task
export const createTask = createAsyncThunk('tasks/create', async (dto) => {
  return await taskService.create(dto);
});

// Similarly for others...
export const updateTask = createAsyncThunk('tasks/update', async ({ id, dto }) => {
  return await taskService.update(id, dto); // Pass {id, dto} from dispatch
});

export const deleteTask = createAsyncThunk('tasks/delete', async (id) => {
  await taskService.delete(id); // No return data needed
  return id; // Return id for reducer to remove locally
});

export const reorderTasks = createAsyncThunk('tasks/reorder', async (updates) => {
  await taskService.reorder(updates);
  return updates; // Return for optimistic update if needed
});

export const toggleTask = createAsyncThunk('tasks/toggle', async ({ id, isCompleted }) => {
  return await taskService.toggle(id, isCompleted);
});

// Slice: Defines reducers for state updates
const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Optional: Sync reducers if needed (e.g., clearError)
  },
  extraReducers: (builder) => {
    // Global loading/error handling for all thunks
    builder
      .addMatcher(
        (action) => action.type.endsWith('/pending'), // Matches any thunk pending
        (state) => {
          state.loading = true; // Set loading true
          state.error = null; // Clear old errors
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled'), // Matches success
        (state, action) => {
          state.loading = false;
          // Update tasks based on action type (custom logic per thunk)
          if (action.type === 'tasks/getAll/fulfilled') {
            state.tasks = action.payload; // Replace list
          } else if (action.type === 'tasks/create/fulfilled') {
            state.tasks.push(action.payload); // Add new
          } else if (action.type === 'tasks/update/fulfilled' || action.type === 'tasks/toggle/fulfilled') {
            const index = state.tasks.findIndex((t) => t.id === action.payload.id);
            if (index !== -1) state.tasks[index] = action.payload; // Update in place
          } else if (action.type === 'tasks/delete/fulfilled') {
            state.tasks = state.tasks.filter((t) => t.id !== action.payload); // Remove by id
          } else if (action.type === 'tasks/reorder/fulfilled') {
            // Apply new orders (assumes updates is array of {id, order})
            action.payload.forEach((upd) => {
              const task = state.tasks.find((t) => t.id === upd.id);
              if (task) task.order = upd.order;
            });
            state.tasks.sort((a, b) => a.order - b.order); // Re-sort locally
          }
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'), // Matches failure
        (state, action) => {
          state.loading = false;
          state.error = action.error.message; // Set error (handle in UI, e.g., toast)
        }
      );
  },
});

export default tasksSlice.reducer; // Export for store