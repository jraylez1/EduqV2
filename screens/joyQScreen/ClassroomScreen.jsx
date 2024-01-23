import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthStore } from '../../services/auth';
import { CourseStore } from '../../services/course';
import { noImage } from '../../assets';
import { Domain } from '@env';
import { Entypo } from '@expo/vector-icons';

const ClassroomScreen = ({ route }) => {
    const name = route?.params?.name;
    const aliasUrl = route?.params?.aliasUrl;
    const idStudyRoute = route?.params?.idStudyRoute;
    const studyRouteAliasUrl = route?.params?.studyRouteAliasUrl;
    const [data, setData] = useState(null);
    const navigation = useNavigation();
    const { t } = useTranslation();
    const [idTopicSelect, setIdTopicSelect] = useState(null);

    useLayoutEffect(() => {
        const setHeaderOptions = async () => {
            const avatarUrl = await AsyncStorage.getItem('avatarUrl');
            const isLoggedIn = await AuthStore.isLoggedIn();
            navigation.setOptions({
                headerTitle: name,
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

    const getDataClassroom = async () => {
        const classroomData = await CourseStore.getStudyRoute(
            aliasUrl,
            idStudyRoute,
            studyRouteAliasUrl,
            idTopicSelect,
        );
        setData(classroomData);
    };
    getDataClassroom();

    const goToJoyQVideo = async (id) => {
        const joyQVideoData = await CourseStore.getLesson(aliasUrl, id, studyRouteAliasUrl, true);
        navigation.navigate('JoyQVideoScreen', { data: joyQVideoData, studyRouteAliasUrl: studyRouteAliasUrl });
    };

    const changeStudyRoute = async (idTopic) => {
        setIdTopicSelect(idTopic);
        const classroomData = await CourseStore.getStudyRoute(
            data.extendData.course.aliasUrl,
            data.id,
            studyRouteAliasUrl,
            idTopic,
        );
        setData(classroomData);
    };
    return (
        <ScrollView style={{ backgroundColor: '#023468', flex: 1, paddingHorizontal: 10, paddingTop: 10 }}>
            <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                style={{
                    width: '100%',
                    flex: 1,
                    flexDirection: 'row',
                }}
            >
                {data?.extendData?.filters?.lessonTopics &&
                    data?.extendData?.filters?.lessonTopics.map((item, index) => (
                        <View style={{ padding: 4 }} key={index}>
                            <TouchableOpacity
                                style={{
                                    height: '80%',
                                    marginBottom: 16,
                                    backgroundColor: item.bgColor !== '' ? item.bgColor : '#ddd',
                                    paddingHorizontal: 8,
                                    paddingVertical: 16,
                                    borderRadius: 12,
                                    borderColor: item.borderColor !== '' ? item.borderColor : '#3785F2',
                                    borderWidth: 2,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: 120,
                                }}
                                key={index}
                                onPress={() => changeStudyRoute(item.id)}
                            >
                                {item.iconUrl !== '' ? (
                                    <SvgUri style={{ height: 80 }} uri={item?.iconUrl} />
                                ) : (
                                    <Image
                                        source={noImage}
                                        style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 12 }}
                                    />
                                )}
                                <Text
                                    numberOfLines={1}
                                    style={{
                                        color: item.textColor !== '' ? item.textColor : '#3785F2',
                                        fontSize: 18,
                                        fontWeight: '600',
                                        marginTop: 8,
                                    }}
                                >
                                    {item?.name}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ))}
            </ScrollView>
            <View style={{ backgroundColor: '#fff', padding: 4, borderRadius: 8 }}></View>
            {data?.extendData?.mainLessons?.length > 0 ? (
                <View
                    style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        width: '100%',
                        justifyContent: 'space-between',
                    }}
                >
                    {data?.extendData?.mainLessons?.map((item, index) => (
                        <View style={{ width: '48%' }} key={index}>
                            {index < 10 ? (
                                <TouchableOpacity
                                    style={{ width: '100%', paddingVertical: 16 }}
                                    onPress={() => goToJoyQVideo(item.id)}
                                >
                                    <View style={{ width: '100%', position: 'relative' }}>
                                        {item?.coverUrl !== '' ? (
                                            <Image
                                                source={{
                                                    uri: Domain + item?.coverUrl,
                                                }}
                                                style={{
                                                    width: '100%',
                                                    height: 120,
                                                    objectFit: 'cover',
                                                    borderTopLeftRadius: 8,
                                                    borderTopRightRadius: 8,
                                                }}
                                            />
                                        ) : (
                                            <Image
                                                source={noImage}
                                                style={{
                                                    width: '100%',
                                                    height: 120,
                                                    objectFit: 'cover',
                                                    borderTopLeftRadius: 8,
                                                    borderTopRightRadius: 8,
                                                }}
                                            />
                                        )}

                                        <View
                                            style={{
                                                position: 'absolute',
                                                left: 0,
                                                bottom: 2,
                                                backgroundColor: item?.isCompleted ? '#00de3799' : '#d1270099',
                                                paddingVertical: 6,
                                                paddingLeft: 6,
                                                paddingRight: 12,
                                                borderBottomRightRadius: 8,
                                                borderTopRightRadius: 24,
                                            }}
                                        >
                                            <Text style={{ color: '#fff', fontSize: 15, fontWeight: '400' }}>
                                                {item?.isCompleted ? t('Completed') : t('Uncompleted')}
                                            </Text>
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                            backgroundColor: '#fff',
                                            paddingHorizontal: 4,
                                            paddingVertical: 8,
                                            borderBottomEndRadius: 8,
                                            borderBottomStartRadius: 8,
                                        }}
                                    >
                                        <Text
                                            style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 4 }}
                                            numberOfLines={1}
                                        >
                                            {item.name}
                                        </Text>
                                        <Text numberOfLines={2}>{item.description}</Text>
                                        <View
                                            style={{
                                                backgroundColor: item.isLocked ? '#dc3545' : '#00a2ce',
                                                borderRadius: 800,
                                                paddingVertical: 4,
                                                paddingHorizontal: 12,
                                                width: item.isLocked ? '70%' : '50%',
                                                marginVertical: 4,
                                            }}
                                        >
                                            <Text style={{ color: '#fff', fontWeight: '700', textAlign: 'center' }}>
                                                {item.isLocked ? t('Locked') : t('Opened')}
                                            </Text>
                                        </View>
                                        <Text
                                            style={{
                                                textAlign: 'right',
                                                fontStyle: 'italic',
                                                textDecorationStyle: 'solid',
                                                textDecorationLine: 'underline',
                                                textDecorationColor: 'black',
                                            }}
                                        >
                                            View Lesson...
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ) : (
                                <></>
                            )}
                        </View>
                    ))}
                </View>
            ) : (
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 16 }}>
                    <Entypo name="box" size={40} color="white" />
                    <Text style={styles.title}>{t('Loading lesson...')}</Text>
                </View>
            )}
        </ScrollView>
    );
};
const styles = StyleSheet.create({
    title: {
        fontWeight: '500',
        fontSize: 30,
        color: 'white',
        marginTop: 8,
    },
});
export default ClassroomScreen;
