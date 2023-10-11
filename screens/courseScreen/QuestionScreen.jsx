import { View, Text, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { FontAwesome } from '@expo/vector-icons';
import { quiz_pattern } from '../../assets';
import { NativeBaseProvider, Center, Modal, Button } from 'native-base';
import { CourseStore } from '../../services/course';

const QuestionScreen = ({ route }) => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const idLesson = route?.params.idLesson;
    const [questions, setQuestions] = useState(route?.params?.data);
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
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };
    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    return (
        <View style={{ backgroundColor: '#eff6ff', height: '100%', padding: 4 }}>
            <ImageBackground source={quiz_pattern} resizeMode="cover" style={{ flex: 1, paddingHorizontal: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: '#081D49', fontSize: 24, lineHeight: 28, fontWeight: '400' }}>
                        Câu hỏi trắc nghiệm
                    </Text>
                    <Text style={{ color: '#081D49', fontSize: 24, lineHeight: 28, fontWeight: '400' }}>
                        {questions[currentQuestionIndex].sortIndex + 1}
                        {'/'}
                        {questions.length}
                    </Text>
                </View>
                {questions[currentQuestionIndex].idType == 1 ? (
                    <>
                        <View style={{ width: '100%', paddingHorizontal: 8 }}>
                            <Text style={{ color: '#081D49', fontSize: 24, lineHeight: 28, fontWeight: '600' }}>
                                {questions[currentQuestionIndex].question}
                            </Text>
                        </View>
                    </>
                ) : (
                    <View></View>
                )}
            </ImageBackground>
        </View>
    );
};

export default QuestionScreen;
