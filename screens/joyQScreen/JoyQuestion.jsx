import { View, Text, TouchableOpacity } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import SingleSelect from '../../components/selectAnswer/SingleSelect';
import { AntDesign } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { NativeBaseProvider, Center, Modal, Button, Checkbox } from 'native-base';
import { CourseStore } from '../../services/course';
import PronunciationQuestion from '../../components/selectAnswer/PronunciationQuestion';

const JoyQuestion = ({ route }) => {
    const navigation = useNavigation();
    const idLesson = route?.params.idLesson;
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(false);
    const [data, setData] = useState(route?.params?.data);
    const [extendData, setExtendData] = useState(route?.params?.extendData);
    const [result, setResult] = useState(route?.params?.result);
    const [scrollViewRef, setScrollViewRef] = useState(route?.params?.scrollViewRef);
    const [isScroll, setIsScroll] = useState(route?.params?.isScroll);
    const [singleSelect, setSingleSelect] = useState([]);
    const [idCourse, setIdCourse] = useState(route?.params?.idCourse);
    const studyRouteAliasUrl = route?.params.studyRouteAliasUrl;
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: t('Question'),
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: '#023468',
            },
            headerTintColor: '#fff',
        });
    }, [navigation]);

    const handleNextQuestion = () => {
        if (currentQuestionIndex < data.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };
    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSelectAnswer = (idAnswer) => {
        const updatedQuestionData = [...data];
        const currentQuestion = updatedQuestionData[currentQuestionIndex];
        if (currentQuestion.idType === 1 || currentQuestion.idType === 3) {
            currentQuestion.answer = [idAnswer];
        } else if (currentQuestion.idType === 2) {
            const answerIndex = currentQuestion.answer.indexOf(idAnswer);
            if (answerIndex === -1) {
                currentQuestion.answer.push(idAnswer);
            } else {
                currentQuestion.answer.splice(answerIndex, 1);
            }
        }
        setData(updatedQuestionData);
    };

    const showModalQuestion = () => {
        const updatedSingleSelect = data.map((question) => ({
            id: question.id,
            answers: question.answer,
        }));
        setSingleSelect(updatedSingleSelect);
        setShowModal(true);
    };

    const finishQuestion = async () => {
        const doQuestion = await CourseStore.doQuestions(
            extendData.course.aliasUrl,
            idLesson,
            0,
            true,
            singleSelect,
            studyRouteAliasUrl,
        );
        setShowModal(false);

        if (doQuestion.data.url === '') {
            const freeQVideoData = await CourseStore.getLesson(
                extendData.course.aliasUrl,
                idLesson,
                studyRouteAliasUrl,
                true,
            );
            navigation.navigate('JoyQVideoScreen', { data: freeQVideoData, studyRouteAliasUrl: studyRouteAliasUrl });
            alert(doQuestion.message);
        } else {
            await alert(doQuestion.message);
            const match = doQuestion?.data?.url.match(/\/m-(\d+)\.html/);
            if (match) {
                const idLessonMatch = match[1];
                const freeQVideoData = await CourseStore.getLesson(
                    extendData.course.aliasUrl,
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
        }
    };

    return (
        <View
            style={{
                backgroundColor: '#eff6ff',
                height: '100%',
                padding: 8,
                flex: 1,
                alignItems: 'center',
            }}
        >
            <View style={{ width: '100%', position: 'relative', flex: 1, paddingHorizontal: 8 }}>
                <View style={{ flex: 1 }}>
                    <View style={{ width: '100%', marginTop: 8 }}>
                        <Text
                            style={{
                                color: '#023468',
                                fontSize: 24,
                                lineHeight: 28,
                                fontWeight: '600',
                            }}
                        >
                            {data[currentQuestionIndex].question}
                        </Text>
                    </View>

                    {data[currentQuestionIndex].idType === 1 || data[currentQuestionIndex].idType === 2 ? (
                        <SingleSelect
                            data={data[currentQuestionIndex]}
                            onSelectAnswer={handleSelectAnswer}
                            result={result}
                        />
                    ) : (
                        <PronunciationQuestion
                            data={data[currentQuestionIndex]}
                            result={result}
                            onSelectAnswer={handleSelectAnswer}
                            idCourse={idCourse}
                        />
                    )}
                </View>

                <View
                    style={{
                        width: '100%',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: 'row',
                        paddingTop: 8,
                    }}
                >
                    <TouchableOpacity
                        style={{
                            padding: 16,
                            borderRadius: 8,
                            backgroundColor: '#5eead4',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '50%',
                        }}
                        onPress={() => showModalQuestion()}
                    >
                        <Text style={{ color: '#fff', fontSize: 16, marginRight: 8, fontWeight: '500' }}>
                            {t('Submit')}
                        </Text>
                    </TouchableOpacity>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '48%',
                            marginLeft: 8,
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                width: '48%',
                                padding: 16,
                                borderRadius: 8,
                                backgroundColor: '#023468',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                opacity: currentQuestionIndex > 0 ? 1 : 0.4,
                            }}
                            onPress={handlePreviousQuestion}
                            disabled={currentQuestionIndex > 0 ? false : true}
                        >
                            <AntDesign name="left" size={20} color="#fff" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                width: '48%',
                                padding: 16,
                                borderRadius: 8,
                                backgroundColor: '#023468',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                opacity: currentQuestionIndex < data.length - 1 ? 1 : 0.4,
                            }}
                            onPress={handleNextQuestion}
                            disabled={currentQuestionIndex < data.length - 1 ? false : true}
                        >
                            <AntDesign name="right" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <NativeBaseProvider>
                        <Center>
                            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                                <Modal.Content maxWidth="400px">
                                    <Modal.CloseButton />
                                    <Modal.Header>{t('EduQ Notification')}</Modal.Header>
                                    <Modal.Body>
                                        <Text style={{ textAlign: 'justify' }}>
                                            {t('Do you really want to finish this exercise?')}
                                        </Text>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button.Group space={2}>
                                            <Button
                                                variant="ghost"
                                                colorScheme="blueGray"
                                                onPress={() => setShowModal(false)}
                                            >
                                                {t('Cancel')}
                                            </Button>
                                            <Button onPress={() => finishQuestion()}>OK</Button>
                                        </Button.Group>
                                    </Modal.Footer>
                                </Modal.Content>
                            </Modal>
                        </Center>
                    </NativeBaseProvider>
                </View>
            </View>
        </View>
    );
};

export default JoyQuestion;
