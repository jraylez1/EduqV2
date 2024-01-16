import { View, Text, TouchableOpacity } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { NativeBaseProvider, Center, Modal, Button, Checkbox } from 'native-base';
import PronunciationQtest from '../../components/selectAnswer/PronunciationQtest';
import { CourseStore } from '../../services/course';
const QTestQuestionScreen = ({ route }) => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const [accent, setAccent] = useState(route?.params?.accent);
    const [extendData, setExtendData] = useState(route?.params?.data.extendData);
    const [data, setData] = useState(route?.params?.data.questions);
    const [result, setResult] = useState(route?.params?.data.result);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [isFinishAnswer, setIsFinishAnswer] = useState(false);
    const [singleSelect, setSingleSelect] = useState([]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: t('Question'),
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: '#081D49',
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
        currentQuestion.answer = [idAnswer];
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
            0,
            extendData.studyRoute.id,
            true,
            singleSelect,
        );
        navigation.navigate('QTestAverageScreen', {
            data: doQuestion.data,
            aliasUrl: extendData.course.aliasUrl,
            idStudyRoute: extendData.studyRoute.id,
            accent: accent,
        });
        setShowModal(false);
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
                        <Text style={{ color: '#081D49', fontSize: 24, lineHeight: 28, fontWeight: '600' }}>
                            {data[currentQuestionIndex].question}
                        </Text>
                    </View>

                    <PronunciationQtest
                        data={data[currentQuestionIndex]}
                        onSelectAnswer={handleSelectAnswer}
                        accent={accent}
                        setIsFinishAnswer={setIsFinishAnswer}
                    />
                </View>

                {isFinishAnswer ? (
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
                                {t('View report')}
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
                                    backgroundColor: '#081D49',
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
                                    backgroundColor: '#081D49',
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
                ) : (
                    <></>
                )}
            </View>
        </View>
    );
};

export default QTestQuestionScreen;
