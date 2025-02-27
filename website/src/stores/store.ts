import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import themeReducer from './themeSlice';
import authSlice from './authSlice';
import errorSlice from './errorSlice';
import loadingSlice from './loadingSlice';
import notificationSlice from './notificationSlice';
import searchSlice from './searchSlice';
import preferencesSlice from './preferenceSlice';
import modalSlice from './modalSlice';
import cartSlice from './cartSlice';
import analyticsSlice from './analyticsSlice';

const store = configureStore({
    reducer: {
        theme: themeReducer,
        error: errorSlice,
        loading: loadingSlice,
        preferences: preferencesSlice,
        notification: notificationSlice,
        search: searchSlice,
        modal: modalSlice,
        cart: cartSlice,
        analytics: analyticsSlice,
        auth: authSlice,
        user: userReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;