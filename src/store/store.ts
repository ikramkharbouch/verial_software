import { configureStore } from '@reduxjs/toolkit';
import clientsReducer from './slices/clientsSlice';
import providersReducer from './slices/providersSlice';
// import articlesReducer from './slices/articlesSlice';
import financialsReducer from './slices/financialsSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
    reducer: {
        clients: clientsReducer,
        providers: providersReducer,
        // articles: articlesReducer,
        financials: financialsReducer,
        user: userReducer, // Add the user slice here
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
