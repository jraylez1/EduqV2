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
    async get(aliasUrl) {
        try {
            const response = await axios.get(`${EDUQ}/api/course/get.json?aliasUrl=${aliasUrl}`);
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
    async getStudyRoute(aliasUrl, idStudyRoute, studyRouteAliasUrl, idTopic) {
        try {
            const response = await axios.get(
                `${EDUQ}/api/course/study-route.json?aliasUrl=${aliasUrl}&idStudyRoute=${idStudyRoute}&studyRouteAliasUrl=${studyRouteAliasUrl}&idTopic=${idTopic}&extendKeys=Course&extendKeys=MainLessons&extendKeys=AdditionLessons&extendKeys=SteamQDataFilters`,
            );
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
