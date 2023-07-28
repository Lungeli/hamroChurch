import { createSlice } from "@reduxjs/toolkit";
export const initialState = {
    fullName: 'Lungeli',
    token: '',
    phoneNumber: '',
    email: '',
    mode: '',
    address: '',
    isLoggedIn: 'false'
};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
             setUserDetails(state) {
             //code here
            },
    },
    })

export const { setUserDetails } = usersSlice.actions;
export default usersSlice.reducer;