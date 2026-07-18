import { combineReducers } from '@reduxjs/toolkit';
import boardReducer from '@/store/slices/boardSlice';

export const rootReducer = combineReducers({
  board: boardReducer,
});