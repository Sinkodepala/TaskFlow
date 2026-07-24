import { combineReducers } from '@reduxjs/toolkit';
import boardReducer from '@/store/slices/board';

export const rootReducer = combineReducers({
  board: boardReducer,
});