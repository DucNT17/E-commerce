import { createSlice } from "@reduxjs/toolkit";
import * as actions from './asyncActions'

export const appSlice = createSlice({
    name: 'app',
    initialState: {
        categories: null,
        blogs: null,
        isLoading: false,
        isShowModal: false,
        modalChildren: null,
        isShowCart: false,
        errorMessage: ''
    },
    reducers: {
        showModal: (state, action) => {
            state.isShowModal = action.payload.isShowModal;
            state.modalChildren = action.payload.modalChildren;
        },
        showCart: (state) => {
            state.isShowCart = state.isShowCart === false ? true : false;
        }
    },
    extraReducers: (builder) => {
        // category
        builder.addCase(actions.getCategories.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(actions.getCategories.fulfilled, (state, action) => {
            // console.log(action);
            state.isLoading = false;
            state.categories = action.payload;
        });

        builder.addCase(actions.getCategories.rejected, (state, action) => {
            state.isLoading = false;
            state.errorMessage = action.payload.message;
        });

        // blog
        builder.addCase(actions.getBlogs.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(actions.getBlogs.fulfilled, (state, action) => {
            state.isLoading = false;
            state.blogs = action.payload;
        })
        builder.addCase(actions.getBlogs.rejected, (state, action) => {
            state.isLoading = false;
            state.errorMessage = action.payload.message;
        })
    },
})

export const { showModal, showCart } = appSlice.actions

export default appSlice.reducer