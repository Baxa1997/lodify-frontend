import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  sidebar: true,
};

export const {actions: sidebarActions, reducer: sidebarReducer} = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setSidebar: (state, {payload}) => {
      state.sidebar = payload ?? true;
    },
  },
});
