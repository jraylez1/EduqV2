import { View, Text, ScrollView, Image, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import React, { useLayoutEffect, useState, useRef, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { CourseStore } from '../../services/course';
import { useTranslation } from 'react-i18next';
import { Entypo } from '@expo/vector-icons';
import { noImage } from '../../assets';
import HexagonSteamQ from '../../assets/svg/HexagonSteamQ';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthStore } from '../../services/auth';
import { setHeaderOptions } from '../../assets/utils/setHeaderOptions ';

const TopicScreen = ({ route }) => {
    const navigation = useNavigation();
    const [data, setData] = useState(null);
    const { t } = useTranslation();
    const [aliasUrl, setAliasUrl] = useState(route?.params?.aliasUrl);
    const [idStudyRoute, setIdStudyRoute] = useState(route?.params?.idStudyRoute);
    const [studyRouteAliasUrl, setStudyRouteAliasUrl] = useState(route?.params?.studyRouteAliasUrl);
    const [name, setName] = useState(route?.params?.name);

    useEffect(() => {
        loadTopicData();
    }, [data]);

    useLayoutEffect(() => {
        const headerTitle = '';
        setHeaderOptions({ navigation, headerTitle });
    }, []);

    const loadTopicData = async () => {
        const topicData = await CourseStore.getStudyRoute(aliasUrl, idStudyRoute, studyRouteAliasUrl);
        setData(topicData);
    };

    const goToLessonScreen = (idTopic) => {
        navigation.navigate('LessonScreen', {
            name: name,
            aliasUrl: aliasUrl,
            idStudyRoute: idStudyRoute,
            studyRouteAliasUrl: studyRouteAliasUrl,
            idTopic: idTopic,
        });
    };

    return (
        <ScrollView style={{ backgroundColor: '#023468', height: '100%', width: '100%' }}>
            <View style={{ alignItems: 'center', paddingTop: 20 }}>
                <Text
                    style={{
                        color: '#fff',
                        fontWeight: '500',
                        fontSize: 24,
                        letterSpacing: 12,
                        textTransform: 'uppercase',
                    }}
                >
                    {t('Learning path')}
                </Text>
                <Text
                    style={{
                        color: '#fff',
                        fontSize: 20,
                        marginTop: 10,
                    }}
                >
                    {name}
                </Text>
            </View>
            <View style={{ padding: 20 }}>
                <View>
                    <Text
                        style={{
                            color: '#fff',
                            fontSize: 20,
                            marginBottom: 10,
                        }}
                    >
                        {t('Main lesson')}
                    </Text>
                    {data?.extendData?.filters?.lessonTopics?.length > 0 ? (
                        <>
                            {data?.idLayout === 'card' ? (
                                <ScrollView
                                    showsHorizontalScrollIndicator={false}
                                    horizontal={true}
                                    style={{
                                        width: '100%',
                                        flex: 1,
                                        flexDirection: 'row',
                                    }}
                                >
                                    {data?.extendData?.filters?.lessonTopics.map((item, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={{ marginHorizontal: 8 }}
                                            onPress={() => goToLessonScreen(item.id)}
                                        >
                                            {item?.coverUrl?.length > 0 ? (
                                                <View style={{ position: 'relative' }}>
                                                    <Image
                                                        source={{ uri: item?.coverUrl }}
                                                        style={styles.backgroundImage}
                                                    />
                                                    <View
                                                        style={{
                                                            position: 'absolute',
                                                            bottom: 20,
                                                            left: 10,
                                                            right: 10,
                                                            padding: 8,
                                                            backgroundColor: '#023468',
                                                            alignItems: 'center',
                                                            borderRadius: 12,
                                                            borderWidth: 2,
                                                            borderStyle: 'solid',
                                                            borderColor: '#fff',
                                                        }}
                                                    >
                                                        <Text
                                                            style={{
                                                                color: '#fff',
                                                                fontWeight: 'bold',
                                                                fontSize: 18,
                                                                textAlign: 'center',
                                                            }}
                                                            numberOfLines={1}
                                                        >
                                                            {item.name}
                                                        </Text>
                                                        <Text style={{ color: '#fff' }}>{t('+ Robot and books')}</Text>
                                                        <Text style={{ color: '#fff' }}>{t('(200+ Lesson)')}</Text>
                                                    </View>
                                                </View>
                                            ) : (
                                                <View style={{ position: 'relative' }}>
                                                    <Image source={noImage} style={styles.backgroundImage} />
                                                    <View
                                                        style={{
                                                            position: 'absolute',
                                                            bottom: 20,
                                                            left: 10,
                                                            right: 10,
                                                            padding: 8,
                                                            backgroundColor: '#023468',
                                                            alignItems: 'center',
                                                            borderRadius: 12,
                                                            borderWidth: 2,
                                                            borderStyle: 'solid',
                                                            borderColor: '#fff',
                                                        }}
                                                    >
                                                        <Text
                                                            style={{
                                                                color: '#fff',
                                                                fontWeight: 'bold',
                                                                fontSize: 18,
                                                                textAlign: 'center',
                                                            }}
                                                            numberOfLines={1}
                                                        >
                                                            {item.name}
                                                        </Text>
                                                        <Text style={{ color: '#fff' }}>{t('+ Robot and books')}</Text>
                                                        <Text style={{ color: '#fff' }}>{t('(200+ Lesson)')}</Text>
                                                    </View>
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            ) : (
                                <>
                                    {data?.extendData?.filters?.lessonTopics.map((item, index) => (
                                        <View key={index}>
                                            {index % 2 === 0 ? (
                                                <TouchableOpacity
                                                    style={{
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        marginVertical: 20,
                                                    }}
                                                    onPress={() => goToLessonScreen(item.id)}
                                                >
                                                    <View style={{ width: '38%', flexDirection: 'row' }}>
                                                        <View style={{ position: 'relative' }}>
                                                            <HexagonSteamQ
                                                                fillColor={
                                                                    item.bgColor !== '' ? item.bgColor : '#ffa500'
                                                                }
                                                                svgWidth={70}
                                                                svgHeight={70}
                                                                number={index + 1}
                                                            />
                                                        </View>
                                                        <View
                                                            style={{
                                                                textAlign: 'center',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                borderTopColor:
                                                                    item.borderColor !== ''
                                                                        ? item.borderColor
                                                                        : '#ffa500',
                                                                borderTopWidth: 2,
                                                                borderStyle: 'solid',
                                                                paddingHorizontal: 4,
                                                                paddingVertical: 8,
                                                                width: 130,
                                                            }}
                                                        >
                                                            <Text
                                                                style={{
                                                                    color: 'white',
                                                                    fontWeight: 'bold',
                                                                    textTransform: 'uppercase',
                                                                    flexWrap: 'wrap',
                                                                    fontSize: 14,
                                                                    textAlign: 'center',
                                                                }}
                                                                numberOfLines={2}
                                                            >
                                                                {item.name}
                                                            </Text>
                                                            <View
                                                                style={{
                                                                    marginTop: 10,
                                                                    paddingTop: 3,
                                                                    paddingBottom: 4,
                                                                    paddingHorizontal: 12,
                                                                    borderRadius: 800,
                                                                    borderColor: 'white',
                                                                    borderWidth: 1,
                                                                    borderStyle: 'solid',
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center',
                                                                }}
                                                            >
                                                                <Text
                                                                    style={{
                                                                        textAlign: 'center',
                                                                        color: 'white',
                                                                        fontSize: 12,
                                                                    }}
                                                                >
                                                                    200+ bai hoc
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                    <View style={{ width: '40%' }}>
                                                        {item?.coverUrl === '' ? (
                                                            <Image
                                                                source={{
                                                                    uri: 'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg',
                                                                }}
                                                                style={{
                                                                    width: '100%',
                                                                    height: 80,
                                                                    objectFit: 'cover',
                                                                    borderRadius: 8,
                                                                }}
                                                            />
                                                        ) : (
                                                            <Image
                                                                source={{
                                                                    uri: item.coverUrl,
                                                                }}
                                                                style={{
                                                                    width: '100%',
                                                                    height: 80,
                                                                    objectFit: 'cover',
                                                                    borderRadius: 8,
                                                                }}
                                                            />
                                                        )}
                                                    </View>
                                                </TouchableOpacity>
                                            ) : (
                                                <TouchableOpacity
                                                    style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        marginVertical: 20,
                                                    }}
                                                    onPress={() => goToLessonScreen(item.id)}
                                                >
                                                    <View style={{ width: '40%' }}>
                                                        {item?.coverUrl === '' ? (
                                                            <Image
                                                                source={{
                                                                    uri: 'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg',
                                                                }}
                                                                style={{
                                                                    width: '100%',
                                                                    height: 80,
                                                                    objectFit: 'cover',
                                                                    borderRadius: 8,
                                                                }}
                                                            />
                                                        ) : (
                                                            <Image
                                                                source={{
                                                                    uri: item.coverUrl,
                                                                }}
                                                                style={{
                                                                    width: '100%',
                                                                    height: 80,
                                                                    objectFit: 'cover',
                                                                    borderRadius: 8,
                                                                }}
                                                            />
                                                        )}
                                                    </View>
                                                    <View style={{ width: '55%', flexDirection: 'row' }}>
                                                        <View
                                                            style={{
                                                                textAlign: 'center',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                borderTopColor:
                                                                    item.borderColor !== ''
                                                                        ? item.borderColor
                                                                        : '#ffa500',
                                                                borderTopWidth: 2,
                                                                borderStyle: 'solid',
                                                                paddingHorizontal: 4,
                                                                paddingVertical: 8,
                                                                width: 130,
                                                            }}
                                                        >
                                                            <Text
                                                                style={{
                                                                    color: 'white',
                                                                    fontWeight: 'bold',
                                                                    textTransform: 'uppercase',
                                                                    flexWrap: 'wrap',
                                                                    fontSize: 14,
                                                                    textAlign: 'center',
                                                                }}
                                                                numberOfLines={2}
                                                            >
                                                                {item.name}
                                                            </Text>
                                                            <View
                                                                style={{
                                                                    marginTop: 10,
                                                                    paddingTop: 3,
                                                                    paddingBottom: 4,
                                                                    paddingHorizontal: 12,
                                                                    borderRadius: 800,
                                                                    borderColor: 'white',
                                                                    borderWidth: 1,
                                                                    borderStyle: 'solid',
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center',
                                                                }}
                                                            >
                                                                <Text
                                                                    style={{
                                                                        textAlign: 'center',
                                                                        color: 'white',
                                                                        fontSize: 12,
                                                                    }}
                                                                >
                                                                    200+ bai hoc
                                                                </Text>
                                                            </View>
                                                        </View>
                                                        <View>
                                                            <HexagonSteamQ
                                                                fillColor={
                                                                    item.bgColor !== '' ? item.bgColor : '#ffa500'
                                                                }
                                                                svgWidth={70}
                                                                svgHeight={70}
                                                                number={index + 1}
                                                            />
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    ))}
                                </>
                            )}
                        </>
                    ) : (
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 16 }}>
                            <Entypo name="box" size={40} color="white" />
                            <Text style={styles.title}>{t('No lessons')}</Text>
                        </View>
                    )}
                </View>
            </View>
            <View style={{ padding: 20, width: '100%' }}>
                <View style={{ width: '100%' }}>
                    <Text
                        style={{
                            color: '#fff',
                            fontSize: 20,
                            marginBottom: 10,
                        }}
                    >
                        {t('Additional lesson')}
                    </Text>
                    {data?.extendData?.filters?.additionLessonTopics.length > 0 ? (
                        <View>
                            {data?.extendData?.filters?.additionLessonTopics.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={{ margin: 8 }}
                                    onPress={() => goToLessonScreen(item.id)}
                                >
                                    {item?.coverUrl?.length > 0 ? (
                                        <View
                                            style={{
                                                position: 'relative',
                                                backgroundColor: '#1d4877',
                                                borderRadius: 20,
                                                width: '100%',
                                                flex: 1,
                                                flexDirection: 'row',
                                            }}
                                        >
                                            <Image source={{ uri: item?.coverUrl }} style={styles.backgroundImage2} />
                                            <View
                                                style={{
                                                    borderRadius: 20,
                                                    alignItems: 'center',
                                                    padding: 16,
                                                    width: '50%',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontSize: 20,
                                                        color: '#fff',
                                                        flexWrap: 'wrap',
                                                        fontWeight: 'bold',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    {item.name}
                                                </Text>
                                                <Text style={{ color: '#fff' }}>{t('(200+ Lesson)')}</Text>
                                            </View>
                                        </View>
                                    ) : (
                                        <View
                                            style={{
                                                position: 'relative',
                                                backgroundColor: '#1d4877',
                                                borderRadius: 20,
                                                width: '100%',
                                                flex: 1,
                                                flexDirection: 'row',
                                            }}
                                        >
                                            <Image source={noImage} style={styles.backgroundImage} />
                                            <View
                                                style={{
                                                    borderRadius: 20,
                                                    alignItems: 'center',
                                                    padding: 16,
                                                    width: 170,
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontSize: 20,
                                                        color: '#fff',
                                                        flexWrap: 'wrap',
                                                        fontWeight: 'bold',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    {item.name}
                                                </Text>
                                                <Text style={{ color: '#fff' }}>{t('(200+ Lesson)')}</Text>
                                            </View>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    ) : (
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 16 }}>
                            <Entypo name="box" size={40} color="white" />
                            <Text style={styles.title}>{t('No lessons')}</Text>
                        </View>
                    )}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
        width: 250,
        height: 350,
        borderRadius: 20,
    },
    backgroundImage2: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
        width: 170,
        height: 130,
        borderRadius: 20,
    },
    title: {
        fontWeight: '500',
        fontSize: 30,
        color: 'white',
        marginTop: 8,
    },
});
export default TopicScreen;
