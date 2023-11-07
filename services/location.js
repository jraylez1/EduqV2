import axios from 'axios';
import { Auth } from '@env';

// axios.interceptors.request.use((request) => {
//     console.log('Request:', request);
//     return request;
// });

export const LocationStore = {
    async findProvince() {
        try {
            const response = await axios.get(`${Auth}/api/location/findprovince.json`);
            if (response.data && response.data.data) {
                return response.data.data.dataSource.provinces;
            } else {
                console.error('Invalid response format:', response.data);
                return null;
            }
        } catch (error) {
            return null;
        }
    },

    async findDistrict(idProvince) {
        try {
            const response = await axios.get(`${Auth}/api/location/finddistrict.json?idProvince=${idProvince}`);
            if (response.data && response.data.data) {
                return response.data.data.dataSource.districts;
            } else {
                console.error('Invalid response format:', response.data);
                return null;
            }
        } catch (error) {
            return null;
        }
    },

    async findWard(idDistrict) {
        try {
            const response = await axios.get(`${Auth}/api/location/findward.json?idDistrict=${idDistrict}`);
            if (response.data && response.data.data) {
                return response.data.data.dataSource.wards;
            } else {
                console.error('Invalid response format:', response.data);
                return null;
            }
        } catch (error) {
            return null;
        }
    },
};
