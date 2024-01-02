import axios from 'axios';
import { EduQ } from '@env';
// axios.interceptors.request.use((request) => {
//     console.log('Request:', request);
//     return request;
// });
export const CartStore = {
    async sendRecaptcha(recaptchaRef) {
        try {
            recaptchaRef.current.open();
            return true;
        } catch (error) {
            console.error('Error sending reCAPTCHA:', error);
            return false;
        }
    },

    async getCartProducts(products) {
        try {
            const response = await axios.post(`${EduQ}/api/cart/get.json`, { items: products });
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

    async buyProducts(formData, products, reCaptchaToken) {
        try {
            const response = await axios.post(
                `${EduQ}/api/cart/buy.json`,
                { ...formData, items: products },
                {
                    headers: {
                        recaptchaV3: reCaptchaToken,
                    },
                },
            );
            if (response.data) {
                return response.data;
            } else {
                console.error('Invalid response format:', response.data);
                return null;
            }
        } catch (error) {
            return null;
        }
    },
};
