import { View, Text, SafeAreaView, Image, ScrollView, TouchableOpacity } from 'react-native';
import React, { useLayoutEffect, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { NativeBaseProvider } from 'native-base';
import { CourseStore } from '../../services/course';

const CourseScreen = ({ route }) => {
    const navigation = useNavigation();
    const data = route?.params?.data;
    const [studyRouteData, setStudyRouteData] = useState([]);
    const [selectStudyRoute, setSelectStudyRoute] = useState(null);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: data.name,
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: '#023468',
            },
            headerTintColor: '#fff',
            headerRight: () => {
                return (
                    <AntDesign
                        name="customerservice"
                        size={24}
                        color="white"
                        onPress={() => navigation.navigate('ContactScreen')}
                    />
                );
            },
        });
    }, []);

    const getStudyRoutes = async () => {
        if (data.aliasUrl === 'freeq') {
            const idStudyRoutes = data.studyRoutes.map((item) => item.id);
            const studyRouteData = await CourseStore.getStudyRoutes(idStudyRoutes);
            setStudyRouteData(studyRouteData);
        } else {
        }
    };

    useEffect(() => {
        getStudyRoutes();
    }, [data]);

    // const goToLesson = async (name, idStudyRoute, studyRouteAliasUrl) => {
    //     navigation.navigate('LessonScreen', {
    //         name: name,
    //         aliasUrl: data.aliasUrl,
    //         studyRouteAliasUrl: studyRouteAliasUrl,
    //         idStudyRoute: idStudyRoute,
    //     });
    // };

    const goToTopicScreen = async (name, idStudyRoute, studyRouteAliasUrl) => {
        navigation.navigate('TopicScreen', {
            name: name,
            aliasUrl: data.aliasUrl,
            idStudyRoute: idStudyRoute,
            studyRouteAliasUrl: studyRouteAliasUrl,
        });
    };

    return (
        <ScrollView style={{ backgroundColor: '#023468', height: '100%' }}>
            {data.thumbnailUrl?.length > 0 ? (
                <Image source={{ uri: data.thumbnailUrl }} style={{ width: '100%', height: 240, objectFit: 'cover' }} />
            ) : (
                <Image
                    source={{
                        uri: 'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg',
                    }}
                    style={{ width: '100%', height: 240, objectFit: 'cover' }}
                />
            )}
            <View className="w-full h-full mb-4" style={{ width: '100%', height: '100%', marginBottom: 16 }}>
                <NativeBaseProvider>
                    <Text
                        style={{
                            color: '#fff',
                            fontWeight: '400',
                            fontSize: 16,
                            textAlign: 'center',
                            paddingVertical: 16,
                            paddingHorizontal: 8,
                        }}
                    >
                        {data.summary}
                    </Text>
                    {data.aliasUrl === 'freeq' ? (
                        <View style={{ paddingHorizontal: 16 }}>
                            {studyRouteData.map((item, index) => (
                                <View key={index} style={{ marginVertical: 8 }}>
                                    <TouchableOpacity
                                        style={{
                                            borderRadius: 6,
                                            backgroundColor: selectStudyRoute === item.id ? '#2e72ad' : '#facc15',
                                            padding: 16,
                                            width: '100%',
                                            fontWeight: '500',
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                        onPress={() => setSelectStudyRoute(item?.id)}
                                    >
                                        <Text
                                            style={{
                                                color: selectStudyRoute === item.id ? '#fff' : '#023468',
                                                fontSize: 20,
                                                lineHeight: 28,
                                                textAlign: 'center',
                                            }}
                                        >
                                            {item.name}
                                        </Text>
                                        {selectStudyRoute === item.id ? (
                                            <AntDesign name="up" size={24} color="white" />
                                        ) : (
                                            <AntDesign name="down" size={20} color="black" />
                                        )}
                                    </TouchableOpacity>
                                    {selectStudyRoute === item.id ? (
                                        <View style={{ borderRadius: 6 }}>
                                            {item.lessons.map((lesson, index) => (
                                                <TouchableOpacity
                                                    key={index}
                                                    style={{
                                                        borderRadius: 6,
                                                        backgroundColor: '#fff',
                                                        padding: 16,
                                                        borderBottomColor: '#ddd',
                                                        borderBottomWidth: 1,
                                                        marginVertical: 4,
                                                    }}
                                                >
                                                    <Text>{lesson.name}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    ) : (
                                        <></>
                                    )}
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16 }}>
                            {data.studyRoutes.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={{
                                        borderRadius: 12,
                                        backgroundColor: '#facc15',
                                        padding: 8,
                                        width: '47%',
                                        margin: 4,
                                        fontWeight: '500',
                                    }}
                                    onPress={() => goToTopicScreen(item.name, item.id, item.aliasUrl)}
                                >
                                    <Text
                                        style={{ color: '#023468', fontSize: 20, lineHeight: 28, textAlign: 'center' }}
                                    >
                                        {item.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </NativeBaseProvider>
            </View>
        </ScrollView>
    );
};

export default CourseScreen;
