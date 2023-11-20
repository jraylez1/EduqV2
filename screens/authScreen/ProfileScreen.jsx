import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import React, { useLayoutEffect, useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, NativeBaseProvider, Input, Select, CheckIcon } from 'native-base';
import { useTranslation } from 'react-i18next';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import mime from 'mime';
import * as ImageManipulator from 'expo-image-manipulator';
import { AuthStore } from '../../services/auth';
import { FileStore } from '../../services/file';
import { LocationStore } from '../../services/location';

const ProfileScreen = ({ route }) => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const data = route?.params?.data;
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            loadProvince();
            if (data.province !== '' && data.district !== '') {
                loadDistrictData(data.province);
                loadWardData(data.district);
            }
            setInformation();
            setIsLoading(false);
        }, 1000);
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: t('Profile'),
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: '#081D49',
            },
            headerTintColor: '#fff',
            headerRight: () => {
                return (
                    <AntDesign
                        name="customerservice"
                        size={24}
                        color="white"
                        onPress={() => navigation.navigate('ContactScreen')}
                    />
                );
            },
        });
    }, []);

    const setInformation = () => {
        if (AuthStore.isLoggedIn && data) {
            formik.setValues({
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                email: data.email || '',
                mobile: data.mobile || '',
                address: data.address || '',
                province: data.province || '',
                district: data.district || '',
                ward: data.ward || '',
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
                avatarUrl: data.avatarUrl || '',
            });
        }
    };

    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required('Please enter your information'),
        lastName: Yup.string().required('Please enter your information'),
        mobile: Yup.number('Phone number should not include characters.')
            .required('Please enter your information')
            .positive('The phone number must be a positive number')
            .integer('Số điện thoại phải là số nguyên'),
        email: Yup.string().email('Invalid Email Address').required('Please enter your information'),
        address: Yup.string().required('Please enter your information'),
        province: Yup.string().required('Please enter your information'),
        district: Yup.string().required('Please enter your information'),
        ward: Yup.string().required('Please enter your information'),
        avatarUrl: Yup.string().default(''),
        oldPassword: Yup.string().default(''),
        newPassword: Yup.string().default(''),
        confirmPassword: Yup.string()
            .default('')
            .oneOf([Yup.ref('newPassword'), ''], 'Confirm new password is not match'),
    });

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            mobile: '',
            address: '',
            province: '',
            district: '',
            ward: '',
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
            avatarUrl: '',
        },
        validationSchema,
        onSubmit: async () => {
            try {
                const editValue = await AuthStore.editProfile({
                    ...formik.values,
                });
                if (editValue == false) {
                    AuthStore.logout(navigation);
                }
            } catch (error) {
                console.log('error');
            }
        },
    });

    const loadProvince = async () => {
        const provincesData = await LocationStore.findProvince();
        setProvinces(provincesData);
    };

    const loadDistrictData = async (value) => {
        formik.setFieldValue('province', value);
        formik.setFieldValue('district', '');
        formik.setFieldValue('ward', '');

        setDistricts([]);
        try {
            const districtsData = await LocationStore.findDistrict(value);
            setDistricts(districtsData);
        } catch (error) {
            console.error('Error fetching districts:', error);
        }
    };

    const loadWardData = async (value) => {
        formik.setFieldValue('district', value);
        formik.setFieldValue('ward', '');
        setWards([]);
        try {
            const wardsData = await LocationStore.findWard(value);
            setWards(wardsData);
        } catch (error) {
            console.error('Error fetching ward:', error);
        }
    };

    const pickImage = async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (permissionResult.granted === false) {
                alert('Permission to access media library is required!');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync();

            if (!result.canceled) {
                const newUri = result.uri.replace('.jpeg', '.png');
                await FileSystem.moveAsync({
                    from: result.uri,
                    to: newUri,
                });
                const fileName = newUri.split('/').pop();
                const contentType = mime.getType(fileName);
                const fileInfo = await FileSystem.getInfoAsync(newUri);
                const size = fileInfo.size;
                const uploadedImage = await FileStore.addImage(fileName, contentType, size);
                console.log(uploadedImage);

                formik.setFieldValue('avatarUrl', newUri);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while uploading the image.');
        }
    };

    return (
        <View style={{ flex: 1 }}>
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.loadingTitle}>{t('...Loading User data')}</Text>
                </View>
            ) : (
                <ScrollView style={styles.container}>
                    <View style={styles.infoContainer}>
                        <View style={styles.avatarContainer}>
                            {data.avatarUrl.length > 0 ? (
                                <TouchableOpacity onPress={() => pickImage()}>
                                    <View style={styles.avatarBorder}>
                                        <Image
                                            source={{
                                                uri: formik.values.avatarUrl,
                                            }}
                                            style={styles.avatarStyle}
                                        />

                                        <View style={{ position: 'absolute', bottom: 0, right: 12 }}>
                                            <FontAwesome name="camera" size={24} color="white" />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity onPress={() => pickImage()}>
                                    <View style={styles.avatarBorder}>
                                        <Image
                                            source={{
                                                uri: 'https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png',
                                            }}
                                            style={styles.avatarStyle}
                                        />

                                        <View style={{ position: 'absolute', bottom: 0, right: 12 }}>
                                            <FontAwesome name="camera" size={24} color="white" />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                            <View style={{ alignItems: 'center' }}>
                                <Text style={styles.userTitle}>{data.lastName + ' ' + data.firstName}</Text>
                                <Text style={styles.userEmail}>{data.email}</Text>
                            </View>
                        </View>
                        <View style={{ width: '100%', marginTop: 24 }}>
                            <NativeBaseProvider>
                                <View style={{ marginBottom: 16 }}>
                                    <Text style={styles.inputTitle}>{t('First Name')}</Text>
                                    <Input
                                        size="xl"
                                        placeholder={t('First Name')}
                                        style={{ backgroundColor: '#fff', paddingVertical: 12 }}
                                        onChangeText={formik.handleChange('firstName')}
                                        onBlur={formik.handleBlur('firstName')}
                                        value={formik.values.firstName}
                                    />
                                    {formik.touched.firstName && formik.errors.firstName ? (
                                        <Text style={{ marginTop: 4, color: '#f22c27' }}>
                                            {t(formik.errors.firstName)}
                                        </Text>
                                    ) : null}
                                </View>
                                <View style={{ marginBottom: 16 }}>
                                    <Text style={styles.inputTitle}>{t('Last Name')}</Text>
                                    <Input
                                        size="xl"
                                        placeholder={t('Last Name')}
                                        style={{ backgroundColor: '#fff', paddingVertical: 12 }}
                                        onChangeText={formik.handleChange('lastName')}
                                        onBlur={formik.handleBlur('lastName')}
                                        value={formik.values.lastName}
                                    />
                                    {formik.touched.lastName && formik.errors.lastName ? (
                                        <Text style={{ marginTop: 4, color: '#f22c27' }}>
                                            {t(formik.errors.lastName)}
                                        </Text>
                                    ) : null}
                                </View>
                                <View style={{ marginBottom: 16 }}>
                                    <Text style={styles.inputTitle}>{t('Email')}</Text>
                                    <Input
                                        size="xl"
                                        placeholder={t('Email')}
                                        style={{ backgroundColor: '#fff', paddingVertical: 12 }}
                                        onChangeText={formik.handleChange('email')}
                                        onBlur={formik.handleBlur('email')}
                                        value={formik.values.email}
                                    />
                                    {formik.touched.email && formik.errors.email ? (
                                        <Text style={{ marginTop: 4, color: '#f22c27' }}>{t(formik.errors.email)}</Text>
                                    ) : null}
                                </View>
                                <View style={{ marginBottom: 16 }}>
                                    <Text style={styles.inputTitle}>{t('Phone Number')}</Text>
                                    <Input
                                        size="xl"
                                        placeholder={t('Phone Number')}
                                        style={{ backgroundColor: '#fff', paddingVertical: 12 }}
                                        onChangeText={formik.handleChange('mobile')}
                                        onBlur={formik.handleBlur('mobile')}
                                        value={formik.values.mobile}
                                    />
                                    {formik.touched.mobile && formik.errors.mobile ? (
                                        <Text style={{ marginTop: 4, color: '#f22c27' }}>
                                            {t(formik.errors.mobile)}
                                        </Text>
                                    ) : null}
                                </View>
                                <View style={{ marginBottom: 16 }}>
                                    <Text style={styles.inputTitle}>{t('Address')}</Text>
                                    <Input
                                        size="xl"
                                        placeholder={t('Address')}
                                        style={{ backgroundColor: '#fff', paddingVertical: 12 }}
                                        onChangeText={formik.handleChange('address')}
                                        onBlur={formik.handleBlur('address')}
                                        value={formik.values.address}
                                    />
                                    {formik.touched.address && formik.errors.address ? (
                                        <Text style={{ marginTop: 4, color: '#f22c27' }}>
                                            {t(formik.errors.address)}
                                        </Text>
                                    ) : null}
                                </View>

                                <View style={{ marginBottom: 16 }}>
                                    <Text style={styles.inputTitle}>{t('Province')}</Text>

                                    <View>
                                        <Select
                                            selectedValue={formik.values.province}
                                            minWidth="200"
                                            accessibilityLabel="Choose province"
                                            placeholder={t('Choose province')}
                                            _selectedItem={{
                                                bg: 'teal.600',
                                                endIcon: <CheckIcon size="5" />,
                                            }}
                                            _light={{
                                                bg: '#fff',
                                                _hover: {
                                                    bg: '#fff',
                                                },
                                                _focus: {
                                                    bg: '#fff',
                                                },
                                            }}
                                            mt={1}
                                            onValueChange={(itemValue) => loadDistrictData(itemValue)}
                                        >
                                            {provinces.map((item, index) => (
                                                <Select.Item label={item.label} value={item.value} key={index} />
                                            ))}
                                        </Select>
                                    </View>
                                    {formik.touched.province && formik.errors.province ? (
                                        <Text style={{ marginTop: 4, color: '#f22c27' }}>
                                            {t(formik.errors.province)}
                                        </Text>
                                    ) : null}
                                </View>
                                <View style={{ marginBottom: 16 }}>
                                    <Text style={styles.inputTitle}>{t('District')}</Text>

                                    <View>
                                        <Select
                                            selectedValue={formik.values.district}
                                            minWidth="200"
                                            accessibilityLabel="Choose district"
                                            placeholder={t('Choose district')}
                                            _selectedItem={{
                                                bg: 'teal.600',
                                                endIcon: <CheckIcon size="5" />,
                                            }}
                                            _light={{
                                                bg: '#fff',
                                                _hover: {
                                                    bg: '#fff',
                                                },
                                                _focus: {
                                                    bg: '#fff',
                                                },
                                            }}
                                            mt={1}
                                            onValueChange={(itemValue) => loadWardData(itemValue)}
                                        >
                                            {districts.map((item, index) => (
                                                <Select.Item label={item.label} value={item.value} key={index} />
                                            ))}
                                        </Select>
                                    </View>

                                    {formik.touched.district && formik.errors.district ? (
                                        <Text style={{ marginTop: 4, color: '#f22c27' }}>
                                            {t(formik.errors.district)}
                                        </Text>
                                    ) : null}
                                </View>
                                <View style={{ marginBottom: 16 }}>
                                    <Text style={styles.inputTitle}>{t('Ward')}</Text>

                                    <View>
                                        <Select
                                            selectedValue={formik.values.ward}
                                            minWidth="200"
                                            accessibilityLabel="Choose ward"
                                            placeholder={t('Choose ward')}
                                            _selectedItem={{
                                                bg: 'teal.600',
                                                endIcon: <CheckIcon size="5" />,
                                            }}
                                            _light={{
                                                bg: '#fff',
                                                _hover: {
                                                    bg: '#fff',
                                                },
                                                _focus: {
                                                    bg: '#fff',
                                                },
                                            }}
                                            mt={1}
                                            onValueChange={(itemValue) => formik.setFieldValue('ward', itemValue)}
                                        >
                                            {wards.map((item, index) => (
                                                <Select.Item label={item.label} value={item.value} key={index} />
                                            ))}
                                        </Select>
                                    </View>
                                    {formik.touched.ward && formik.errors.ward ? (
                                        <Text style={{ marginTop: 4, color: '#f22c27' }}>{t(formik.errors.ward)}</Text>
                                    ) : null}
                                </View>
                                <View style={{ marginBottom: 16 }}>
                                    <Text style={styles.inputTitle}>{t('Old Password')}</Text>
                                    <Input
                                        size="xl"
                                        placeholder={t('Old Password')}
                                        style={{ backgroundColor: '#fff', paddingVertical: 12 }}
                                        onChangeText={formik.handleChange('oldPassword')}
                                        onBlur={formik.handleBlur('oldPassword')}
                                        value={formik.values.oldPassword}
                                        type="password"
                                    />
                                    {formik.touched.oldPassword && formik.errors.oldPassword ? (
                                        <Text style={{ marginTop: 4, color: '#f22c27' }}>
                                            {t(formik.errors.oldPassword)}
                                        </Text>
                                    ) : null}
                                </View>
                                <View style={{ marginBottom: 16 }}>
                                    <Text style={styles.inputTitle}>{t('New Password')}</Text>
                                    <Input
                                        size="xl"
                                        placeholder={t('New Password')}
                                        style={{ backgroundColor: '#fff', paddingVertical: 12 }}
                                        onChangeText={formik.handleChange('newPassword')}
                                        onBlur={formik.handleBlur('newPassword')}
                                        value={formik.values.newPassword}
                                        type="password"
                                    />
                                    {formik.touched.newPassword && formik.errors.newPassword ? (
                                        <Text style={{ marginTop: 4, color: '#f22c27' }}>
                                            {t(formik.errors.newPassword)}
                                        </Text>
                                    ) : null}
                                </View>
                                <View style={{ marginBottom: 16 }}>
                                    <Text style={styles.inputTitle}>{t('Confirm Password')}</Text>
                                    <Input
                                        size="xl"
                                        placeholder={t('Confirm Password')}
                                        style={{ backgroundColor: '#fff', paddingVertical: 12 }}
                                        onChangeText={formik.handleChange('confirmPassword')}
                                        onBlur={formik.handleBlur('confirmPassword')}
                                        value={formik.values.confirmPassword}
                                        type="password"
                                    />
                                    {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                                        <Text style={{ marginTop: 4, color: '#f22c27' }}>
                                            {t(formik.errors.confirmPassword)}
                                        </Text>
                                    ) : null}
                                </View>
                                <View
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: '100%',
                                        marginBottom: 16,
                                    }}
                                >
                                    <Button
                                        alignSelf="center"
                                        style={{ width: '100%', paddingVertical: 12 }}
                                        bgColor="#4EE3AF"
                                        size="lg"
                                        onPress={formik.handleSubmit}
                                    >
                                        {t('Update')}
                                    </Button>
                                </View>
                            </NativeBaseProvider>
                        </View>
                    </View>
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        backgroundColor: '#081D49',
        height: '100%',
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    loadingTitle: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 20,
        lineHeight: 28,
        marginVertical: 8,
    },
    container: {
        backgroundColor: '#081D49',
        height: '100%',
        paddingHorizontal: 4,
    },
    infoContainer: {
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        flex: 1,
    },
    avatarContainer: {
        alignItems: 'center',
        borderBottomColor: '#b4b4b4',
        width: '100%',
        borderBottomWidth: 1,
        paddingBottom: 16,
        // borderStyle: 'solid',
    },
    avatarBorder: {
        borderWidth: 2,
        // borderStyle: 'solid',
        borderColor: '#fff',
        borderRadius: 9999,
        position: 'relative',
    },
    avatarStyle: {
        height: 128,
        width: 128,
        objectFit: 'cover',
        borderRadius: 9999,
        borderWidth: 2,
        // borderStyle: 'solid',
        borderColor: '#000000',
    },
    userTitle: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 30,
        lineHeight: 36,
        paddingTop: 24,
        paddingBottom: 4,
    },
    userEmail: {
        color: '#fff',
        fontWeight: '400',
        fontSize: 20,
        lineHeight: 28,
    },
    inputTitle: {
        color: '#fff',
        fontWeight: '500',
        marginBottom: 4,
    },
});
export default ProfileScreen;
