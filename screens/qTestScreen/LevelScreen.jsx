import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import React, { useLayoutEffect, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { CourseStore } from '../../services/course';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthStore } from '../../services/auth';
const LevelScreen = ({ route }) => {
    const data = route?.params?.data;
    const [accent, setAccent] = useState(route?.params?.accent);
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

    const goToQtestQuestion = async (idStudyRoute) => {
        const examQuestion = await CourseStore.qTestQuestions(0, true, idStudyRoute, data.aliasUrl);
        if (examQuestion.result) {
            navigation.navigate('QTestAverageScreen', {
                data: examQuestion,
                aliasUrl: examQuestion.extendData.course.aliasUrl,
                idStudyRoute: examQuestion.extendData.studyRoute.id,
                accent: accent,
            });
        } else {
            navigation.navigate('QTestQuestionScreen', {
                data: examQuestion,
                accent: accent,
                idCourse: data.id,
            });
        }
    };

    return (
        <View style={{ backgroundColor: '#023468', flex: 1, paddingTop: 20, alignItems: 'center' }}>
            <Text style={{ color: '#fff', marginBottom: 16, fontSize: 24, fontWeight: 'bold' }}>{t('LEVEL')}</Text>
            {data?.studyRoutes.map((studyRoute, index) => (
                <TouchableOpacity
                    style={{ width: '100%', height: 'auto', alignItems: 'center' }}
                    onPress={() => goToQtestQuestion(studyRoute.id)}
                    key={index}
                >
                    <View
                        style={{
                            width: '90%',
                            height: 200,
                            paddingTop: 50,
                            backgroundColor: '#808080',
                            borderRadius: 12,
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ color: '#fff', fontSize: 28, fontWeight: 'bold' }}>{studyRoute.name}</Text>
                        <Text style={{ color: '#fff', fontSize: 28, fontWeight: 'bold' }}>{studyRoute.subName}</Text>
                    </View>
                    <View
                        style={{
                            backgroundColor: '#4da09f',
                            padding: 16,
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '70%',
                            borderRadius: 12,
                            transform: [{ translateY: -40 }],
                        }}
                    >
                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 24 }}>
                            {studyRoute.description}
                        </Text>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default LevelScreen;
