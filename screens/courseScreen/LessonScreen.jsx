import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import React, { useLayoutEffect, useState, useRef, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { CourseStore } from '../../services/course';
import { SvgUri } from 'react-native-svg';
import ListLession from '../../components/listLession/ListLession';
import { useTranslation } from 'react-i18next';
import { Entypo } from '@expo/vector-icons';
import { noImage } from '../../assets';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthStore } from '../../services/auth';
import { NativeBaseProvider, Spinner, Heading, HStack } from 'native-base';

const LessonScreen = ({ route }) => {
    const navigation = useNavigation();
    const [data, setData] = useState(null);
    const scrollViewRef = useRef(null);
    const { t } = useTranslation();
    const [aliasUrl, setAliasUrl] = useState(route?.params?.aliasUrl);
    const [idStudyRoute, setIdStudyRoute] = useState(route?.params?.idStudyRoute);
    const [studyRouteAliasUrl, setStudyRouteAliasUrl] = useState(route?.params?.studyRouteAliasUrl);
    const [idTopicSelect, setIdTopicSelect] = useState(route?.params?.idTopic);
    const [name, setName] = useState(route?.params?.name);
    const [lessonTopics, setLessonTopics] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [mainLessons, setMainLessons] = useState([]);

    const fetchData = async () => {
        const classroomData = await CourseStore.getStudyRoute(
            aliasUrl,
            idStudyRoute,
            studyRouteAliasUrl,
            idTopicSelect,
        );
        const newData = classroomData.extendData?.mainLessons.slice((page - 1) * 10, page * 10);
        setMainLessons((prevData) => [...prevData, ...newData]);
        setLessonTopics(classroomData?.extendData?.filters?.lessonTopics);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [page]);

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

    const handleEndReached = async () => {
        if (!loading) {
            setLoading(true);
            setPage((prevPage) => prevPage + 1);
        }
    };

    const changeStudyRoute = async (idTopic) => {
        setIdTopicSelect(idTopic);
        const classroomData = await CourseStore.getStudyRoute(aliasUrl, idStudyRoute, studyRouteAliasUrl, idTopic);
        setMainLessons(classroomData.extendData?.mainLessons);
    };

    return (
        <View style={{ backgroundColor: '#023468', flex: 1, paddingHorizontal: 10, paddingTop: 10 }}>
            <View style={{ height: '20%' }}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={lessonTopics}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={{ padding: 4 }}>
                            <TouchableOpacity
                                style={{
                                    height: '100%',
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
                    )}
                />
            </View>

            {mainLessons.length > 0 ? (
                <View style={{ flex: 1, marginTop: 20 }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#fff', fontSize: 32, fontWeight: '700' }}>{t('Main lesson')}</Text>
                    </View>
                    <FlatList
                        data={mainLessons}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <View style={{ transform: [{ translateY: -30 }] }}>
                                <ListLession
                                    studyRouteAliasUrl={studyRouteAliasUrl}
                                    item={item}
                                    aliasUrl={aliasUrl}
                                    scrollViewRef={scrollViewRef}
                                    isScroll={false}
                                />
                            </View>
                        )}
                        numColumns={2}
                        onEndReached={handleEndReached}
                        onEndReachedThreshold={0.1}
                    />
                    <View>
                        {loading ? (
                            <View style={{ marginVertical: 20 }}>
                                <NativeBaseProvider>
                                    <Spinner accessibilityLabel="Loading" color="#fff" />
                                </NativeBaseProvider>
                            </View>
                        ) : (
                            <></>
                        )}
                    </View>
                </View>
            ) : (
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 16 }}>
                    <Entypo name="box" size={40} color="white" />
                    <Text style={styles.title}>{t('Loading lesson...')}</Text>
                </View>
            )}
        </View>
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
export default LessonScreen;
