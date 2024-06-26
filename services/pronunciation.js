import axios from 'axios';
import { Qtest } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

// axios.interceptors.request.use((request) => {
//     console.log('Request:', request);
//     return request;
// });
export const PronunciationStore = {
    async pronunciationQuest(fileUri, filename, expectedText, idCourse, accent) {
        const token = await AsyncStorage.getItem('access_token');

        const formData = new FormData();
        formData.append('file', {
            uri: fileUri,
            name: filename,
            type: 'audio/mp3',
        });
        formData.append('expectedText', expectedText);
        formData.append('extension', 'mp3');
        formData.append('idCourse', idCourse);

        try {
            const response = await axios.post(`${Qtest}/pronunciation/file/${accent}`, formData, {
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
    async scriptedQuest(fileUri, filename, expectedText, idCourse, accent) {
        const token = await AsyncStorage.getItem('access_token');

        const formData = new FormData();
        formData.append('file', {
            uri: fileUri,
            name: filename,
            type: 'audio/mp3',
        });
        formData.append('expectedText', expectedText);
        formData.append('extension', 'mp3');
        formData.append('idCourse', idCourse);

        try {
            const response = await axios.post(`${Qtest}/scripted/file/${accent}`, formData, {
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
    async unscriptedQuest(fileUri, filename, questionContent, accent, explain, question, idCourse) {
        const token = await AsyncStorage.getItem('access_token');

        const formData = new FormData();
        formData.append('file', {
            uri: fileUri,
            name: filename,
            type: 'audio/mp3',
        });
        formData.append('questionContent', questionContent);
        formData.append('explain', explain);
        formData.append('question', question);
        formData.append('extension', 'mp3');
        formData.append('idCourse', idCourse);
        try {
            const response = await axios.post(`${Qtest}/unscripted/file/${accent}`, formData, {
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
                `${Qtest}/pronunciation/base64/` + accent,
                {
                    headers: {
                        Authorization: token,
                    },
                },
                {
                    data: data,
                    expectedText: expectedText,
                    extension: 'mp3',
                    idCourse: idCourse,
                },
            );
            return response.data;
        } catch (error) {
            console.error('Error:', error);
        }
    },
};
