import API from './axiosInstance';
import { ArticleType } from '@types';

export const fetchArticles = async (): Promise<ArticleType[]> => {
    const response = await API.get<ArticleType[]>('/providers');
    return response.data;
};

/**
 * Add a new article to the server.
 * @param article - The article to be added
 */
export const addArticle = async (article: ArticleType): Promise<ArticleType> => {
    const response = await API.post<ArticleType>('/articles', article);
    return response.data;
};
