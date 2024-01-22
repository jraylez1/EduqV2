import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useLayoutEffect } from 'react';
import { pronunciation } from '../../assets';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthStore } from '../../services/auth';
const QTestScreen = ({ route }) => {
    const data = route?.params?.data;
    const navigation = useNavigation();
    const { t } = useTranslation();

    useLayoutEffect(() => {
        const setHeaderOptions = async () => {
            const avatarUrl = await AsyncStorage.getItem('avatarUrl');
            const isLoggedIn = await AuthStore.isLoggedIn();
            navigation.setOptions({
                headerTitle: data.name,
                headerTitleAlign: 'center',
                headerStyle: {
                    backgroundColor: '#023468',
                },
                headerTintColor: '#fff',
                headerRight: () => {
                    return (
                        <>
                            {isLoggedIn ? (
                                <TouchableOpacity onPress={() => navigation.navigate('UserInforScreen')}>
                                    <Image
                                        source={{
                                            uri:
                                                avatarUrl && avatarUrl !== ''
                                                    ? avatarUrl
                                                    : 'https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png',
                                        }}
                                        style={{
                                            objectFit: 'cover',
                                            width: 40,
                                            height: 40,
                                            borderRadius: 800,
                                            backgroundColor: 'white',
                                        }}
                                    />
                                </TouchableOpacity>
                            ) : (
                                <AntDesign
                                    name="customerservice"
                                    size={24}
                                    color="white"
                                    onPress={() => navigation.navigate('ContactScreen')}
                                />
                            )}
                        </>
                    );
                },
            });
        };

        setHeaderOptions();
    }, []);
    return (
        <View style={{ backgroundColor: '#023468', flex: 1, paddingTop: 40, alignItems: 'center' }}>
            <Text style={{ color: '#fff', marginBottom: 16, fontSize: 24, fontWeight: 'bold' }}>
                {t('EXPLORER FEATURE')}
            </Text>

            <View style={{ width: '100%', height: '100%', alignItems: 'center' }}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('ChooseAccentScreen', { data: data })}
                    style={{ width: '100%', alignItems: 'center' }}
                >
                    <Image
                        source={pronunciation}
                        style={{ width: '90%', height: 240, objectFit: 'cover', borderRadius: 12 }}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default QTestScreen;
