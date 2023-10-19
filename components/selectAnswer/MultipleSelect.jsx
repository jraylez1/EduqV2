import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AntDesign } from '@expo/vector-icons';
import { NativeBaseProvider, Center, Modal, Button } from 'native-base';

const SingleSelect = ({ setSingleSelect }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const { t } = useTranslation();
    const [data, setData] = useState([
        {
            id: 'id1',
            question: 'Đâu là con vật có 4 chân',
            idType: 2,
            answer: null,
            data: [
                {
                    answer: 'Con chó',
                    idAnswer: 'idAnswer1',
                    selected: true,
                },
                {
                    answer: 'Con ca',
                    idAnswer: 'idAnswer2',
                    selected: false,
                },
            ],
        },
        {
            id: 'id2',
            question: 'Đâu là màu sắc',
            idType: 2,
            answer: null,
            data: [
                {
                    answer: 'Xanh',
                    idAnswer: 'idAnswer3',
                    selected: true,
                },
                {
                    answer: 'Đỏ',
                    idAnswer: 'idAnswer4',
                    selected: true,
                },
                {
                    answer: 'Con chó',
                    idAnswer: 'idAnswer5',
                    selected: false,
                },
            ],
        },
        {
            id: 'id3',
            question: 'Đâu là thủ đô của Việt Nam',
            idType: 2,
            answer: null,
            data: [
                {
                    answer: 'Ha Noi',
                    idAnswer: 'idAnswer6',
                    selected: true,
                },
                {
                    answer: 'Hai Phong',
                    idAnswer: 'idAnswer7',
                    selected: false,
                },
            ],
        },
    ]);

    const selectQuestion = (item) => {
        const answerIndex = data[currentQuestionIndex].data.findIndex((answer) => answer.idAnswer === item.idAnswer);

        if (answerIndex !== -1) {
            setData((prevData) => {
                prevData[currentQuestionIndex].answer = item.idAnswer;
                return [...prevData];
            });
        }
    };

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

    const finishQuestion = () => {
        const selectedData = data.map((question) => {
            const selectedAnswer = question.data.find((answer) => answer.idAnswer === question.answer);
            return {
                id: question.id,
                answers: selectedAnswer ? [selectedAnswer.idAnswer] : [],
            };
        });
        setSingleSelect(selectedData);
        setShowModal(false);
    };

    return (
        <View style={{ width: '100%', position: 'relative', flex: 1, paddingHorizontal: 8 }}>
            <View style={{ width: '100%', marginTop: 8 }}>
                <Text style={{ color: '#081D49', fontSize: 24, lineHeight: 28, fontWeight: '600' }}>
                    {data[currentQuestionIndex].question}
                </Text>
            </View>

            <View>
                <FlatList
                    data={data[currentQuestionIndex].data}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            style={{
                                padding: 12,
                                borderRadius: 8,
                                marginTop: 16,
                                borderWidth: 2,
                                borderColor: '#ddd',
                                backgroundColor:
                                    data[currentQuestionIndex].answer == item.idAnswer ? '#2dd4bf' : '#fff',
                                borderColor: data[currentQuestionIndex].answer == item.idAnswer ? '#2dd4bf' : '#081D49',
                            }}
                            onPress={() => selectQuestion(item)}
                        >
                            <Text
                                style={{
                                    fontSize: 18,
                                    lineHeight: 28,
                                    fontWeight: '500',
                                    color: data[currentQuestionIndex].answer == item.idAnswer ? '#fff' : '#081D49',
                                }}
                            >
                                {String.fromCharCode(65 + index)}. {item.answer}
                            </Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.idAnswer}
                />
            </View>

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
                            <Text style={{ color: '#fff', fontSize: 16, marginLeft: 8 }}>{t('Previous question')}</Text>
                        </TouchableOpacity>
                    ) : (
                        <View></View>
                    )}

                    {currentQuestionIndex < data.length - 1 ? (
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
                            <Text style={{ color: '#fff', fontSize: 16, marginRight: 8 }}>{t('Next question')}</Text>
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
        </View>
    );
};

export default SingleSelect;
