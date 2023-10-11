import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { CourseStore } from '../../services/course';
import { AuthStore } from '../../services/auth';
import { Video } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons';
const LessonDetail = ({ data, navigation }) => {
    const { t } = useTranslation();
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});

    const goToBuyCourse = async () => {
        if (AuthStore.isLoggedIn) {
            const buyInfo = await CourseStore.getProductPackages(data.extendData.course.aliasUrl);
            navigation.navigate('BuyCourse', { data: buyInfo });
        } else {
            navigation.navigate('UserScreen');
        }
    };

    const goToExam = async () => {
        const examQuestion = await CourseStore.questions(
            data.id,
            false,
            data.extendData.course.studyRoutes[0].aliasUrl,
            data.extendData.course.aliasUrl,
        );
        navigation.navigate('QuestionScreen', { data: examQuestion, idLesson: data.id });
    };

    return (
        <View>
            <Text style={{ color: '#fff', fontSize: 18, lineHeight: 28 }}>
                {data.extendData.course.name} - {data.extendData.studyRoute.name}
            </Text>
            <Text style={{ color: '#fff', fontSize: 24, lineHeight: 28, fontWeight: '700', marginTop: 8 }}>
                {data.name}
            </Text>
            <View>
                {data.extendData.course.isOwner ? (
                    <View style={{ marginTop: 16 }}>
                        <View style={{ backgroundColor: 'black', borderTopLeftRadius: 6, borderTopRightRadius: 6 }}>
                            <Video
                                ref={video}
                                style={{ width: '100%', height: 203, borderTopLeftRadius: 6, borderTopRightRadius: 6 }}
                                source={{ uri: data.videoSource.url }}
                                useNativeControls
                                resizeMode="contain"
                                isLooping
                                onPlaybackStatusUpdate={setStatus}
                            />
                        </View>
                        <View
                            style={{
                                backgroundColor: '#fff',
                                padding: 8,
                                borderBottomLeftRadius: 6,
                                borderBottomRightRadius: 6,
                            }}
                        >
                            <Text style={{ fontSize: 24, lineHeight: 28, fontWeight: '700' }}>{t('Description')}</Text>
                            <Text style={{ fontSize: 18, textAlign: 'justify', marginTop: 4 }}>{data.description}</Text>
                        </View>
                        <View style={{ marginTop: 16 }}>
                            <Text
                                style={{
                                    fontSize: 24,
                                    lineHeight: 28,
                                    fontWeight: '700',
                                    color: '#c45840',
                                    textTransform: 'uppercase',
                                    marginBottom: 8,
                                }}
                            >
                                Nội dung bài học
                            </Text>
                            <View style={{ backgroundColor: '#fffcea', padding: 8, borderRadius: 6 }}>
                                <Text style={{ fontSize: 18, textAlign: 'justify' }}>{data.description}</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                padding: 12,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#2e72ad',
                                width: '100%',
                                marginTop: 16,
                                borderRadius: 6,
                            }}
                            onPress={() => goToExam()}
                        >
                            <FontAwesome name="question-circle-o" size={30} color="#fff" />
                            <Text style={{ color: '#fff', fontSize: 20, lineHeight: 28, marginLeft: 8 }}>
                                {t('Take a quiz')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View>
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
                    </View>
                )}
            </View>
        </View>
    );
};

export default LessonDetail;
