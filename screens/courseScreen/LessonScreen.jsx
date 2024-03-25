import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import React, { useLayoutEffect, useState, useRef, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { CourseStore } from '../../services/course';
import { SvgUri } from 'react-native-svg';
import ListLession from '../../components/listLession/ListLession';
import { useTranslation } from 'react-i18next';
import { Entypo } from '@expo/vector-icons';
import { noImage } from '../../assets';
import { NativeBaseProvider, Spinner } from 'native-base';
import { setHeaderOptions } from '../../assets/utils/setHeaderOptions ';

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
        const headerTitle = name;
        setHeaderOptions({ navigation, headerTitle });
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
        setPage(1);
    };

    const renderLessonTopicItem = ({ item }) => (
        <View style={{ padding: 4 }}>
            <TouchableOpacity
                onPress={() => changeStudyRoute(item.id)}
                style={{
                    backgroundColor: item.bgColor !== '' ? item.bgColor : '#ddd',
                    paddingHorizontal: 8,
                    paddingVertical: 16,
                    borderRadius: 12,
                    borderColor: item.borderColor !== '' ? item.borderColor : '#3785F2',
                    borderWidth: 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 120,
                    height: 120,
                    marginBottom: 16,
                }}
            >
                {item.iconUrl !== '' ? (
                    item.iconUrl.endsWith('.svg') ? (
                        <SvgUri uri={item.iconUrl} width="80" height="60" style={{ borderRadius: 12 }} />
                    ) : (
                        <Image
                            source={{ uri: item.iconUrl }}
                            style={{ width: 80, height: 60, resizeMode: 'cover', borderRadius: 12 }}
                        />
                    )
                ) : (
                    <Image source={noImage} style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 12 }} />
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
    );

    const lessonTopicsHeader = () => (
        <View>
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={lessonTopics}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderLessonTopicItem}
            />
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 32, fontWeight: '700' }}>{t('Main lesson')}</Text>
            </View>
        </View>
    );

    return (
        <View style={{ backgroundColor: '#023468', flex: 1, paddingHorizontal: 10 }}>
            {mainLessons.length > 0 ? (
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={mainLessons}
                        ListHeaderComponent={lessonTopicsHeader}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <ListLession studyRouteAliasUrl={studyRouteAliasUrl} item={item} aliasUrl={aliasUrl} />
                        )}
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
