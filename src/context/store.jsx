import { configureStore } from '@reduxjs/toolkit';
import todos from "./todoSlice";

const store = configureStore(
  {
  reducer: {
    todos: todos,
  },
}
);

export default store;
