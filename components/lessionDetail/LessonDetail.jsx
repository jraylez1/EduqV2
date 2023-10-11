import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { CourseStore } from '../../services/course';
import { AuthStore } from '../../services/auth';

const LessonDetail = ({ data, navigation }) => {
    const { t } = useTranslation();

    const goToBuyCourse = async () => {
        if (AuthStore.isLoggedIn) {
            const buyInfo = await CourseStore.getProductPackages(data.extendData.course.aliasUrl);
            navigation.navigate('BuyCourse', { data: buyInfo });
        } else {
            navigation.navigate('UserScreen');
        }
    };

    return (
        <View>
            <Text style={{ color: '#fff', fontSize: 18, lineHeight: 28 }}>
                {data.extendData.course.name} - {data.extendData.studyRoute.name}
            </Text>
            <Text style={{ color: '#fff', fontSize: 24, lineHeight: 28, fontWeight: '700', marginTop: 8 }}>
                {data.name}
            </Text>
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    padding: 16,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#2e72ad',
                    width: '60%',
                    marginTop: 16,
                    borderRadius: 6,
                }}
                onPress={() => goToBuyCourse()}
            >
                <FontAwesome5 name="cart-plus" size={24} color="#fff" />
                <Text style={{ color: '#fff', fontSize: 18, lineHeight: 28, marginLeft: 8 }}>
                    {t('Buy this course')}
                </Text>
            </TouchableOpacity>
            <Image
                source={{ uri: data.coverUrl }}
                style={{
                    height: 200,
                    width: '100%',
                    marginTop: 16,
                    borderTopLeftRadius: 6,
                    borderTopRightRadius: 6,
                }}
            />
            <View
                style={{
                    backgroundColor: '#fffcea',
                    padding: 8,
                    borderBottomLeftRadius: 6,
                    borderBottomRightRadius: 6,
                }}
            >
                <Text style={{ fontSize: 24, lineHeight: 28, fontWeight: '700' }}>{t('Description')}</Text>
                <Text style={{ fontSize: 18, textAlign: 'justify', marginTop: 4 }}>{data.description}</Text>
            </View>
        </View>
    );
};

export default LessonDetail;
