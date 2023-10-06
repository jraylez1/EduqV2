import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EDUQ } from '@env';
// axios.interceptors.request.use((request) => {
//     console.log('Request:', request);
//     return request;
// });

export const CourseStore = {
    async getBestCourses() {
        try {
            const response = await axios.get(`${EDUQ}/api/course/the-bests.json`);
            if (response) {
                return response.data.data;
            } else {
                console.error('Invalid response format:', response.data);
                return null;
            }
        } catch (error) {
            console.error('Error', error);
            return null;
        }
    },
};
