import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CourseStore } from '../../services/course';
import { Video } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons';
import { Domain } from '@env';
import { useEffect } from 'react';
import { Actionsheet, useDisclose, Box, NativeBaseProvider, Center } from 'native-base';
import { notifiEndVideo } from '../../assets/index';
import { MaterialIcons, AntDesign, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
const JoyQDetail = ({ data, navigation, studyRouteAliasUrl, scrollViewRef, isScroll }) => {
    const { t } = useTranslation();
    const videoRef = React.useRef(null);
    const [status, setStatus] = React.useState({});
    const [questionData, setQuestionData] = React.useState({});
    const { isOpen, onOpen, onClose } = useDisclose();

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
            onClose();
            if (videoEndedData.data.url !== '/course/joyq') {
                if (videoEndedData.message !== '') {
                    alert(videoEndedData.message);
                }
                const match = videoEndedData?.data?.url.match(/\/m-(\d+)\.html/);
                if (match) {
                    const idLessonMatch = match[1];
                    const freeQVideoData = await CourseStore.getLesson(
                        data.extendData.course.aliasUrl,
                        idLessonMatch,
                        studyRouteAliasUrl,
                        true,
                    );
                    navigation.navigate('JoyQVideoScreen', {
                        data: freeQVideoData,
                        studyRouteAliasUrl: studyRouteAliasUrl,
                    });
                    if (isScroll) {
                        scrollViewRef.current.scrollTo({ y: 0, animated: true });
                    }
                }
            } else {
                alert(videoEndedData.message);
                const courseData = await CourseStore.get(data.extendData.course.aliasUrl);
                navigation.navigate('JoyQScreen', { data: courseData });
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
        navigation.navigate('JoyQuestion', {
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

    const goToLesson = async (path) => {
        const classroomData = await CourseStore.getStudyingRoute(data.extendData.course.aliasUrl);
        navigation.navigate(path, {
            name: classroomData.name,
            aliasUrl: data.extendData.course.aliasUrl,
            idStudyRoute: classroomData.id,
            studyRouteAliasUrl: classroomData.aliasUrl,
        });
    };

    return (
        <View>
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
                                        onOpen();
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
                        <Text style={{ fontSize: 24, lineHeight: 28, fontWeight: '700' }}>{data.name}</Text>
                        <Text style={{ fontSize: 18, textAlign: 'justify', marginTop: 4 }}>{data?.description}</Text>
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
                                    <TouchableOpacity
                                        style={{
                                            flexDirection: 'row',
                                            padding: 12,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: '#f77d68',
                                            width: '100%',
                                            marginTop: 16,
                                            borderRadius: 6,
                                        }}
                                        onPress={onOpen}
                                    >
                                        <AntDesign
                                            name="banckward"
                                            size={20}
                                            color="white"
                                            style={{ fontWeight: 'bold', marginTop: 2, marginRight: 8 }}
                                        />

                                        <Text style={{ color: '#fff', fontSize: 20, lineHeight: 28 }}>
                                            {t('More Lesson')}
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
            <NativeBaseProvider>
                <Actionsheet isOpen={isOpen} onClose={onClose}>
                    <Actionsheet.Content style={{ backgroundColor: '#ffeeb6' }}>
                        <Box w="100%" px={4} justifyContent="center" alignItems="center">
                            <Image source={notifiEndVideo} />
                        </Box>
                        <Box marginTop={4}>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#fff',
                                    paddingHorizontal: 24,
                                    paddingVertical: 8,
                                    borderRadius: 20,
                                    display: 'flex',
                                    flexDirection: 'row',
                                }}
                                onPress={() => {
                                    onClose();
                                    if (videoRef.current) {
                                        videoRef.current.playFromPositionAsync(0);
                                    }
                                }}
                            >
                                <MaterialIcons
                                    name="replay"
                                    size={20}
                                    color="#f77d68"
                                    style={{ fontWeight: 'bold', marginTop: 2, marginRight: 4 }}
                                />
                                <Text style={{ color: '#f77d68', fontWeight: 'bold', fontSize: 20 }}>
                                    {t('Replay')}
                                </Text>
                            </TouchableOpacity>
                        </Box>
                        <Box
                            w="100%"
                            justifyContent="space-between"
                            alignItems="center"
                            display="flex"
                            flexDirection="row"
                            marginTop={6}
                            flexWrap="wrap"
                        >
                            <Box width="50%" justifyContent="center" alignItems="center">
                                <AntDesign name="heart" size={24} color="#f77d68" />
                                <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{t('Favorite')}</Text>
                            </Box>
                            <Box width="50%" justifyContent="center" alignItems="center">
                                <TouchableOpacity
                                    style={{ justifyContent: 'center', alignItems: 'center' }}
                                    onPress={() => goToLesson('ClassroomScreen')}
                                >
                                    <FontAwesome name="puzzle-piece" size={24} color="#f77d68" />
                                    <Text style={{ fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>
                                        {t('More Lesson')}
                                    </Text>
                                </TouchableOpacity>
                            </Box>
                            <Box width="50%" justifyContent="center" alignItems="center" marginTop={4}>
                                <TouchableOpacity
                                    style={{ justifyContent: 'center', alignItems: 'center' }}
                                    onPress={() => navigation.replace('BottomNavigation', { screen: 'StoreScreen' })}
                                >
                                    <FontAwesome5 name="shopping-cart" size={24} color="#f77d68" />
                                    <Text style={{ fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>
                                        {t('Go to store')}
                                    </Text>
                                </TouchableOpacity>
                            </Box>
                            <Box width="50%" justifyContent="center" alignItems="center" marginTop={4}>
                                <TouchableOpacity
                                    style={{ justifyContent: 'center', alignItems: 'center' }}
                                    onPress={() => goToLesson('LearningPathScreen')}
                                >
                                    <FontAwesome5 name="bus" size={24} color="#f77d68" />
                                    <Text style={{ fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>
                                        {t('Learning path')}
                                    </Text>
                                </TouchableOpacity>
                            </Box>
                        </Box>

                        <Box marginTop={4}>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#f77d68',
                                    paddingHorizontal: 24,
                                    paddingVertical: 8,
                                    borderRadius: 20,
                                    display: 'flex',
                                    flexDirection: 'row',
                                }}
                                onPress={() => onVideoEnded()}
                            >
                                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 20 }}>{t('Continue')}</Text>

                                <AntDesign
                                    name="right"
                                    size={20}
                                    color="white"
                                    style={{ fontWeight: 'bold', marginTop: 2, marginLeft: 4 }}
                                />
                            </TouchableOpacity>
                        </Box>
                    </Actionsheet.Content>
                </Actionsheet>
            </NativeBaseProvider>
        </View>
    );
};

export default JoyQDetail;
