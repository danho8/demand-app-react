import { configureStore } from "@reduxjs/toolkit";
import authSlice from './authSilce'
import userSlice from "./userSlice";

export const store = configureStore({
  reducer: {
      authSlice,
      userSlice
  },
});
