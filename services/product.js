import axios from 'axios';
import { EduQ } from '@env';
// axios.interceptors.request.use((request) => {
//     console.log('Request:', request);
//     return request;
// });
export const ProductStore = {
    async getListProduct(currentPage, keyword) {
        try {
            const response = await axios.get(
                `${EduQ}/api/product/list.json?keyword=${keyword}&limit=12&page=${currentPage}`,
            );
            if (response.data && response.data.data) {
                return {
                    products: response.data.data.products,
                    total: response.data.data.total,
                };
            } else {
                console.error('Invalid response format:', response.data);
                return null;
            }
        } catch (error) {
            return null;
        }
    },
    async getProduct(aliasUrl) {
        try {
            const response = await axios.get(`${EduQ}/api/product/get.json?aliasUrl=${aliasUrl}&relatedLimit=4`);
            if (response.data && response.data.data) {
                return response.data.data;
            } else {
                console.error('Invalid response format:', response.data);
                return null;
            }
        } catch (error) {
            return null;
        }
    },
};
