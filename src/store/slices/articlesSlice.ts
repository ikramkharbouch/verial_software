import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchArticles, addArticle } from '../../api/articlesService';
import { ArticleType } from '../../types/articles';

// Thunk to fetch articles
export const getArticles = createAsyncThunk<ArticleType[], void>(
    'articles/fetchArticles',
    async () => {
        const response = await fetchArticles();
        return response;
    }
);

// Thunk to add an article
export const createArticle = createAsyncThunk<ArticleType, ArticleType>(
    'articles/createArticle',
    async (article) => {
        const response = await addArticle(article);
        return response;
    }
);

// Slice
const articlesSlice = createSlice({
    name: 'articles',
    initialState: {
        articles: [],
        status: 'idle',
        error: null,
    } as any, // State is explicitly typed as `any`
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getArticles.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getArticles.fulfilled, (state, action: PayloadAction<ArticleType[]>) => {
                state.status = 'succeeded';
                state.articles = action.payload;
            })
            .addCase(getArticles.rejected, (state) => {
                state.status = 'failed';
                state.error = 'Failed to fetch articles';
            })
            .addCase(createArticle.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(createArticle.fulfilled, (state, action: PayloadAction<ArticleType>) => {
                state.status = 'succeeded';
                state.articles.push(action.payload);
            })
            .addCase(createArticle.rejected, (state) => {
                state.status = 'failed';
                state.error = 'Failed to create article';
            });
    },
});

export default articlesSlice.reducer;
