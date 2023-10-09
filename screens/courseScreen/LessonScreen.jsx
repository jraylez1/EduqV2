import { View, Text, ScrollView, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { CourseStore } from '../../services/course';
import { SvgUri } from 'react-native-svg';
import { FontAwesome } from '@expo/vector-icons';
const LessonScreen = ({ route }) => {
    const navigation = useNavigation();
    const [data, setData] = useState(route?.params?.data);
    const studyRouteAliasUrl = route?.params?.studyAliasUrl;

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: data.name,
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: '#081D49',
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

    const goToFreeQVideo = async (idLesson) => {
        const freeQVideoData = await CourseStore.getLesson(data.course.aliasUrl, data.course.id, idLesson, true);
        navigation.navigate('FreeQVideoScreen', { data: freeQVideoData });
    };

    const changeStudyRoute = async (idTopic) => {
        const lessonData = await CourseStore.getStudyRoute(
            data.extendData.course.aliasUrl,
            data.id,
            studyRouteAliasUrl,
            idTopic,
        );
        setData(lessonData);
    };
    return (
        <ScrollView style={{ backgroundColor: '#081D49', height: '100%', width: '100%' }}>
            <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                contentContainerStyle={{ paddingHorizontal: 16 }}
                style={{
                    width: '100%',
                    flex: 1,
                    flexDirection: 'row',
                }}
            >
                {data.extendData.filters.lessonTopics.map((item, index) => (
                    <View style={{ padding: 4 }}>
                        <TouchableOpacity
                            style={{
                                height: '80%',
                                marginBottom: 16,
                                backgroundColor: item.bgColor,
                                padding: 8,
                                borderRadius: 12,
                                borderColor: item.borderColor,
                                borderWidth: 2,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            key={index}
                            onPress={() => changeStudyRoute(item.id)}
                        >
                            <SvgUri style={{ height: 80 }} uri={item.iconUrl} />
                            <Text style={{ color: item.textColor, fontSize: 18, fontWeight: '600' }}>{item.name}</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 32, fontWeight: '700' }}>Bài học chính</Text>
            </View>
            {data.extendData.mainLessons.length > 0 ? (
                <View style={{ width: '100%', paddingHorizontal: 16, paddingBottom: 16 }}>
                    {data.extendData.mainLessons.map((item, index) => (
                        <TouchableOpacity style={{ width: '100%' }} onPress={() => goToFreeQVideo(item.id)} key={index}>
                            <View
                                style={{
                                    width: '100%',
                                    paddingHorizontal: 16,
                                    zIndex: 99,
                                    transform: [{ translateY: 45 }],
                                }}
                            >
                                <Image
                                    source={{ uri: item.coverUrl }}
                                    style={{ height: 96, width: 160, borderRadius: 12 }}
                                />
                            </View>
                            <View
                                style={{
                                    width: '100%',
                                    backgroundColor: '#fff',
                                    borderRadius: 12,
                                    paddingHorizontal: 8,
                                    paddingBottom: 8,
                                }}
                            >
                                <View style={{ width: '100%', alignItems: 'flex-end', paddingVertical: 8 }}>
                                    {item.isTrial ? (
                                        <View
                                            style={{
                                                width: 100,
                                                backgroundColor: '#00a2ce',
                                                padding: 8,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                borderRadius: 6,
                                            }}
                                        >
                                            <Text
                                                style={{ fontSize: 16, color: '#fff' }}
                                                numberOfLines={2}
                                                ellipsizeMode="tail"
                                            >
                                                Đã mở
                                            </Text>
                                        </View>
                                    ) : (
                                        <View
                                            style={{
                                                width: 100,
                                                backgroundColor: '#d12700',
                                                padding: 8,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                borderRadius: 6,
                                            }}
                                        >
                                            <Text
                                                style={{ fontSize: 16, color: '#fff' }}
                                                numberOfLines={2}
                                                ellipsizeMode="tail"
                                            >
                                                Đang khóa
                                            </Text>
                                        </View>
                                    )}
                                </View>

                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {item.isTrial ? (
                                        <AntDesign name="play" size={45} color="#005DB4" />
                                    ) : (
                                        <View
                                            style={{
                                                paddingHorizontal: 14,
                                                paddingVertical: 8,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                backgroundColor: '#d12700',
                                                borderRadius: 9999,
                                            }}
                                        >
                                            <FontAwesome name="lock" size={30} color="#fff" />
                                        </View>
                                    )}
                                    <View style={{ marginLeft: 8, width: '85%' }}>
                                        <Text
                                            style={{
                                                color: '#005DB4',
                                                fontSize: 20,
                                                lineHeight: 28,
                                                fontWeight: 700,
                                            }}
                                            numberOfLines={2}
                                            ellipsizeMode="tail"
                                        >
                                            {item.name}
                                        </Text>
                                        <Text
                                            style={{ fontSize: 16, color: '#939393' }}
                                            numberOfLines={2}
                                            ellipsizeMode="tail"
                                        >
                                            {item.description}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            ) : (
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styles.title}>No lessons</Text>
                </View>
            )}

            <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 4 }}>
                <Text style={{ color: '#fff', fontSize: 32, fontWeight: '700' }}>Bài học Bổ trợ</Text>
            </View>
            {data.extendData.additionLessons.length > 0 ? (
                <View style={{ width: '100%', paddingHorizontal: 16, paddingBottom: 16 }}>
                    {data.extendData.additionLessons.map((item, index) => (
                        <TouchableOpacity style={{ width: '100%' }} onPress={() => goToFreeQVideo(item.id)} key={index}>
                            <View
                                style={{
                                    width: '100%',
                                    paddingHorizontal: 16,
                                    zIndex: 99,
                                    transform: [{ translateY: 45 }],
                                }}
                            >
                                <Image
                                    source={{ uri: item.coverUrl }}
                                    style={{ height: 96, width: 160, borderRadius: 12 }}
                                />
                            </View>
                            <View
                                style={{
                                    width: '100%',
                                    backgroundColor: '#fff',
                                    borderRadius: 12,
                                    paddingHorizontal: 8,
                                    paddingBottom: 8,
                                }}
                            >
                                <View style={{ width: '100%', alignItems: 'flex-end', paddingVertical: 8 }}>
                                    {item.isTrial ? (
                                        <View
                                            style={{
                                                width: 100,
                                                backgroundColor: '#00a2ce',
                                                padding: 8,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                borderRadius: 6,
                                            }}
                                        >
                                            <Text
                                                style={{ fontSize: 16, color: '#fff' }}
                                                numberOfLines={2}
                                                ellipsizeMode="tail"
                                            >
                                                Đã mở
                                            </Text>
                                        </View>
                                    ) : (
                                        <View
                                            style={{
                                                width: 100,
                                                backgroundColor: '#d12700',
                                                padding: 8,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                borderRadius: 6,
                                            }}
                                        >
                                            <Text
                                                style={{ fontSize: 16, color: '#fff' }}
                                                numberOfLines={2}
                                                ellipsizeMode="tail"
                                            >
                                                Đang khóa
                                            </Text>
                                        </View>
                                    )}
                                </View>

                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {item.isTrial ? (
                                        <AntDesign name="play" size={45} color="#005DB4" />
                                    ) : (
                                        <View
                                            style={{
                                                paddingHorizontal: 14,
                                                paddingVertical: 8,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                backgroundColor: '#d12700',
                                                borderRadius: 9999,
                                            }}
                                        >
                                            <FontAwesome name="lock" size={30} color="#fff" />
                                        </View>
                                    )}
                                    <View style={{ marginLeft: 8, width: '85%' }}>
                                        <Text
                                            style={{
                                                color: '#005DB4',
                                                fontSize: 20,
                                                lineHeight: 28,
                                                fontWeight: 700,
                                            }}
                                            numberOfLines={2}
                                            ellipsizeMode="tail"
                                        >
                                            {item.name}
                                        </Text>
                                        <Text
                                            style={{ fontSize: 16, color: '#939393' }}
                                            numberOfLines={2}
                                            ellipsizeMode="tail"
                                        >
                                            {item.description}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            ) : (
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styles.title}>No lessons</Text>
                </View>
            )}
        </ScrollView>
    );
};

export default LessonScreen;
