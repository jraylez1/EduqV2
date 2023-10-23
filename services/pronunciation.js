import axios from 'axios';
import { QTEST } from '@env';
// axios.interceptors.request.use((request) => {
//     console.log('Request:', request);
//     return request;
// });
export const PronunciationStore = {
    async checkBase64(data, expectedText, idCourse, accent) {
        const token = await AsyncStorage.getItem('access_token');
        try {
            const response = await axios.post(
                `${QTEST}/pronunciation/base64/` + accent,
                {
                    headers: {
                        Authorization: token,
                    },
                },
                {
                    data: data,
                    expectedText: expectedText,
                    extension: 'webm',
                    idCourse: idCourse,
                },
            );
            return response.data;
        } catch (error) {
            console.error('Error:', error);
        }
    },

    async convertToBase64(audioBase64, expectedText, accent) {
        const token = await AsyncStorage.getItem('access_token');
        try {
            const response = await axios.post(
                `${QTEST}/pronunciation/file/${accent}`,
                {
                    audioBase64: audioBase64,
                    expectedText: expectedText,
                },
                {
                    headers: {
                        Authorization: token,
                    },
                },
            );
            return response.data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },
};
