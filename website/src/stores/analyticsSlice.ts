import { createSlice } from '@reduxjs/toolkit';

interface AnalyticsState {
    pageViews: number;
}

const initialState: AnalyticsState = {
    pageViews: 0,
};

const analyticsSlice = createSlice({
    name: 'analytics',
    initialState,
    reducers: {
        incrementPageViews: (state) => {
            state.pageViews += 1;
        },
    },
});

export const { incrementPageViews } = analyticsSlice.actions;

export default analyticsSlice.reducer;