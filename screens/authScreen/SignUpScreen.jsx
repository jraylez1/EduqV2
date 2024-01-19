import { View, Text, SafeAreaView, TouchableOpacity, Pressable, StyleSheet } from 'react-native';
import React, { useLayoutEffect, useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Input, NativeBaseProvider, Button, Icon } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import ReCaptchaV3 from '../../components/reCaptcha/ReCaptchaV3';
import { AuthStore } from '../../services/auth';

const SignUpScreen = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const [show, setShow] = React.useState(false);
    const recaptchaRegister = useRef();
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: '',
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: '#023468',
            },
            headerTintColor: '#fff',
        });
    }, []);

    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required('Please enter your information'),
        lastName: Yup.string().required('Please enter your information'),
        mobile: Yup.number('Phone number should not include characters.')
            .required('Please enter your information')
            .positive('The phone number must be a positive number')
            .integer('Số điện thoại phải là số nguyên'),
        email: Yup.string().email('Invalid Email Address').required('Please enter your information'),
        password: Yup.string().required('Please enter your information'),
    });

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            mobile: '',
            password: '',
        },
        validationSchema,
        onSubmit: async () => {
            try {
                await AuthStore.sendRecaptcha(recaptchaRegister);
            } catch (error) {
                console.log('error');
            }
        },
    });
    const onVerify = (token) => {
        AuthStore.register(
            {
                ...formik.values,
            },
            token,
            navigation,
        );
    };

    const goToLoginScreen = () => {
        navigation.replace('BottomNavigation', { screen: 'UserScreen' });
        formik.resetForm();
    };
    return (
        <View style={styles.container}>
            <NativeBaseProvider>
                <View style={{ marginBottom: 16 }}>
                    <Text style={styles.title}>{t('Register')}</Text>
                    <Text style={styles.text}>{t('To fully experience all the courses')}</Text>
                </View>
                <View style={{ marginBottom: 16 }}>
                    <Input
                        size="xl"
                        placeholder={t('First Name')}
                        style={{ backgroundColor: '#fff' }}
                        onChangeText={formik.handleChange('firstName')}
                        onBlur={formik.handleBlur('firstName')}
                        value={formik.values.firstName}
                    />
                    {formik.touched.firstName && formik.errors.firstName ? (
                        <Text style={{ marginTop: 4, color: '#F22C27' }}>{t(formik.errors.firstName)}</Text>
                    ) : null}
                </View>
                <View style={{ marginBottom: 16 }}>
                    <Input
                        size="xl"
                        placeholder={t('Last Name')}
                        style={{ backgroundColor: '#fff' }}
                        onChangeText={formik.handleChange('lastName')}
                        onBlur={formik.handleBlur('lastName')}
                        value={formik.values.lastName}
                    />
                    {formik.touched.lastName && formik.errors.lastName ? (
                        <Text style={{ marginTop: 4, color: '#F22C27' }}>{t(formik.errors.lastName)}</Text>
                    ) : null}
                </View>
                <View style={{ marginBottom: 16 }}>
                    <Input
                        size="xl"
                        placeholder={t('Phone Number')}
                        style={{ backgroundColor: '#fff' }}
                        onChangeText={formik.handleChange('mobile')}
                        onBlur={formik.handleBlur('mobile')}
                        value={formik.values.mobile}
                    />
                    {formik.touched.mobile && formik.errors.mobile ? (
                        <Text style={{ marginTop: 4, color: '#F22C27' }}>{t(formik.errors.mobile)}</Text>
                    ) : null}
                </View>
                <View style={{ marginBottom: 16 }}>
                    <Input
                        size="xl"
                        placeholder="Email"
                        style={{ backgroundColor: '#fff' }}
                        onChangeText={formik.handleChange('email')}
                        onBlur={formik.handleBlur('email')}
                        value={formik.values.email}
                    />
                    {formik.touched.email && formik.errors.email ? (
                        <Text style={{ marginTop: 4, color: '#F22C27' }}>{t(formik.errors.email)}</Text>
                    ) : null}
                </View>
                <View style={{ marginBottom: 16 }}>
                    <Input
                        size="xl"
                        placeholder={t('Password')}
                        style={{ backgroundColor: '#fff' }}
                        type={show ? 'text' : 'password'}
                        InputRightElement={
                            <Pressable onPress={() => setShow(!show)} style={styles.passwordIcon}>
                                <Icon
                                    as={<Ionicons name={show ? 'md-eye' : 'md-eye-off'} />}
                                    size={5}
                                    mr="2"
                                    color="muted.400"
                                />
                            </Pressable>
                        }
                        onChangeText={formik.handleChange('password')}
                        onBlur={formik.handleBlur('password')}
                        value={formik.values.password}
                    />
                    {formik.touched.password && formik.errors.password ? (
                        <Text style={{ marginTop: 4, color: '#F22C27' }}>{t(formik.errors.password)}</Text>
                    ) : null}
                </View>
                <TouchableOpacity style={styles.RegisterBtnContainer}>
                    <Button size="lg" style={{ width: '100%' }} onPress={formik.handleSubmit}>
                        {t('Register')}
                    </Button>
                </TouchableOpacity>

                <View style={styles.goToLoginText}>
                    <Text style={{ color: '#fff', fontSize: 16, marginRight: 4 }}>{t('Already have an account?')}</Text>
                    <TouchableOpacity onPress={goToLoginScreen}>
                        <Text style={{ color: '#fff', fontSize: 16, textDecorationLine: 'underline' }}>
                            {t('Log in now')}
                        </Text>
                    </TouchableOpacity>
                </View>
                <ReCaptchaV3 recaptchaRef={recaptchaRegister} onVerify={onVerify} />
            </NativeBaseProvider>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#023468',
        height: '100%',
        paddingHorizontal: 16,
    },
    title: {
        color: '#fff',
        fontWeight: '400',
        fontSize: 36,
        lineHeight: 40,
    },
    text: {
        color: '#fff',
        fontWeight: '300',
        fontSize: 24,
        lineHeight: 32,
    },
    passwordIcon: {
        backgroundColor: '#fff',
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    RegisterBtnContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginTop: 16,
    },
    goToLoginText: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginVertical: 16,
    },
});
export default SignUpScreen;
