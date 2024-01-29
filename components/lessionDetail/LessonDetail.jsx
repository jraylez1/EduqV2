import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { CourseStore } from '../../services/course';
import { AuthStore } from '../../services/auth';
import { Video } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons';
import { Domain } from '@env';
import { useEffect } from 'react';

const LessonDetail = ({ data, navigation, studyRouteAliasUrl, scrollViewRef, isScroll }) => {
    const { t } = useTranslation();
    const videoRef = React.useRef(null);
    const [status, setStatus] = React.useState({});
    const [questionData, setQuestionData] = React.useState({});

    const goToBuyCourse = async () => {
        const isLoggedIn = await AuthStore.isLoggedIn();
        if (isLoggedIn) {
            const buyInfo = await CourseStore.getProductPackages(data.extendData.course.aliasUrl);
            if (buyInfo) {
                navigation.navigate('BuyCourse', { data: buyInfo });
            } else {
                navigation.navigate('UserScreen', {
                    backScreen: 'CourseScreen',
                    aliasUrl: data.extendData.course.aliasUrl,
                });
            }
        } else {
            navigation.navigate('UserScreen', {
                backScreen: 'CourseScreen',
                aliasUrl: data.extendData.course.aliasUrl,
            });
        }
    };

    useEffect(() => {
        autoPlayVideo();
        getQuestionData();
    }, [data]);

    const autoPlayVideo = () => {
        if (videoRef.current) {
            videoRef.current.playAsync();
        }
    };

    const onVideoEnded = async () => {
        const videoEndedData = await CourseStore.viewVideoCompleted(
            data.extendData.course.aliasUrl,
            data.id,
            data.extendData.studyRoute.id,
            true,
            studyRouteAliasUrl,
        );

        if (videoEndedData.data) {
            const match = videoEndedData?.data?.url.match(/\/m-(\d+)\.html/);
            if (match) {
                const idLessonMatch = match[1];
                const freeQVideoData = await CourseStore.getLesson(
                    data.extendData.course.aliasUrl,
                    idLessonMatch,
                    studyRouteAliasUrl,
                    true,
                );
                navigation.navigate('VideoScreen', { data: freeQVideoData, studyRouteAliasUrl: studyRouteAliasUrl });
                if (isScroll) {
                    scrollViewRef.current.scrollTo({ y: 0, animated: true });
                }
            }
        } else {
            alert(videoEndedData.message);
        }
    };

    const getQuestionData = async () => {
        if (data.hasQuestions) {
            const examQuestion = await CourseStore.questions(
                data.id,
                true,
                studyRouteAliasUrl,
                data.extendData.course.aliasUrl,
            );
            setQuestionData(examQuestion.data);
        } else {
            setQuestionData(null);
        }
    };

    const goToExam = async () => {
        const examQuestion = await CourseStore.questions(
            data.id,
            true,
            studyRouteAliasUrl,
            data.extendData.course.aliasUrl,
        );
        navigation.navigate('QuestionScreen', {
            data: examQuestion.questions,
            idLesson: data.id,
            extendData: examQuestion.extendData,
            result: examQuestion.result,
            studyRouteAliasUrl: studyRouteAliasUrl,
            scrollViewRef: scrollViewRef,
            isScroll: isScroll,
            idCourse: data.extendData.course.id,
        });
    };

    return (
        <View>
            <Text style={{ color: '#fff', fontSize: 18, lineHeight: 28 }}>
                {data?.extendData?.course?.name} - {data?.extendData?.studyRoute?.name}
            </Text>
            <Text style={{ color: '#fff', fontSize: 24, lineHeight: 28, fontWeight: '700', marginTop: 8 }}>
                {data?.name}
            </Text>

            <View>
                <View style={{ marginTop: 16 }}>
                    <View style={{ backgroundColor: 'black', borderTopLeftRadius: 6, borderTopRightRadius: 6 }}>
                        {data?.videoSource ? (
                            <Video
                                ref={videoRef}
                                style={{
                                    width: '100%',
                                    height: 203,
                                    borderTopLeftRadius: 6,
                                    borderTopRightRadius: 6,
                                }}
                                source={{ uri: data?.videoSource?.url }}
                                useNativeControls
                                resizeMode="contain"
                                onPlaybackStatusUpdate={(playbackStatus) => {
                                    if (playbackStatus.isLoaded && playbackStatus.didJustFinish) {
                                        onVideoEnded();
                                    }
                                    setStatus(playbackStatus);
                                }}
                            />
                        ) : (
                            <Image
                                source={{
                                    uri: Domain + data?.coverUrl,
                                }}
                                style={{
                                    width: '100%',
                                    height: 203,
                                    objectFit: 'cover',
                                    borderTopLeftRadius: 6,
                                    borderTopRightRadius: 6,
                                }}
                            />
                        )}
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
                        <Text style={{ fontSize: 18, textAlign: 'justify', marginTop: 4 }}>{data?.description}</Text>
                    </View>
                    {data?.extendData?.course?.isOwner ? (
                        <View></View>
                    ) : (
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
                    )}
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
                            {t('Lesson Content')}
                        </Text>
                        <View style={{ backgroundColor: '#fffcea', padding: 8, borderRadius: 6 }}>
                            <Text style={{ fontSize: 18, textAlign: 'justify' }}>{data?.description}</Text>
                        </View>
                    </View>
                    {data?.extendData?.course?.isOwner ? (
                        <>
                            {questionData && questionData.result != null ? (
                                <View
                                    style={{
                                        backgroundColor: '#fff',
                                        borderRadius: 6,
                                        padding: 8,
                                        marginTop: 16,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text style={{ fontSize: 24, lineHeight: 28, fontWeight: '700' }}>
                                        {t('Test results')}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 20,
                                            lineHeight: 28,
                                            fontWeight: '400',
                                            textAlign: 'center',
                                            marginBottom: 8,
                                        }}
                                    >
                                        {t('Congratulations, you have completed the test')}
                                    </Text>
                                    <FontAwesome5 name="smile" size={80} color="#0a7568" />
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text
                                            style={{
                                                fontSize: 40,
                                                lineHeight: 42,
                                                marginTop: 8,
                                                fontWeight: '700',
                                                color: '#0a7568',
                                            }}
                                        >
                                            {questionData?.result?.score}
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 28,
                                                lineHeight: 42,
                                                marginTop: 8,
                                                fontWeight: '500',
                                                color: '#0a7568',
                                            }}
                                        >
                                            {' '}
                                            / {questionData?.result?.maxScore}
                                        </Text>
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
                                        <Text style={{ color: '#fff', fontSize: 20, lineHeight: 28 }}>
                                            {t('Redo the lesson')}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View>
                                    {data.hasQuestions ? (
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
                                            <Text
                                                style={{ color: '#fff', fontSize: 20, lineHeight: 28, marginLeft: 8 }}
                                            >
                                                {t('Take a quiz')}
                                            </Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <></>
                                    )}
                                </View>
                            )}
                        </>
                    ) : (
                        <></>
                    )}
                </View>
            </View>
        </View>
    );
};

export default LessonDetail;
