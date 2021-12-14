import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { AppState } from "../../app/store";

export interface SelectedStudentState {
  value: Student;
}

const initialState: SelectedStudentState = {
  value: null,
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    select: (state, action: PayloadAction<Student>) => {
      state.value = action.payload;
    },
  },
});

export const { select } = counterSlice.actions;

export const selectCurrentStudent = (state: AppState) => state.selectedStudent;

export default counterSlice.reducer;
