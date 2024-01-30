import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
    name: 'user',
    initialState: {
        businessName: "",
        contactName: "",
        contactNumber: "",
        contactEmail: ""
    },
    reducers: {
        editUser: (state, action) => {
            state.businessName = action.payload.businessName
            state.contactName = action.payload.contactName
            state.contactNumber = action.payload.contactNumber
            state.contactEmail = action.payload.contactEmail
        },
        resetDataLogout: (state) => {
            state.businessName = ""
            state.contactName = ""
            state.contactNumber = ""
            state.contactEmail = ""
        }
    }
})

export const {
    editUser, resetDataLogout
} = userSlice.actions

export default userSlice.reducer