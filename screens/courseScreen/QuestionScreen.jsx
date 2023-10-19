import { View, Text, TouchableOpacity } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import SingleSelect from '../../components/selectAnswer/SingleSelect';
import MultipleSelect from '../../components/selectAnswer/MultipleSelect';

import { AntDesign, Entypo, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { quiz_pattern } from '../../assets';
import { NativeBaseProvider, Center, Modal, Button, Checkbox } from 'native-base';
import { CourseStore } from '../../services/course';
const QuestionScreen = ({ route }) => {
    const navigation = useNavigation();
    const idLesson = route?.params.idLesson;
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questionData, setQuestionData] = useState([]);
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(false);
    const [data, setData] = useState(route?.params?.data);
    const [singleSelect, setSingleSelect] = useState([]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: 'Question',
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: '#081D49',
            },
            headerTintColor: '#fff',
        });
    }, [navigation]);

    const finishQuestion = async () => {
        // const doQuestion = await CourseStore.doQuestions(
        //     data.extendData.course.aliasUrl,
        //     idLesson,
        //     data.extendData.course.studyRoutes[0].id,
        //     true,
        //     answerQuestions,
        //     data.extendData.course.studyRoutes[0].aliasUrl,
        // );
        setShowModal(false);
        // const freeQVideoData = await CourseStore.getLesson(
        //     data.extendData.course.aliasUrl,
        //     idLesson,
        //     data.extendData.course.studyRoutes[0].aliasUrl,
        //     true,
        // );
        // navigation.navigate('VideoScreen', { data: freeQVideoData });
        console.log(questionData);
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
            <TouchableOpacity onPress={() => console.log(singleSelect)}>
                <Text>click me</Text>
            </TouchableOpacity>
            <SingleSelect setSingleSelect={setSingleSelect} />
        </View>
    );
};

export default QuestionScreen;
