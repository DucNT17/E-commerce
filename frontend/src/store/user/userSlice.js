import { createSlice } from "@reduxjs/toolkit";
import * as actions from './asyncActions'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        isLoggedIn: false,
        current: null,
        token: null,
        isLoading: false,
        mes: '',
    },
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn
            // state.current = action.payload.userData
            state.token = action.payload.token
        },
        logout: (state, action) => {
            state.isLoggedIn = false;
            state.current = null;
            state.token = null;
            state.isLoading = false;
            state.mes = '';
        },
        clearMessage: (state, action) => {
            state.mes = '';
        }
    },
    extraReducers: (builder) => {
        builder.addCase(actions.getCurrent.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(actions.getCurrent.fulfilled, (state, action) => {
            // console.log(action);
            state.isLoading = false;
            state.current = action.payload;
            state.isLoggedIn = true;
        });

        builder.addCase(actions.getCurrent.rejected, (state, action) => {
            state.isLoading = false;
            state.current = null;
            state.isLoggedIn = false;
            state.token = null;
            state.mes = 'Login session expired, please log in again'
        });
    },
})

export const { login, logout, clearMessage } = userSlice.actions

export default userSlice.reducer