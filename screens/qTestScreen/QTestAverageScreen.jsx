import { View, Text, ScrollView } from 'react-native';
import React, { useState, useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Button, NativeBaseProvider, Icon } from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import { CourseStore } from '../../services/course';

const QTestAverageScreen = ({ route }) => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const [data, setData] = useState(route?.params?.data);
    const aliasUrl = route?.params?.aliasUrl;
    const idStudyRoute = route?.params?.idStudyRoute;
    const accent = route?.params?.accent;
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: t('Report'),
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: '#081D49',
            },
            headerTintColor: '#fff',
        });
    }, [navigation]);

    const goToQtestQuestion = async () => {
        const examQuestion = await CourseStore.qTestQuestions(0, true, idStudyRoute, aliasUrl);
        console.log(examQuestion);
        navigation.navigate('QTestQuestionScreen', {
            data: examQuestion,
            accent: accent,
        });
    };
    return (
        <View
            style={{
                backgroundColor: '#eff6ff',
                height: '100%',
                padding: 8,
                flex: 1,
                width: '100%',
                position: 'relative',
            }}
        >
            <ScrollView style={{ width: '100%', marginBottom: 120 }}>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{t('Average Score')}</Text>
                    <View
                        style={{
                            height: 160,
                            width: 160,
                            borderWidth: 14,
                            borderColor: '#3ca09e',
                            borderRadius: 9999,
                            padding: 16,
                            marginVertical: 16,
                            alignItems: 'center',
                            justifyContent: 'center',
                            display: 'flex',
                            flexDirection: 'row',
                        }}
                    >
                        <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#3e9c9b' }}>{data.result.score}</Text>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#3e9c9b', marginTop: 20 }}>
                            /{data.result.maxScore}
                        </Text>
                    </View>
                </View>
                <View style={{ width: '100%', paddingHorizontal: 16 }}>
                    {data.questions.map((item, index) => (
                        <View
                            key={index}
                            style={{
                                borderBottomColor: '#cccccc',
                                borderBottomWidth: 2,
                                borderStyle: 'solid',
                                paddingVertical: 8,
                            }}
                        >
                            <Text style={{ fontSize: 18, fontWeight: '500' }}>
                                {t('Question')} {index + 1}
                            </Text>
                            <Text style={{ fontSize: 20, fontWeight: '500', marginVertical: 4, textAlign: 'justify' }}>
                                Question content:{' '}
                                <Text style={{ color: 'black', fontWeight: '400', fontSize: 16 }}>
                                    {item.questionContent}
                                </Text>
                            </Text>
                            <Text style={{ fontSize: 20, fontWeight: '500', marginVertical: 4, textAlign: 'justify' }}>
                                Explain:{' '}
                                <Text style={{ color: 'black', fontWeight: '400', fontSize: 16 }}>{item.explain}</Text>
                            </Text>
                            {item.data.ipa ? (
                                <Text
                                    style={{ fontSize: 20, fontWeight: '500', marginVertical: 4, textAlign: 'justify' }}
                                >
                                    IPA:{' '}
                                    <Text style={{ color: '#dc3545', fontWeight: '400', fontSize: 16 }}>
                                        {item.data.ipa}
                                    </Text>
                                </Text>
                            ) : (
                                <></>
                            )}
                            <View style={{ width: '100%' }}>
                                <Text style={{ fontSize: 20, fontWeight: '600', textAlign: 'right' }}>
                                    {t('Pronunciation point')}
                                </Text>
                                <Text style={{ fontSize: 20, fontWeight: '600', textAlign: 'right', color: '#3e9c9b' }}>
                                    {item.result.score}/{item.result.maxScore}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
            <View style={{ position: 'absolute', bottom: 8, left: 8, right: 8 }}>
                <NativeBaseProvider>
                    <Button
                        alignSelf="center"
                        leftIcon={<Icon as={AntDesign} name="retweet" size="md" />}
                        style={{ height: 48, marginTop: 8, width: '100%' }}
                        onPress={() => goToQtestQuestion()}
                    >
                        {t('Re-do Questions')}
                    </Button>
                    <Button
                        alignSelf="center"
                        leftIcon={<Icon as={AntDesign} name="home" size="md" />}
                        style={{ height: 48, marginTop: 8, width: '100%' }}
                        onPress={() => navigation.replace('BottomNavigation', { screen: 'HomeScreen' })}
                    >
                        {t('Back to homepage')}
                    </Button>
                </NativeBaseProvider>
            </View>
        </View>
    );
};

export default QTestAverageScreen;
