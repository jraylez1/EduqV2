import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import React, { useState, useLayoutEffect, useEffect } from 'react';
import { AuthStore } from '../../services/auth';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { NativeBaseProvider, Button, Center, Modal } from 'native-base';
import i18next from '../../services/i18next';
import { vietnamflag, englandFlag } from '../../assets';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

const UserInforScreen = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const [showModalLogout, setShowModalLogout] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isChange, setIsChange] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);

    useEffect(() => {
        getUserInfo();
    }, []);

    const handleLogout = () => {
        setShowModalLogout(false);
        AuthStore.logout(navigation);
    };
    const changeLng = () => {
        setIsChange(!isChange);
        if (isChange) {
            i18next.changeLanguage('en');
        } else {
            i18next.changeLanguage('vn');
        }
    };

    const getUserInfo = async () => {
        const userInfo = await AuthStore.getProfile(navigation);
        if (userInfo != null) {
            setUserData(userInfo);
        } else {
            AuthStore.logout(navigation);
        }
    };

    const goToProfileScreen = () => {
        navigation.navigate('ProfileScreen', { data: userData });
    };
    return (
        <SafeAreaView style={styles.container}>
            <NativeBaseProvider>
                <View style={styles.personInfoContainer}>
                    <Text style={styles.personInfoTitle}>{t('Personal information')}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={{ marginRight: 16 }} onPress={() => goToProfileScreen()}>
                            <AntDesign name="user" size={24} color="white" />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setShowModalLogout(true)}>
                            <AntDesign name="logout" size={24} color="white" />
                        </TouchableOpacity>
                        <Center>
                            <Modal isOpen={showModalLogout} onClose={() => setShowModalLogout(false)}>
                                <Modal.Content maxWidth="400px">
                                    <Modal.CloseButton />
                                    <Modal.Header>{t('Log Out of Account')}</Modal.Header>
                                    <Modal.Body>
                                        <Text style={{ textAlign: 'justify' }}>
                                            {t('Do you want to log out of this account?')}
                                        </Text>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button.Group space={2}>
                                            <Button
                                                variant="ghost"
                                                colorScheme="blueGray"
                                                onPress={() => {
                                                    setShowModalLogout(false);
                                                }}
                                            >
                                                {t('No')}
                                            </Button>
                                            <Button onPress={() => handleLogout()}>{t('Log Out')}</Button>
                                        </Button.Group>
                                    </Modal.Footer>
                                </Modal.Content>
                            </Modal>
                        </Center>
                    </View>
                </View>

                <View style={{ flexDirection: 'column' }}>
                    {userData ? (
                        <>
                            <View
                                style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                            >
                                <TouchableOpacity
                                    style={{ flexDirection: 'row', marginBottom: 32 }}
                                    onPress={() => goToProfileScreen()}
                                >
                                    {userData.avatarUrl.length > 0 ? (
                                        <Image source={{ uri: userData.avatarUrl }} style={styles.personAvatar} />
                                    ) : (
                                        <Image
                                            source={{
                                                uri: 'https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png',
                                            }}
                                            style={styles.personAvatar}
                                        />
                                    )}
                                    <View>
                                        <Text
                                            style={{ color: '#fff', fontWeight: '700', fontSize: 20, lineHeight: 28 }}
                                        >
                                            {userData.lastName + ' ' + userData.firstName}
                                        </Text>
                                        <Text
                                            style={{ color: '#fff', fontWeight: '400', fontSize: 18, lineHeight: 28 }}
                                        >
                                            {userData.email}
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => changeLng()} style={{ marginBottom: 32 }}>
                                    {isChange ? (
                                        <Image source={vietnamflag} style={styles.langImg} />
                                    ) : (
                                        <Image source={englandFlag} style={styles.langImg} />
                                    )}
                                </TouchableOpacity>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <TouchableOpacity
                                    style={styles.userInfoContainer}
                                    onPress={() => navigation.navigate('TransactionScreen')}
                                >
                                    <AntDesign name="swap" size={24} color="white" />
                                    <Text style={{ color: '#fff', fontSize: 20, lineHeight: 28, marginTop: 8 }}>
                                        {t('Transaction')}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.userInfoContainer}
                                    onPress={() => navigation.navigate('AchievementsScreen')}
                                >
                                    <MaterialCommunityIcons name="archive-check-outline" size={24} color="white" />
                                    <Text style={{ color: '#fff', fontSize: 20, lineHeight: 28, marginTop: 8 }}>
                                        {t('Achievement')}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    ) : (
                        <Text>Loading user data...</Text>
                    )}
                </View>
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
    personInfoContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginVertical: 16,
    },
    personInfoTitle: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 24,
        lineHeight: 32,
    },
    personAvatar: {
        height: 56,
        width: 56,
        objectFit: 'cover',
        borderRadius: 9999,
        backgroundColor: '#fff',
        marginRight: 16,
    },
    langImg: {
        height: 48,
        width: 48,
        objectFit: 'cover',
        borderRadius: 12,
        marginRight: 16,
    },
    userInfoContainer: {
        width: '48%',
        backgroundColor: '#1976D2',
        padding: 16,
        borderRadius: 8,
    },
});
export default UserInforScreen;
