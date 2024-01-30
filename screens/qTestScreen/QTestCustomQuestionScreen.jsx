import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import React, { useLayoutEffect, useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { setHeaderOptions } from '../../assets/utils/setHeaderOptions ';
import { NativeBaseProvider, TextArea, Button } from 'native-base';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { AntDesign } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { FontAwesome } from '@expo/vector-icons';
import LineProgress from '../../components/progressBar/LineProgress';
import CircularProgress from '../../components/progressBar/CircularProgress';
import PronunciationAccordion from '../../components/selectAnswer/PronunciationAccordion';
import PronunciationWords from '../../components/selectAnswer/PronunciationWords';
import { PronunciationStore } from '../../services/pronunciation';

const QTestCustomQuestionScreen = ({ route }) => {
    const { data, accent } = route?.params;
    const navigation = useNavigation();
    const { t } = useTranslation();
    const [recording, setRecording] = useState(null);
    const [recordingStatus, setRecordingStatus] = useState('idle');
    const [audioPermission, setAudioPermission] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingResult, setRecordingResult] = useState(null);
    const [pronunciation, setPronunciation] = useState(false);

    useLayoutEffect(() => {
        const headerTitle = data.name;
        setHeaderOptions({ navigation, headerTitle });
    }, []);

    const validationSchema = Yup.object().shape({
        question: Yup.string().required('Please enter your information'),
    });

    const formik = useFormik({
        initialValues: {
            question: '',
        },
        validationSchema,
        onSubmit: async () => {
            handleRecordButtonPress();
        },
    });
    useEffect(() => {
        setRecordingResult(null);
        setPronunciation(false);
    }, []);

    useEffect(() => {
        async function getPermission() {
            await Audio.requestPermissionsAsync()
                .then((permission) => {
                    console.log('Permission Granted: ' + permission.granted);
                    setAudioPermission(permission.granted);
                })
                .catch((error) => {
                    console.log(error);
                });
        }

        getPermission();
        return () => {
            if (recording) {
                stopRecording();
            }
        };
    }, []);
    const getOverallPredictionDefault = (data) => {
        switch (data) {
            case 'A1':
                return 15;
            case 'A2':
                return 30;
            case 'B1':
                return 45;
            case 'B2':
                return 60;
            case 'C1':
                return 75;
            case 'C2':
                return 90;
            default:
                return 0;
        }
    };
    const startRecording = async () => {
        try {
            if (audioPermission) {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true,
                });
            }

            const newRecording = new Audio.Recording();
            console.log('Starting Recording');
            await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
            await newRecording.startAsync();
            setRecording(newRecording);
            setRecordingStatus('recording');
            setIsRecording(true);
        } catch (error) {
            console.error('Failed to start recording', error);
        }
    };
    const stopRecording = async () => {
        try {
            setIsRecording(false);
            if (recordingStatus === 'recording') {
                console.log('Stopping Recording');
                await recording.stopAndUnloadAsync();
                const recordingUri = recording.getURI();

                const fileName = `recording-${Date.now()}.mp3`;

                await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'recordings/', {
                    intermediates: true,
                });

                const fileMp3Uri = FileSystem.documentDirectory + 'recordings/' + `${fileName}`;
                await FileSystem.moveAsync({
                    from: recordingUri,
                    to: fileMp3Uri,
                });

                const response = await PronunciationStore.pronunciationQuest(
                    fileMp3Uri,
                    fileName,
                    formik.values.question,
                    data.id,
                    accent,
                );
                setRecordingResult(response);
                setRecording(null);
                setRecordingStatus('stopped');
            }
        } catch (error) {
            console.error('Failed to stop recording', error);
        }
    };
    const handleRecordButtonPress = async () => {
        if (recording) {
            const audioUri = await stopRecording(recording);
            if (audioUri) {
                console.log('Saved audio file to', savedUri);
            }
        } else {
            await startRecording();
        }
    };
    return (
        <ScrollView style={{ backgroundColor: '#fff', flex: 1 }}>
            <NativeBaseProvider>
                <View style={{ width: '100%', padding: 20 }}>
                    <TextArea
                        h={40}
                        placeholder={t('Type your question...')}
                        fontSize={18}
                        w="100%"
                        maxW="350"
                        value={formik.values.question}
                        onChangeText={formik.handleChange('question')}
                        onBlur={formik.handleBlur('question')}
                        style={{ backgroundColor: '#cccccc' }}
                    />
                    {formik.touched.question && formik.errors.question ? (
                        <Text style={{ marginTop: 4, color: '#F22C27' }}>{t(formik.errors.question)}</Text>
                    ) : null}
                </View>
            </NativeBaseProvider>
            <View
                style={{
                    marginTop: 16,
                    width: '100%',
                    paddingHorizontal: 20,
                }}
            >
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    {isRecording ? (
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: 110,
                                    height: 110,
                                    padding: 16,
                                    backgroundColor: '#9fe0df',
                                    borderRadius: 9999,
                                }}
                                onPress={formik.handleSubmit}
                            >
                                <FontAwesome name="stop" size={60} color="#4da09f" />
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
                                width: 110,
                                height: 110,
                                padding: 16,
                                backgroundColor: '#9fe0df',
                                borderRadius: 9999,
                            }}
                            onPress={formik.handleSubmit}
                        >
                            <FontAwesome name="microphone" size={80} color="#4da09f" />
                        </TouchableOpacity>
                    )}
                </View>
                <Text
                    style={{
                        alignItems: 'center',
                        fontSize: 15,
                        fontWeight: '500',
                        textAlign: 'center',
                        marginTop: 20,
                    }}
                >
                    {t(
                        'You need to speak no more than 45 seconds. Click the microphone button above to start recording, pause for a moment and then start speaking. Once you have finished your attempt, click the stop button and your audio will be submitted.',
                    )}
                </Text>
                {recordingResult ? (
                    <View
                        style={{
                            marginVertical: 20,
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: '400',
                                color: '#0dcaf0',
                                backgroundColor: '#d5edeb',
                                paddingVertical: 16,
                                paddingHorizontal: 40,
                                borderRadius: 800,
                            }}
                        >
                            {t('Pronunciation results')}
                        </Text>
                        <View>
                            <View style={{ marginVertical: 16 }}>
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        marginBottom: 16,
                                        fontSize: 24,
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {t('Overall score')}
                                </Text>
                                <CircularProgress
                                    progress={recordingResult?.overall_score}
                                    radius={70}
                                    strokeWidth={15}
                                    score={recordingResult?.overall_score}
                                />
                            </View>
                        </View>
                        <View style={{ borderBottomWidth: 2, borderBottomColor: '#3ca09e', borderStyle: 'dotted' }}>
                            <Text style={{ textAlign: 'center', marginBottom: 16, fontSize: 24, fontWeight: 'bold' }}>
                                {t('Speaking skills')}
                            </Text>
                            <View>
                                <View>
                                    <Text
                                        style={{
                                            textAlign: 'left',
                                            marginBottom: 4,
                                            fontSize: 16,
                                            fontWeight: '500',
                                        }}
                                    >
                                        {t('Mock IELTS')}
                                    </Text>
                                    <LineProgress
                                        progress={
                                            recordingResult?.english_proficiency_scores?.mock_ielts?.prediction * 10
                                        }
                                        width={300}
                                        height={10}
                                        strokeWidth={50}
                                        maxScoreText={9}
                                        minScoreText={0}
                                        score={recordingResult?.english_proficiency_scores?.mock_ielts?.prediction}
                                    />
                                </View>
                                <View>
                                    <Text
                                        style={{
                                            textAlign: 'left',
                                            marginBottom: 4,
                                            fontSize: 16,
                                            fontWeight: '500',
                                        }}
                                    >
                                        {t('Mock PTE')}
                                    </Text>
                                    <LineProgress
                                        progress={recordingResult?.english_proficiency_scores?.mock_pte.prediction}
                                        width={300}
                                        height={10}
                                        strokeWidth={50}
                                        maxScoreText={90}
                                        minScoreText={0}
                                        score={recordingResult?.english_proficiency_scores?.mock_pte.prediction}
                                    />
                                </View>
                                <View>
                                    <Text
                                        style={{
                                            textAlign: 'left',
                                            marginBottom: 4,
                                            fontSize: 16,
                                            fontWeight: '500',
                                        }}
                                    >
                                        {t('Mock CEFR')}
                                    </Text>
                                    <LineProgress
                                        progress={getOverallPredictionDefault(
                                            recordingResult?.english_proficiency_scores?.mock_cefr?.prediction,
                                        )}
                                        width={300}
                                        height={10}
                                        strokeWidth={50}
                                        maxScoreText={'C2'}
                                        minScoreText={'A1'}
                                        score={recordingResult?.english_proficiency_scores?.mock_cefr?.prediction}
                                    />
                                </View>
                            </View>
                        </View>
                        <View>
                            <PronunciationAccordion
                                checkData={pronunciation}
                                setData={setPronunciation}
                                text={'Pronunciation'}
                            />
                            {pronunciation ? <PronunciationWords words={recordingResult?.words} /> : <></>}
                        </View>
                    </View>
                ) : (
                    <></>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 128,
        height: 128,
        borderRadius: 64,
        backgroundColor: 'red',
    },
    recordingStatusText: {
        marginTop: 16,
    },
});
export default QTestCustomQuestionScreen;
