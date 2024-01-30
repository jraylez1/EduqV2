import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useLayoutEffect } from 'react';
import { pronunciation } from '../../assets';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { AuthStore } from '../../services/auth';
import { CourseStore } from '../../services/course';
import { setHeaderOptions } from '../../assets/utils/setHeaderOptions ';

const QTestScreen = ({ route }) => {
    const data = route?.params?.data;
    const navigation = useNavigation();
    const { t } = useTranslation();

    useLayoutEffect(() => {
        const headerTitle = data.name;
        setHeaderOptions({ navigation, headerTitle });
    }, []);

    const goToBuyCourseScreen = async () => {
        const isLoggedIn = await AuthStore.isLoggedIn();
        const buyInfo = await CourseStore.getProductPackages(data.aliasUrl);
        if (isLoggedIn) {
            navigation.navigate('BuyCourse', { data: buyInfo });
        } else {
            navigation.navigate('UserScreen', {
                backScreen: 'QTestScreen',
                aliasUrl: data.aliasUrl,
            });
        }
    };

    const goToAccentScreen = async () => {
        const isLoggedIn = await AuthStore.isLoggedIn();
        if (isLoggedIn) {
            navigation.navigate('ChooseAccentScreen', { data: data });
        } else {
            alert('Bạn cần thực hiện đăng nhập trước khi vào học');
            navigation.navigate('UserScreen', {
                backScreen: 'HomeScreen',
            });
        }
    };

    return (
        <View style={{ backgroundColor: '#023468', flex: 1, paddingTop: 40, alignItems: 'center' }}>
            <Text style={{ color: '#fff', marginBottom: 16, fontSize: 24, fontWeight: 'bold' }}>
                {t('EXPLORER FEATURE')}
            </Text>

            <View style={{ width: '100%', height: '100%', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => goToAccentScreen()} style={{ width: '100%', alignItems: 'center' }}>
                    <Image
                        source={pronunciation}
                        style={{ width: '90%', height: 240, objectFit: 'cover', borderRadius: 12 }}
                    />
                </TouchableOpacity>

                <View>
                    {data?.isOwner ? (
                        <></>
                    ) : (
                        <View style={{ marginTop: 20, paddingHorizontal: 8 }}>
                            <Text
                                style={{
                                    textAlign: 'center',
                                    fontSize: 18,
                                    color: '#fe4a55',
                                    textTransform: 'uppercase',
                                    fontWeight: '600',
                                    marginBottom: 8,
                                }}
                            >
                                HỌC THEO CÁCH RIÊNG CỦA BẠN
                            </Text>
                            <Text
                                style={{
                                    textAlign: 'center',
                                    fontSize: 18,
                                    color: '#fff',
                                    textTransform: 'uppercase',
                                    fontWeight: '800',
                                    marginBottom: 8,
                                }}
                            >
                                Tham gia khóa học không giới hạn
                            </Text>
                            <Text
                                style={{
                                    textAlign: 'center',
                                    fontSize: 16,
                                    color: '#fff',
                                    marginBottom: 16,
                                }}
                            >
                                Nội dung bài học được cập nhật thường xuyên với hàng ngàn chủ để khác nhau đầy thú vị.
                            </Text>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: '#c45840',
                                        width: '70%',
                                        borderRadius: 4,
                                        paddingVertical: 16,
                                        paddingHorizontal: 12,
                                    }}
                                    onPress={() => goToBuyCourseScreen()}
                                >
                                    <Text
                                        style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', color: '#fff' }}
                                    >
                                        Đăng ký khoá học ngay
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
};

export default QTestScreen;
