import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PreferencesState {
    language: string;
    currency: string;
}

const initialState: PreferencesState = {
    language: 'en',
    currency: 'USD',
};

const preferencesSlice = createSlice({
    name: 'preferences',
    initialState,
    reducers: {
        setLanguage: (state, action: PayloadAction<string>) => {
            state.language = action.payload;
        },
        setCurrency: (state, action: PayloadAction<string>) => {
            state.currency = action.payload;
        },
    },
});

export const { setLanguage, setCurrency } = preferencesSlice.actions;

export default preferencesSlice.reducer;