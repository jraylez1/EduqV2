import axios from 'axios';
import { Storage } from '@env';
import mime from 'mime';
import AsyncStorage from '@react-native-async-storage/async-storage';
// axios.interceptors.request.use((request) => {
//     console.log('Request:', request);
//     return request;
// });
export const FileStore = {
    async addImage(file) {
        const token = await AsyncStorage.getItem('access_token');
        const contentType = mime.getType(file.uri);
        const fileName = file.uri.split('/').pop();
        const size = file.size;
        try {
            const response = await axios.get(
                `${Storage}/api/file/getuploadurl.json?idCategory=0&moduleName=&fileName=${fileName}&contentType=${contentType}&size=${size}&filePrefix=`,
                {
                    headers: {
                        Authorization: token,
                    },
                },
            );
            if (response.data && response.data.data) {
                const formData = new FormData();
                formData.append('id', response.data.data.id);
                const res = await axios.post(`${Storage}/api/file/add.json`, formData, {
                    headers: {
                        Authorization: token,
                    },
                });
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
