import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  allTodos: JSON.parse(localStorage.getItem('todolist')) || [],
  completedTodos: JSON.parse(localStorage.getItem('completedTodos')) || [],
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action) => {
     
      state.allTodos.push(action.payload);
      localStorage.setItem('todolist', JSON.stringify(state.allTodos));
    },
    deleteTodo: (state, action) => {
      state.allTodos.splice(action.payload, 1);
      localStorage.setItem('todolist', JSON.stringify(state.allTodos));
    },
    markComplete: (state, action) => {
      console.log(state, action, 'checlsoid')
      const { index, completedOn } = action.payload;
      const completedItem = {
        ...state.allTodos[index],
        completedOn,
      };
      state.completedTodos.push(completedItem);
      state.allTodos.splice(index, 1);
      
    
      localStorage.setItem('todolist', JSON.stringify(state.allTodos));
      localStorage.setItem('completedTodos', JSON.stringify(state.completedTodos));
    },
    
    deleteCompletedTodo: (state, action) => {
      state.completedTodos.splice(action.payload, 1);
      localStorage.setItem('completedTodos', JSON.stringify(state.completedTodos));
    },
    editTodo: (state, action) => {
      const { index, updatedItem } = action.payload;
      state.allTodos[index] = updatedItem;
      localStorage.setItem('todolist', JSON.stringify(state.allTodos));
    },
  },
});

export const { addTodo, deleteTodo, markComplete, deleteCompletedTodo, editTodo } = todoSlice.actions;
export default todoSlice.reducer;
