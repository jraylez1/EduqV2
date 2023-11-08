import axios from 'axios';
import { Storage } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
// axios.interceptors.request.use((request) => {
//     console.log('Request:', request);
//     return request;
// });
export const FileStore = {
    async addImage(fileName, contentType, size) {
        const token = await AsyncStorage.getItem('access_token');

        try {
            const response = await axios.get(
                `${Storage}/api/file/getuploadurl.json?idCategory=0&moduleName=&fileName=${fileName}&contentType=${contentType}&size=${size}&filePrefix=`,
            );
            return response.data;
            const idImg = response.data.data.id;
            if (response.data && response.data.data) {
                const res = await axios.post(
                    `${Storage}/api/file/add.json`,
                    {
                        id: response.data.data.id,
                    },
                    {
                        headers: {
                            Authorization: token,
                        },
                    },
                );
                return res.data.data;
            } else {
                console.error('Invalid response format:', response.data);
                return null;
            }
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    },
};
