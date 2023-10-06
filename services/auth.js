import axios from 'axios';
import { AUTH } from '@env';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';

// axios.interceptors.request.use((request) => {
//     console.log('Request:', request);
//     return request;
// });

export const AuthStore = {
    async sendRecaptcha(recaptchaRef) {
        try {
            recaptchaRef.current.open();
            return true;
        } catch (error) {
            console.error('Error sending reCAPTCHA:', error);
            return false;
        }
    },
    async register(formData, reCaptchaToken, navigation) {
        try {
            const response = await axios.post(`${AUTH}/api/auth/register.json`, formData, {
                headers: {
                    recaptchaV3: reCaptchaToken,
                },
            });
            if (response.data) {
                if (response.data.error === true) {
                    alert(response.data.message);
                } else {
                    alert(response.data.message);
                    navigation.replace('BottomNavigation', { screen: 'UserScreen' });
                }
            } else {
                console.error('Invalid response format:', response.data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    },

    async login(formData, reCaptchaToken, navigation) {
        try {
            const idDevice = uuid.v4();
            const response = await axios.post(
                `${AUTH}/api/auth/login.json`,
                { ...formData, idDevice: idDevice, deviceType: 'mobile' },
                {
                    headers: {
                        recaptchaV3: reCaptchaToken,
                    },
                },
            );
            if (response.data) {
                if (response.data.error === true) {
                    alert(response.data.message);
                } else {
                    await AsyncStorage.setItem('access_token', response.data.data.accessToken);
                    navigation.replace('BottomNavigation', { screen: 'HomeScreen' });
                }
            } else {
                console.error('Invalid response format:', response.data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    },

    async getProfile(navigation) {
        const token = await AsyncStorage.getItem('access_token');
        try {
            const response = await axios.get(`${AUTH}/api/profile/get.json`, {
                headers: {
                    Authorization: token,
                },
            });
            if (response.data.error == false) {
                return response.data.data;
            } else {
                this.logout(navigation);
            }
        } catch (error) {
            return null;
        }
    },

    async editProfile(formData) {
        const token = await AsyncStorage.getItem('access_token');
        try {
            const response = await axios.post(`${AUTH}/api/profile/edit.json`, formData, {
                headers: {
                    Authorization: token,
                },
            });
            if (response.data) {
                alert(response.data.message);
                return response.data.error;
            } else {
                console.error('Invalid response format:', response.data);
                return null;
            }
        } catch (error) {
            return null;
        }
    },

    async recoveryPassword(formData, reCaptchaToken, navigation) {
        try {
            const response = await axios.post(`${AUTH}/api/auth/recovery-password.json`, formData, {
                headers: {
                    recaptchaV3: reCaptchaToken,
                },
            });
            if (response.data) {
                if (response.data.error === true) {
                    alert(response.data.message);
                    this.logout(navigation);
                } else {
                    alert(response.data.message);
                    navigation.replace('BottomNavigation', { screen: 'UserScreen' });
                }
            } else {
                console.error('Invalid response format:', response.data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    },

    async isLoggedIn() {
        try {
            const accessToken = await AsyncStorage.getItem('access_token');
            if (accessToken) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error checking login status:', error);
            return 'error';
        }
    },

    async logout(navigation) {
        try {
            await AsyncStorage.removeItem('access_token');
            navigation.replace('BottomNavigation', { screen: 'UserScreen' });
            this.isLoggedIn();
        } catch (error) {
            console.error('Error logging out:', error);
        }
    },
};
