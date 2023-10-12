import { View, Text, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AntDesign, Entypo, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { quiz_pattern } from '../../assets';
import { NativeBaseProvider, Center, Modal, Button } from 'native-base';
import { CourseStore } from '../../services/course';

const QuestionScreen = ({ route }) => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const idLesson = route?.params.idLesson;
    const [question, setQuestion] = useState(route?.params?.data);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answerQuestions, setAnswerQuestions] = useState([]);
    const [recording, setRecording] = useState();
    const [showModal, setShowModal] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: t('Multiple-choice question'),
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: '#081D49',
            },
            headerTintColor: '#fff',
        });
    }, [navigation]);

    const handleNextQuestion = () => {
        if (currentQuestionIndex < question.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };
    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const selectQuestion = (selectedAnswerIndex) => {
        const currentQuestion = question.questions[currentQuestionIndex];
        const updatedAnswerQuestions = [...answerQuestions];

        const existingQuestion = updatedAnswerQuestions.find((q) => q.id === currentQuestion.id);

        const selectedAnswerIds = currentQuestion.data
            .map((answer, index) => (index === selectedAnswerIndex ? answer.idAnswer : null))
            .filter((id) => id !== null);

        if (existingQuestion) {
            existingQuestion.answers = selectedAnswerIds;
        } else {
            updatedAnswerQuestions.push({
                id: currentQuestion.id,
                answers: selectedAnswerIds,
            });
        }

        setAnswerQuestions(updatedAnswerQuestions);

        const updatedQuestions = [...question.questions];

        updatedQuestions[currentQuestionIndex].data.forEach((answer, index) => {
            answer.selected = index === selectedAnswerIndex;
        });

        setQuestion({ ...question, questions: updatedQuestions });
    };

    const startRecording = async () => {
        setRecording(true);
    };

    const stopRecording = async () => {
        setRecording(false);
    };
    const finishQuestion = async () => {
        const doQuestion = await CourseStore.doQuestions(
            question.extendData.course.aliasUrl,
            idLesson,
            question.extendData.course.studyRoutes[0].id,
            true,
            answerQuestions,
            question.extendData.course.studyRoutes[0].aliasUrl,
        );
        setShowModal(false);
        const freeQVideoData = await CourseStore.getLesson(
            question.extendData.course.aliasUrl,
            idLesson,
            question.extendData.course.studyRoutes[0].aliasUrl,
            true,
        );
        navigation.navigate('VideoScreen', { data: freeQVideoData });
    };

    return (
        <View style={{ backgroundColor: '#eff6ff', height: '100%', padding: 4, position: 'relative' }}>
            <ImageBackground source={quiz_pattern} resizeMode="cover" style={{ flex: 1, paddingHorizontal: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: '#081D49', fontSize: 24, lineHeight: 28, fontWeight: '400' }}>
                        Câu hỏi trắc nghiệm
                    </Text>
                    <Text style={{ color: '#081D49', fontSize: 24, lineHeight: 28, fontWeight: '400' }}>
                        {question.questions[currentQuestionIndex].sortIndex + 1}
                        {'/'}
                        {question.questions.length}
                    </Text>
                </View>
                {question.questions[currentQuestionIndex].idType != 3 ? (
                    <>
                        <View style={{ width: '100%', marginTop: 8 }}>
                            <Text style={{ color: '#081D49', fontSize: 24, lineHeight: 28, fontWeight: '600' }}>
                                {question.questions[currentQuestionIndex].question}
                            </Text>
                        </View>

                        <View>
                            <FlatList
                                data={question.questions[currentQuestionIndex].data}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity
                                        style={{
                                            padding: 12,
                                            borderRadius: 8,
                                            marginTop: 16,
                                            borderWidth: 2,
                                            borderColor: '#ddd',
                                            backgroundColor: item.selected ? '#2dd4bf' : '#fff',
                                            borderColor: item.selected ? '#2dd4bf' : '#081D49',
                                        }}
                                        onPress={() => selectQuestion(index)}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 18,
                                                lineHeight: 28,
                                                fontWeight: '500',
                                                color: item.selected ? '#fff' : '#081D49',
                                            }}
                                        >
                                            {String.fromCharCode(65 + index)}. {item.answer}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                                keyExtractor={(item) => item.idAnswer}
                            />
                        </View>
                        {question.questions[currentQuestionIndex].result != null && (
                            <View
                                style={{
                                    padding: 8,
                                    marginVertical: 32,
                                }}
                            >
                                {question.questions[currentQuestionIndex].result.isCorrect ? (
                                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <FontAwesome5 name="smile" size={30} color="#0a7568" />
                                            <Text
                                                style={{
                                                    fontSize: 22,
                                                    lineHeight: 28,
                                                    color: '#0a7568',
                                                    marginLeft: 8,
                                                }}
                                            >
                                                {t('You have answered correctly')}
                                            </Text>
                                        </View>
                                        <Text style={{ fontSize: 20, lineHeight: 28, marginTop: 8 }}>
                                            {question.questions[currentQuestionIndex].explain}
                                        </Text>
                                    </View>
                                ) : (
                                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Entypo name="emoji-sad" size={30} color="#dc3545" />
                                            <Text
                                                style={{
                                                    fontSize: 20,
                                                    lineHeight: 28,
                                                    color: '#dc3545',
                                                    marginLeft: 8,
                                                }}
                                            >
                                                {t('You have answered incorrectly')}
                                            </Text>
                                        </View>
                                        <Text style={{ fontSize: 20, lineHeight: 28, marginTop: 8 }}>
                                            {question.questions[currentQuestionIndex].explain}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        )}
                    </>
                ) : (
                    <View style={{ flex: 1, marginTop: 16 }}>
                        <View
                            style={{
                                width: '100%',
                                paddingHorizontal: 8,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Text style={{ fontSize: 24, lineHeight: 28, fontWeight: '600' }}>
                                {question.questions[currentQuestionIndex].question}
                            </Text>
                        </View>
                        <View
                            style={{
                                paddingHorizontal: 16,
                                marginTop: 16,
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%',
                            }}
                        >
                            <Text
                                style={{
                                    textAlign: 'center',
                                    fontSize: 24,
                                    lineHeight: 28,
                                    fontWeight: '600',
                                    color: '#ff0000',
                                    textTransform: 'uppercase',
                                }}
                            >
                                {question.questions[currentQuestionIndex].data.text}
                            </Text>
                            <Text
                                style={{
                                    textAlign: 'center',
                                    fontSize: 18,
                                    lineHeight: 28,
                                    fontWeight: '400',
                                    color: '#198754',
                                    marginTop: 4,
                                }}
                            >
                                {question.questions[currentQuestionIndex].data.ipa}
                            </Text>
                            <View style={{ paddingVertical: 32 }}>
                                {recording ? (
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <TouchableOpacity
                                            style={{
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width: 120,
                                                height: 120,
                                                padding: 16,
                                                backgroundColor: '#9fe0df',
                                                borderRadius: 9999,
                                            }}
                                            onPress={stopRecording}
                                        >
                                            <FontAwesome name="stop" size={80} color="#4da09f" />
                                        </TouchableOpacity>
                                        <Text
                                            style={{
                                                justifyContent: 'center',
                                                fontSize: 18,
                                                lineHeight: 28,
                                                fontWeight: '400',
                                                color: '#dc3545',
                                                marginTop: 16,
                                            }}
                                        >
                                            Recording...
                                        </Text>
                                    </View>
                                ) : (
                                    <TouchableOpacity
                                        style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            width: 120,
                                            height: 120,
                                            padding: 16,
                                            backgroundColor: '#9fe0df',
                                            borderRadius: 9999,
                                        }}
                                        onPress={startRecording}
                                    >
                                        <FontAwesome name="microphone" size={80} color="#4da09f" />
                                    </TouchableOpacity>
                                )}
                            </View>

                            <Text
                                style={{ alignItems: 'center', fontSize: 18, fontWeight: '500', textAlign: 'center' }}
                            >
                                {t(
                                    'You need to speak no more than 45 seconds. Click the microphone button above to start recording, pause for a moment and then start speaking. Once you have finished your attempt, click the stop button and your audio will be submitted.',
                                )}
                            </Text>
                        </View>
                        {question.questions[currentQuestionIndex].result != null && (
                            <View
                                style={{
                                    padding: 8,
                                    marginVertical: 32,
                                }}
                            >
                                {question.questions[currentQuestionIndex].result.isCorrect ? (
                                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <FontAwesome5 name="smile" size={30} color="#0a7568" />
                                            <Text
                                                style={{
                                                    fontSize: 22,
                                                    lineHeight: 28,
                                                    color: '#0a7568',
                                                    marginLeft: 8,
                                                }}
                                            >
                                                {t('You have answered correctly')}
                                            </Text>
                                        </View>
                                        <Text style={{ fontSize: 20, lineHeight: 28, marginTop: 8 }}>
                                            {question.questions[currentQuestionIndex].explain}
                                        </Text>
                                    </View>
                                ) : (
                                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Entypo name="emoji-sad" size={30} color="#dc3545" />
                                            <Text
                                                style={{
                                                    fontSize: 20,
                                                    lineHeight: 28,
                                                    color: '#dc3545',
                                                    marginLeft: 8,
                                                }}
                                            >
                                                {t('You have answered incorrectly')}
                                            </Text>
                                        </View>
                                        <Text style={{ fontSize: 20, lineHeight: 28, marginTop: 8 }}>
                                            {question.questions[currentQuestionIndex].explain}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        )}
                    </View>
                )}

                <View
                    style={{
                        width: '100%',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        position: 'absolute',
                        bottom: 16,
                        left: 16,
                        right: 16,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
                            marginBottom: 8,
                        }}
                    >
                        {currentQuestionIndex > 0 ? (
                            <TouchableOpacity
                                style={{
                                    width: '48%',
                                    padding: 16,
                                    borderRadius: 8,
                                    backgroundColor: '#081D49',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                onPress={handlePreviousQuestion}
                            >
                                <AntDesign name="left" size={16} color="#fff" />
                                <Text style={{ color: '#fff', fontSize: 16, marginLeft: 8 }}>
                                    {t('Previous question')}
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <View></View>
                        )}

                        {currentQuestionIndex < question.questions.length - 1 ? (
                            <TouchableOpacity
                                style={{
                                    width: '48%',
                                    padding: 16,
                                    borderRadius: 8,
                                    backgroundColor: '#081D49',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                onPress={handleNextQuestion}
                            >
                                <Text style={{ color: '#fff', fontSize: 16, marginRight: 8 }}>
                                    {t('Next question')}
                                </Text>
                                <AntDesign name="right" size={16} color="#fff" />
                            </TouchableOpacity>
                        ) : (
                            <View style={{ width: '48%' }}></View>
                        )}
                    </View>
                    <TouchableOpacity
                        style={{
                            padding: 16,
                            borderRadius: 8,
                            backgroundColor: '#5eead4',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                        }}
                        onPress={() => setShowModal(true)}
                    >
                        <Text style={{ color: '#fff', fontSize: 16, marginRight: 8 }}>{t('Finish')}</Text>
                    </TouchableOpacity>
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
                                                onPress={() => {
                                                    setShowModal(false);
                                                }}
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
            </ImageBackground>
        </View>
    );
};

export default QuestionScreen;
