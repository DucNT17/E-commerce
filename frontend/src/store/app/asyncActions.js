import { createAsyncThunk } from "@reduxjs/toolkit";
import * as apis from 'apis'


export const getCategories = createAsyncThunk('app/categories', async (data, { rejectWithValue }) => {
    const response = await apis.apiGetCategories();
    if (!response.success) {
        return rejectWithValue(response)
    }
    return response.productCategories;
}); 

export const getBlogs = createAsyncThunk('app/blog', async (data, { rejectWithValue }) => {
    const response = await apis.apiGetBlogs();
    if (!response.success) {
        return rejectWithValue(response)
    }
    return response.blogs;
}); 