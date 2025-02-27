import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    isAuthenticated: boolean;
    user: { id: string; name: string } | null;
}

const initialState: UserState = {
    isAuthenticated: false,
    user: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state: UserState, action: PayloadAction<{ id: string; name: string }>) => {
            state.isAuthenticated = true;
            state.user = action.payload;
        },
        logout: (state: UserState) => {
            state.isAuthenticated = false;
            state.user = null;
        },
    },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
