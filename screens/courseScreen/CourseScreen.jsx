import { View, Text, SafeAreaView, Image, ScrollView, TouchableOpacity } from 'react-native';
import React, { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { NativeBaseProvider } from 'native-base';
import { CourseStore } from '../../services/course';

const CourseScreen = ({ route }) => {
    const navigation = useNavigation();
    const data = route?.params?.data;
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

    const goToLesson = async (idStudyRoute, studyRouteAliasUrl) => {
        const lessonData = await CourseStore.getStudyRoute(data.aliasUrl, idStudyRoute, studyRouteAliasUrl);
        navigation.navigate('LessonScreen', { data: lessonData, studyAliasUrl: studyRouteAliasUrl });
    };

    return (
        <SafeAreaView style={{ backgroundColor: '#081D49', height: '100%' }}>
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
            <ScrollView className="w-full h-full mb-4" style={{ width: '100%', height: '100%', marginBottom: 16 }}>
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
                                onPress={() => goToLesson(item.id, item.aliasUrl)}
                            >
                                <Text style={{ color: '#081D49', fontSize: 20, lineHeight: 28, textAlign: 'center' }}>
                                    {item.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </NativeBaseProvider>
            </ScrollView>
        </SafeAreaView>
    );
};

export default CourseScreen;
