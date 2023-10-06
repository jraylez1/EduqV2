import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import React, { useLayoutEffect, useRef } from 'react';
import { NativeBaseProvider, Input, Icon, Button } from 'native-base';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Ionicons } from '@expo/vector-icons';
import i18next, { languageResources } from '../services/i18next';
import ReCaptchaV3 from '../components/reCaptcha/ReCaptchaV3';
import { AuthStore } from '../services/auth';
const UserScreen = () => {
    const [show, setShow] = React.useState(false);
    const navigation = useNavigation();
    const { t } = useTranslation();
    const recaptchaLogin = useRef();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);

    const validationSchema = Yup.object().shape({
        userName: Yup.string().required('Please enter your information'),
        password: Yup.string().required('Please enter your information'),
    });
    const formik = useFormik({
        initialValues: {
            userName: '',
            password: '',
        },
        validationSchema,
        onSubmit: async () => {
            try {
                await AuthStore.sendRecaptcha(recaptchaLogin);
            } catch (error) {
                console.log('error');
            }
        },
    });
    const onVerify = async (token) => {
        try {
            await AuthStore.login(
                {
                    ...formik.values,
                },
                token,
                navigation,
            );
        } catch (error) {
            console.error('Login error:', error);
        }
    };
    const goToSignupScreen = () => {
        navigation.navigate('SignUpScreen');
        formik.resetForm();
    };
    const goToForgotPasswordScreen = () => {
        navigation.navigate('ForgotPasswordScreen');
        formik.resetForm();
    };
    return (
        <SafeAreaView style={styles.container}>
            <NativeBaseProvider>
                <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
                    <AntDesign name="arrowleft" size={24} color="white" />
                </TouchableOpacity>
                <View style={{ marginVertical: 32 }}>
                    <Text style={styles.title}>{t('Hello')}</Text>
                    <Text style={styles.text}>{t('Welcome back')}</Text>
                </View>
                <View style={{ marginBottom: 16 }}>
                    <Input
                        size="xl"
                        placeholder="Email"
                        style={{ backgroundColor: '#fff' }}
                        onChangeText={formik.handleChange('userName')}
                        onBlur={formik.handleBlur('userName')}
                        value={formik.values.userName}
                    />
                    {formik.touched.userName && formik.errors.userName ? (
                        <Text style={{ marginTop: 4, color: '#F22C27' }}>{t(formik.errors.userName)}</Text>
                    ) : null}
                </View>
                <View>
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
                        <Text style={{ marginTop: 4, color: '#F22C27' }}>{t(formik.errors.userName)}</Text>
                    ) : null}
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'flex-end', marginTop: 16, width: '100%' }}>
                    <TouchableOpacity style={{ width: 'auto' }} onPress={() => goToForgotPasswordScreen()}>
                        <Text style={{ color: '#fff', fontSize: 18, lineHeight: 28 }}>{t('Forgot Password')}</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.loginBtnContainer}>
                    <Button size="lg" style={{ width: '100%' }} onPress={formik.handleSubmit}>
                        {t('Log In')}
                    </Button>
                </TouchableOpacity>
                <View style={styles.goToSignUpText}>
                    <Text style={{ color: '#fff', fontSize: 16, marginRight: 4 }}>
                        {t("Don't have an account yet?")}
                    </Text>
                    <TouchableOpacity onPress={() => goToSignupScreen()}>
                        <Text style={{ color: '#fff', fontSize: 16, textDecorationLine: 'underline' }}>
                            {t('Sign Up Now')}
                        </Text>
                    </TouchableOpacity>
                </View>
                <ReCaptchaV3 recaptchaRef={recaptchaLogin} onVerify={onVerify} />
            </NativeBaseProvider>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#081D49',
        height: '100%',
        paddingHorizontal: 16,
        paddingVertical: 48,
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
    loginBtnContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginTop: 16,
    },
    goToSignUpText: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginVertical: 16,
    },
});

export default UserScreen;
