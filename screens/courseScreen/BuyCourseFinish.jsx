import { View, Text, TouchableOpacity } from 'react-native';
import React, { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button, NativeBaseProvider, Icon } from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { CommonActions } from '@react-navigation/native';

const BuyCourseFinish = ({ route }) => {
    const data = route?.params?.data;
    const aliasUrl = route?.params?.aliasUrl;
    const navigation = useNavigation();
    const { t } = useTranslation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    const backToHome = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'BottomNavigation', params: { screen: 'HomeScreen' } }],
            }),
        );
    };

    return (
        <View style={{ paddingHorizontal: 16, flex: 1, backgroundColor: '#023468', paddingBottom: 48 }}>
            <NativeBaseProvider>
                <View
                    style={{
                        width: '100%',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: 'row',
                        zIndex: 50,
                        paddingVertical: 16,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => navigation.replace('BottomNavigation', { screen: 'HomeScreen' })}
                        style={{ padding: 8 }}
                    >
                        <AntDesign name="arrowleft" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={{ color: '#fff', fontWeight: '700', fontSize: 24, lineHeight: 28 }}>
                        {t('Notification')}
                    </Text>

                    <TouchableOpacity
                        style={{ position: 'relative' }}
                        onPress={() => navigation.navigate('ContactScreen')}
                    >
                        <AntDesign name="customerservice" size={24} color="white" />
                    </TouchableOpacity>
                </View>
                {data.error ? (
                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 32 }}>
                        <View>
                            <AntDesign name="closecircle" size={120} color="#76bb44" />
                        </View>
                        <Text
                            style={{
                                color: '#fff',
                                fontWeight: '700',
                                fontSize: 20,
                                lineHeight: 28,
                                marginVertical: 16,
                            }}
                        >
                            {t('Order placement failed')}
                        </Text>
                        <Text
                            style={{
                                color: '#fff',
                                fontWeight: '700',
                                fontSize: 18,
                                lineHeight: 28,
                                textAlign: 'center',
                            }}
                        >
                            {data.message}
                        </Text>

                        <Button
                            alignSelf="center"
                            leftIcon={<Icon as={AntDesign} name="home" size="md" />}
                            style={{ height: 48, marginTop: 16, width: '50%' }}
                            onPress={() => backToHome()}
                        >
                            {t('Back to homepage')}
                        </Button>
                    </View>
                ) : (
                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 32 }}>
                        <View>
                            <AntDesign name="checkcircle" size={120} color="#76bb44" />
                        </View>
                        <Text
                            style={{
                                color: '#fff',
                                fontWeight: '700',
                                fontSize: 20,
                                lineHeight: 28,
                                marginVertical: 16,
                            }}
                        >
                            {t('Order payment successful')}
                        </Text>
                        <Text
                            style={{
                                color: '#fff',
                                fontWeight: '700',
                                fontSize: 18,
                                lineHeight: 28,
                                textAlign: 'center',
                            }}
                        >
                            {data.message}
                        </Text>

                        <Button
                            alignSelf="center"
                            leftIcon={<Icon as={AntDesign} name="left" size="md" />}
                            style={{ height: 48, marginTop: 16, width: '50%' }}
                            onPress={() => backToHome()}
                        >
                            {t('Back to homepage')}
                        </Button>
                    </View>
                )}
            </NativeBaseProvider>
        </View>
    );
};

export default BuyCourseFinish;
