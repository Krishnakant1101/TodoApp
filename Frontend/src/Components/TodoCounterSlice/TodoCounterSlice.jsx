import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
    count: 0,
    Tasks: [] // Initially empty
};


export const TodoCounterSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        // Increment the counter
        Increment: (state) => {
            state.count += 1;
        },

        // Decrement the counter
        Decrement: (state) => {
            state.count -= 1;
        },

        // Create a new task with default stage as 'todo'
        CreateNewTask: (state, action) => {
            state.Tasks.push({
                id: action.payload.id,
                title: action.payload.title,
                description: action.payload.description,
                stage: "todo", // Default stage
            });
        },

        // Move a task to a different stage
        MoveTask: (state, action) => {
            const { id, newStage } = action.payload;
            const task = state.Tasks.find((task) => task.id === id);
            if (task) {
                task.stage = newStage;
            }
        },

        // Delete a task
        DeleteTask: (state, action) => {
            const { id } = action.payload;
            state.Tasks = state.Tasks.filter((task) => task.id !== id);
        },

        // Update a task's title or description
        UpdateTask: (state, action) => {
            const { id, title, description } = action.payload;
            const task = state.Tasks.find((task) => task.id === id);
            if (task) {
                if (title) task.title = title;
                if (description) task.description = description;
            }
        },
    },
});

export const { Increment, Decrement, CreateNewTask, MoveTask, DeleteTask, UpdateTask } = TodoCounterSlice.actions;

export default TodoCounterSlice.reducer;
