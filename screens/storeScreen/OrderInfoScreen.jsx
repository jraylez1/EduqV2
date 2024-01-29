import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import React, { useLayoutEffect, useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, NativeBaseProvider, Modal, Input, Select, CheckIcon } from 'native-base';
import { useTranslation } from 'react-i18next';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { LocationStore } from '../../services/location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartStore } from '../../services/cart';
import ReCaptchaV3 from '../../components/reCaptcha/ReCaptchaV3';
import { AuthStore } from '../../services/auth';
import { Domain } from '@env';

const OrderInfoScreen = ({ route }) => {
    const { t } = useTranslation();
    const data = route?.params?.data;
    const navigation = useNavigation();
    const recaptchaOrder = useRef();

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [cartData, setCartData] = useState([]);
    const isFocused = useIsFocused();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: 'Order',
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: '#023468',
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

    useEffect(() => {
        if (isFocused) {
            loadProvince();
            loadCartData();
            setInformation();
        }
    }, [isFocused]);

    const loadCartData = async () => {
        const data = await AsyncStorage.getItem('cart-store');
        setCartData(JSON.parse(data));
        if (JSON.parse(data).length > 0) {
            const cartDataItems = await CartStore.getCartProducts(JSON.parse(data));
            setCartItems(cartDataItems);
        }
    };

    const loadProvince = async () => {
        const provincesData = await LocationStore.findProvince();
        setProvinces(provincesData);
        if (data && data.province !== '' && data.district !== '') {
            const districtsData = await LocationStore.findDistrict(data.province);
            setDistricts(districtsData);
            const wardsData = await LocationStore.findWard(data.district);
            setWards(wardsData);
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
    });

    const setInformation = () => {
        const isLoggedIn = AuthStore.isLoggedIn();
        if (isLoggedIn && data) {
            formik.setValues({
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                email: data.email || '',
                mobile: data.mobile || '',
                address: data.address || '',
                province: data.province || '',
                district: data.district || '',
                ward: data.ward || '',
            });
        }
    };

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
        },
        validationSchema,
        onSubmit: async () => {
            try {
                setModalVisible(true);
            } catch (error) {
                console.log('error');
            }
        },
    });

    const paymentOrder = async () => {
        const paymentOrder = await CartStore.sendRecaptcha(recaptchaOrder);
        setModalVisible(false);
    };

    const onVerify = async (token) => {
        const response = await CartStore.buyProducts(
            {
                ...formik.values,
            },
            cartData,
            token,
        );
        if (response.error) {
            navigation.navigate('OrderFinishScreen', { data: response });
        } else {
            AsyncStorage.setItem('cart-store', JSON.stringify([]));
            navigation.navigate('OrderFinishScreen', { data: response });
        }
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

    const calculateTotalAmount = (cartItems) => {
        if (cartItems != null) {
            const totalAmount = cartItems.reduce((accumulator, currentItem) => {
                return accumulator + currentItem.amount;
            }, 0);

            return totalAmount;
        } else {
            return 0;
        }
    };
    const totalAmount = calculateTotalAmount(cartItems);

    return (
        <View style={{ backgroundColor: '#023468', height: '100%', paddingHorizontal: 16 }}>
            <Text style={{ color: '#fff', fontWeight: '500', fontSize: 24, lineHeight: 32, marginBottom: 8 }}>
                {t('Order Information')}
            </Text>
            <ScrollView style={{ height: '100%' }}>
                <NativeBaseProvider>
                    <View style={{ marginBottom: 16 }}>
                        <Text style={{ color: '#fff', fontWeight: '500', marginBottom: 4 }}>{t('First Name')}</Text>
                        <Input
                            size="xl"
                            placeholder={t('First Name')}
                            style={{ backgroundColor: '#fff', paddingVertical: 12 }}
                            onChangeText={formik.handleChange('firstName')}
                            onBlur={formik.handleBlur('firstName')}
                            value={formik.values.firstName}
                        />
                        {formik.touched.firstName && formik.errors.firstName ? (
                            <Text style={{ marginTop: 4, color: '#F22C27' }}>{t(formik.errors.firstName)}</Text>
                        ) : null}
                    </View>
                    <View style={{ marginBottom: 16 }}>
                        <Text style={{ color: '#fff', fontWeight: '500', marginBottom: 4 }}>{t('Last Name')}</Text>
                        <Input
                            size="xl"
                            placeholder={t('Last Name')}
                            style={{ backgroundColor: '#fff', paddingVertical: 12 }}
                            onChangeText={formik.handleChange('lastName')}
                            onBlur={formik.handleBlur('lastName')}
                            value={formik.values.lastName}
                        />
                        {formik.touched.lastName && formik.errors.lastName ? (
                            <Text style={{ marginTop: 4, color: '#F22C27' }}>{t(formik.errors.lastName)}</Text>
                        ) : null}
                    </View>
                    <View style={{ marginBottom: 16 }}>
                        <Text style={{ color: '#fff', fontWeight: '500', marginBottom: 4 }}>{t('Email')}</Text>
                        <Input
                            size="xl"
                            placeholder={t('Email')}
                            style={{ backgroundColor: '#fff', paddingVertical: 12 }}
                            onChangeText={formik.handleChange('email')}
                            onBlur={formik.handleBlur('email')}
                            value={formik.values.email}
                        />
                        {formik.touched.email && formik.errors.email ? (
                            <Text style={{ marginTop: 4, color: '#F22C27' }}>{t(formik.errors.email)}</Text>
                        ) : null}
                    </View>
                    <View style={{ marginBottom: 16 }}>
                        <Text style={{ color: '#fff', fontWeight: '500', marginBottom: 4 }}>{t('Phone Number')}</Text>
                        <Input
                            size="xl"
                            placeholder={t('Phone Number')}
                            style={{ backgroundColor: '#fff', paddingVertical: 12 }}
                            onChangeText={formik.handleChange('mobile')}
                            onBlur={formik.handleBlur('mobile')}
                            value={formik.values.mobile}
                        />
                        {formik.touched.mobile && formik.errors.mobile ? (
                            <Text style={{ marginTop: 4, color: '#F22C27' }}>{t(formik.errors.mobile)}</Text>
                        ) : null}
                    </View>
                    <View style={{ marginBottom: 16 }}>
                        <Text style={{ color: '#fff', fontWeight: '500', marginBottom: 4 }}>{t('Address')}</Text>
                        <Input
                            size="xl"
                            placeholder={t('Address')}
                            style={{ backgroundColor: '#fff', paddingVertical: 12 }}
                            onChangeText={formik.handleChange('address')}
                            onBlur={formik.handleBlur('address')}
                            value={formik.values.address}
                        />
                        {formik.touched.address && formik.errors.address ? (
                            <Text style={{ marginTop: 4, color: '#F22C27' }}>{t(formik.errors.address)}</Text>
                        ) : null}
                    </View>

                    <View style={{ marginBottom: 16 }}>
                        <Text style={{ color: '#fff', fontWeight: '500', marginBottom: 4 }}>{t('Province')}</Text>
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
                            <Text style={{ marginTop: 4, color: '#F22C27' }}>{t(formik.errors.province)}</Text>
                        ) : null}
                    </View>
                    <View style={{ marginBottom: 16 }}>
                        <Text style={{ color: '#fff', fontWeight: '500', marginBottom: 4 }}>{t('District')}</Text>
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
                            <Text style={{ marginTop: 4, color: '#F22C27' }}>{t(formik.errors.district)}</Text>
                        ) : null}
                    </View>
                    <View style={{ marginBottom: 16 }}>
                        <Text style={{ color: '#fff', fontWeight: '500', marginBottom: 4 }}>{t('Ward')}</Text>
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
                            <Text style={{ marginTop: 4, color: '#F22C27' }}>{t(formik.errors.ward)}</Text>
                        ) : null}
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: 16 }}>
                        <TouchableOpacity
                            style={{
                                width: '100%',
                                paddingVertical: 16,
                                backgroundColor: '#4EE3AF',
                                alignItems: 'center',
                                borderRadius: 6,
                            }}
                            onPress={formik.handleSubmit}
                        >
                            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}> {t('Order')}</Text>
                        </TouchableOpacity>
                    </View>
                    <ReCaptchaV3 recaptchaRef={recaptchaOrder} onVerify={onVerify} />
                    <Modal isOpen={modalVisible} onClose={setModalVisible} size={'xl'}>
                        <Modal.Content maxH="600">
                            <Modal.CloseButton />
                            <Modal.Header>{t('Payment orders')}</Modal.Header>
                            <Modal.Body>
                                <View>
                                    <Text style={{ fontWeight: '500', fontSize: 16 }}>
                                        {t('Are you sure you want to purchase the items in your cart?')}
                                    </Text>
                                    <ScrollView style={{ marginVertical: 8 }}>
                                        {cartItems.map((item, index) => (
                                            <View
                                                style={{
                                                    width: '100%',
                                                    flexDirection: 'row',
                                                    marginBottom: 8,
                                                    padding: 8,
                                                    backgroundColor: '#ccfbf1',
                                                    borderRadius: 6,
                                                }}
                                                key={index}
                                            >
                                                <View
                                                    style={{
                                                        borderWidth: 2,
                                                        borderStyle: 'solid',
                                                        borderRadius: 6,
                                                        marginRight: 16,
                                                    }}
                                                >
                                                    {item.thumbnailUrl?.length > 0 ? (
                                                        <Image
                                                            source={{ uri: Domain + item.thumbnailUrl }}
                                                            style={{
                                                                height: 80,
                                                                width: 80,
                                                                objectFit: 'cover',
                                                                borderRadius: 6,
                                                            }}
                                                        />
                                                    ) : (
                                                        <Image
                                                            source={{
                                                                uri: 'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg',
                                                            }}
                                                            style={{
                                                                height: 80,
                                                                width: 80,
                                                                objectFit: 'cover',
                                                                borderRadius: 6,
                                                            }}
                                                        />
                                                    )}
                                                </View>
                                                <View style={{ width: '65%' }}>
                                                    <Text
                                                        numberOfLines={1}
                                                        style={{ fontWeight: '700', fontSize: 16, color: '#023468' }}
                                                    >
                                                        {item.name}
                                                    </Text>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text
                                                            style={{
                                                                fontWeight: '700',
                                                                fontSize: 16,
                                                                color: '#023468',
                                                                marginRight: 8,
                                                            }}
                                                        >
                                                            {t('Quantity') + ':'}
                                                        </Text>
                                                        <Text
                                                            style={{
                                                                fontWeight: '700',
                                                                fontSize: 16,
                                                                color: '#023468',
                                                            }}
                                                        >
                                                            {item.quantity}
                                                        </Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text
                                                            style={{
                                                                fontWeight: '700',
                                                                fontSize: 16,
                                                                color: '#023468',
                                                                marginRight: 8,
                                                            }}
                                                        >
                                                            {t('Amount') + ':'}
                                                        </Text>
                                                        <Text
                                                            style={{
                                                                fontWeight: '700',
                                                                fontSize: 16,
                                                                color: '#023468',
                                                            }}
                                                        >
                                                            {item.priceSetting.sellingPrice != 0
                                                                ? item.priceSetting.sellingPrice.toLocaleString(
                                                                      'vi-VN',
                                                                      {
                                                                          style: 'currency',
                                                                          currency: 'VND',
                                                                      },
                                                                  )
                                                                : t('Free')}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        ))}
                                    </ScrollView>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            padding: 8,
                                            backgroundColor: '#06b6d4',
                                            marginBottom: 8,
                                            borderBottomRightRadius: 6,
                                            borderBottomLeftRadius: 6,
                                        }}
                                    >
                                        <Text
                                            style={{ color: '#fff', fontWeight: 'bold', fontSize: 20, lineHeight: 28 }}
                                        >
                                            {t('Total Amount:')}
                                        </Text>
                                        <Text
                                            style={{ color: '#fff', fontWeight: 'bold', fontSize: 20, lineHeight: 28 }}
                                        >
                                            {totalAmount.toLocaleString('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND',
                                            })}
                                        </Text>
                                    </View>
                                </View>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button.Group space={2}>
                                    <Button
                                        variant="ghost"
                                        colorScheme="blueGray"
                                        onPress={() => {
                                            setModalVisible(false);
                                        }}
                                    >
                                        {t('Cancel')}
                                    </Button>
                                    <Button
                                        onPress={() => {
                                            paymentOrder();
                                        }}
                                    >
                                        {t('Agree')}
                                    </Button>
                                </Button.Group>
                            </Modal.Footer>
                        </Modal.Content>
                    </Modal>
                </NativeBaseProvider>
            </ScrollView>
        </View>
    );
};

export default OrderInfoScreen;
