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
        const token = await AsyncStorage.getItem('access_token');

        try {
            const response = await axios.get(
                `${EDUQ}/api/course/study-route.json?aliasUrl=${aliasUrl}&idStudyRoute=${idStudyRoute}&studyRouteAliasUrl=${studyRouteAliasUrl}&idTopic=${idTopic}&extendKeys=Course&extendKeys=MainLessons&extendKeys=AdditionLessons&extendKeys=SteamQDataFilters`,
                {
                    headers: {
                        Authorization: token,
                    },
                },
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

    async getLesson(aliasUrl, idLesson, studyRouteAliasUrl, isMain) {
        const token = await AsyncStorage.getItem('access_token');
        try {
            const response = await axios.get(
                `${EDUQ}/api/course/lesson.json?aliasUrl=${aliasUrl}&studyRouteAliasUrl=${studyRouteAliasUrl}&isMain=${isMain}&idLesson=${idLesson}&extendKeys=Course&extendKeys=StudyRoute&extendKeys=LessonTopicFilters&extendKeys=Products&extendKeys=RelatedLessons`,
                {
                    headers: {
                        Authorization: token,
                    },
                },
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

    async getProductPackages(aliasUrl) {
        const token = await AsyncStorage.getItem('access_token');
        try {
            const response = await axios.get(`${EDUQ}/api/course/product-packages.json?aliasUrl=${aliasUrl}`, {
                headers: {
                    Authorization: token,
                },
            });
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

    async getStudyRoutes(idStudyRoutes) {
        const token = await AsyncStorage.getItem('access_token');
        if (!idStudyRoutes || idStudyRoutes.length === 0) {
            console.error('Invalid idStudyRoutes');
            return null;
        }

        try {
            const params = new URLSearchParams();
            idStudyRoutes.forEach((id) => {
                params.append('idStudyRoutes', id);
            });

            const response = await axios.get(`${EDUQ}/api/course/get-study-routes.json?${params.toString()}`, {
                headers: {
                    Authorization: token,
                },
            });

            if (response.data && response.data.data) {
                return response.data.data.studyRoutes;
            } else {
                console.error('Invalid response format:', response.data);
                return null;
            }
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    },

    async buy(aliasUrl, idPackage) {
        const token = await AsyncStorage.getItem('access_token');
        try {
            const response = await axios.post(
                `${EDUQ}/api/course/buy.json`,
                { aliasUrl: aliasUrl, idPackage: idPackage },
                {
                    headers: {
                        Authorization: token,
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
    async questions(idLesson, isMain, studyRouteAliasUrl, aliasUrl) {
        const token = await AsyncStorage.getItem('access_token');
        try {
            const response = await axios.get(
                `${EDUQ}/api/course/questions.json?idLesson=${idLesson}&isMain=${isMain}&studyRouteAliasUrl=${studyRouteAliasUrl}&aliasUrl=${aliasUrl}&extendKeys=Course`,
                {
                    headers: {
                        Authorization: token,
                    },
                },
            );
            if (response.data.error) {
                console.error('Invalid response format:', response.data);
                return null;
            } else {
                return {
                    data: response.data.data,
                    questions: response.data.data.questions,
                    extendData: response.data.data.extendData,
                    result: response.data.data.result,
                };
            }
        } catch (error) {
            return null;
        }
    },

    async qTestQuestions(idLesson, isMain, idStudyRoute, aliasUrl) {
        const token = await AsyncStorage.getItem('access_token');
        try {
            const response = await axios.get(
                `${EDUQ}/api/course/questions.json?aliasUrl=${aliasUrl}&idLesson=${idLesson}&isMain=${isMain}&idStudyRoute=${idStudyRoute}&extendKeys=Course&extendKeys=StudyRoute`,
                {
                    headers: {
                        Authorization: token,
                    },
                },
            );
            if (response.data.error) {
                console.error('Invalid response format:', response.data);
                return null;
            } else {
                return response.data.data;
            }
        } catch (error) {
            return null;
        }
    },
    async doQuestions(aliasUrl, idLesson, idStudyRoute, isMain, questions, studyRouteAliasUrl) {
        const token = await AsyncStorage.getItem('access_token');
        try {
            const response = await axios.post(
                `${EDUQ}/api/course/do-questions.json`,
                {
                    aliasUrl: aliasUrl,
                    extendKeys: [],
                    idLesson: idLesson,
                    idStudyRoute: idStudyRoute,
                    isMain: isMain,
                    questions: questions,
                    studyRouteAliasUrl: studyRouteAliasUrl,
                },
                {
                    headers: {
                        Authorization: token,
                    },
                },
            );
            if (response.data.error) {
                console.error('Invalid response format:', response.data);
                return null;
            } else {
                return response.data.data;
            }
        } catch (error) {
            return null;
        }
    },
};
