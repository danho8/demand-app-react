import { createSlice } from "@reduxjs/toolkit";


const authSlice = createSlice({
  name: 'auth',
  initialState: {
    login: {
      currentUser: null,
      isFetching: false,
      error: false,
      token: undefined,
      isLogin: false
    }
  },
  reducers: {
    loginStart: (state) => {
      state.login.isFetching = true
      state.login.isLogin = false
    },
    loginSuccess: (state, action) => {
      state.login.isFetching = false
      state.login.error = false
      state.login.currentUser = action.payload
      state.login.token = action.payload.accessToken
      state.login.isLogin = true
    },
    loginFailed: (state, action) => {
      state.login.isFetching = false
      state.login.error = true
      state.login.isLogin = false
    },
    logoutAction: (state) => {
      state.login.currentUser = null
      state.login.token = undefined
      state.login.isLogin = false
    }
  }
})

export const {
  loginStart,
  loginSuccess,
  loginFailed,
  logoutAction
} = authSlice.actions

export default authSlice.reducer