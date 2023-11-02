import axios from 'axios';
import { QTEST } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

// axios.interceptors.request.use((request) => {
//     console.log('Request:', request);
//     return request;
// });
export const PronunciationStore = {
    async pronunciationQuest(fileUri, expectedText, accent) {
        const token = await AsyncStorage.getItem('access_token');

        const formData = new FormData();
        formData.append('file', {
            uri: fileUri,
            name: 'pronunciation.mp3',
            type: 'audio/mp3',
        });
        formData.append('expectedText', expectedText);
        try {
            const response = await axios.post(`${QTEST}/pronunciation/file/${accent}`, formData, {
                headers: {
                    Authorization: token,
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },
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
};
