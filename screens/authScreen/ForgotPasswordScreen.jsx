import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useLayoutEffect, useRef } from 'react';
import { Input, NativeBaseProvider, Button } from 'native-base';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { AuthStore } from '../../services/auth';
import ReCaptchaV3 from '../../components/reCaptcha/ReCaptchaV3';

const ForgotPasswordScreen = () => {
    const recaptchaForgotPassword = useRef();
    const { t } = useTranslation();
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: '',
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: '#081D49',
            },
            headerTintColor: '#fff',
        });
    }, []);
    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid Email Address').required('Please enter your information'),
    });
    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema,
        onSubmit: async () => {
            try {
                await AuthStore.sendRecaptcha(recaptchaForgotPassword);
            } catch (error) {
                console.log('error');
            }
        },
    });
    const onVerify = async (token) => {
        try {
            await AuthStore.recoveryPassword(
                {
                    ...formik.values,
                },
                token,
                navigation,
            );
        } catch (error) {
            console.error('Recovery password error:', error);
        }
    };
    return (
        <SafeAreaView style={styles.container}>
            <NativeBaseProvider>
                <View style={{ marginVertical: 32 }}>
                    <Text style={styles.title}>{t('Forgot Password')}</Text>
                    <Text style={styles.text}>{t('Reset Password for Your Account')}</Text>
                </View>
                <View style={{ marginVertical: 16 }}>
                    <Input
                        size="xl"
                        placeholder={t('Registered Email Address')}
                        style={{ backgroundColor: '#fff' }}
                        onChangeText={formik.handleChange('email')}
                        onBlur={formik.handleBlur('email')}
                        value={formik.values.email}
                    />
                    {formik.touched.email && formik.errors.email ? (
                        <Text style={{ marginTop: 4, color: '#F22C27' }}>{t(formik.errors.email)}</Text>
                    ) : null}
                </View>
                <TouchableOpacity
                    style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 16 }}
                >
                    <Button size="lg" style={{ width: '100%' }} onPress={formik.handleSubmit}>
                        {t('Reset Password')}
                    </Button>
                </TouchableOpacity>
                <ReCaptchaV3 recaptchaRef={recaptchaForgotPassword} onVerify={onVerify} />
            </NativeBaseProvider>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#081D49',
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
});

export default ForgotPasswordScreen;
