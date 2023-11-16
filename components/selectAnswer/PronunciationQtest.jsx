import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import { PronunciationStore } from '../../services/pronunciation';
import CircularProgress from '../progressBar/CircularProgress';
import LineProgress from '../progressBar/LineProgress';
import { AntDesign } from '@expo/vector-icons';

const PronunciationQtest = ({ data, onSelectAnswer, accent, setIsFinishAnswer }) => {
    const { t } = useTranslation();
    const [recording, setRecording] = useState(null);
    const [recordingStatus, setRecordingStatus] = useState('idle');
    const [audioPermission, setAudioPermission] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingResult, setRecordingResult] = useState(null);
    const [cefrProgress, setCefrProgress] = useState(0);
    const [isOpenPronunciation, setIsOpenPronunciation] = useState(false);

    const selectQuestion = (item) => {
        onSelectAnswer(item);
    };
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
                    data.data.text,
                    accent,
                );

                setRecordingResult(response);
                await updateCefrProgress(response.english_proficiency_scores.mock_cefr.prediction);
                const jsonString = JSON.stringify({ words: response.words });
                selectQuestion(jsonString);
                setRecording(null);
                setRecordingStatus('stopped');
                setIsFinishAnswer(true);
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
    const updateCefrProgress = (prediction) => {
        switch (prediction) {
            case 'A1':
                setCefrProgress(17);
                break;
            case 'A2':
                setCefrProgress(32);
                break;
            case 'B1':
                setCefrProgress(49);
                break;
            case 'B2':
                setCefrProgress(66);
                break;
            case 'C1':
                setCefrProgress(83);
                break;
            case 'C2':
                setCefrProgress(100);
                break;
            default:
                setCefrProgress(0);
                break;
        }
    };
    return (
        <ScrollView
            style={{
                paddingHorizontal: 16,
                marginTop: 16,
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
                {data.data.text}
            </Text>
            <Text
                style={{
                    textAlign: 'center',
                    fontSize: 18,
                    lineHeight: 28,
                    fontWeight: '400',
                    color: '#198754',
                }}
            >
                {data.data.ipa}
            </Text>

            <View style={{ paddingVertical: 32, justifyContent: 'center', alignItems: 'center' }}>
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
                            onPress={handleRecordButtonPress}
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
                        onPress={handleRecordButtonPress}
                    >
                        <FontAwesome name="microphone" size={80} color="#4da09f" />
                    </TouchableOpacity>
                )}
            </View>
            <Text style={{ alignItems: 'center', fontSize: 16, fontWeight: '500', textAlign: 'center' }}>
                {t(
                    'You need to speak no more than 45 seconds. Click the microphone button above to start recording, pause for a moment and then start speaking. Once you have finished your attempt, click the stop button and your audio will be submitted.',
                )}
            </Text>

            {recordingResult ? (
                <View
                    style={{
                        marginVertical: 32,
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
                            padding: 16,
                            borderRadius: 16,
                        }}
                    >
                        {t('Pronunciation results')}
                    </Text>
                    <View style={{ marginVertical: 16 }}>
                        <Text style={{ textAlign: 'center', marginBottom: 16, fontSize: 24, fontWeight: 'bold' }}>
                            {t('Overall score')}
                        </Text>
                        <CircularProgress progress={recordingResult.overall_score} radius={70} strokeWidth={15} />
                    </View>
                    <View style={{ borderBottomWidth: 2, borderBottomColor: '#3ca09e', borderStyle: 'dotted' }}>
                        <Text style={{ textAlign: 'center', marginBottom: 16, fontSize: 24, fontWeight: 'bold' }}>
                            {t('English proficiency scrores')}
                        </Text>
                        <View>
                            <View>
                                <Text style={{ textAlign: 'left', marginBottom: 4, fontSize: 20, fontWeight: '300' }}>
                                    Mock IELTS
                                </Text>
                                <LineProgress
                                    progress={recordingResult.english_proficiency_scores.mock_ielts.prediction * 10}
                                    width={320}
                                    height={10}
                                    strokeWidth={50}
                                    title={recordingResult.english_proficiency_scores.mock_ielts.prediction}
                                />
                            </View>
                            <View>
                                <Text style={{ textAlign: 'left', marginBottom: 4, fontSize: 20, fontWeight: '300' }}>
                                    Mock PTE
                                </Text>

                                <LineProgress
                                    progress={recordingResult.english_proficiency_scores.mock_pte.prediction}
                                    width={320}
                                    height={10}
                                    strokeWidth={50}
                                    title={recordingResult.english_proficiency_scores.mock_pte.prediction}
                                />
                            </View>

                            <View>
                                <Text
                                    style={{
                                        textAlign: 'left',
                                        marginBottom: 4,
                                        fontSize: 20,
                                        fontWeight: '300',
                                    }}
                                >
                                    Mock CEFR
                                </Text>
                                <LineProgress
                                    progress={cefrProgress}
                                    width={320}
                                    height={10}
                                    strokeWidth={50}
                                    title={recordingResult.english_proficiency_scores.mock_cefr.prediction}
                                />
                            </View>
                        </View>
                    </View>
                    <View>
                        <TouchableOpacity
                            onPress={() => setIsOpenPronunciation(!isOpenPronunciation)}
                            style={{
                                width: 320,
                                backgroundColor: isOpenPronunciation ? '#3ca09e' : '#d5edeb',
                                padding: 12,
                                marginTop: 8,
                                borderRadius: 8,
                            }}
                        >
                            <View
                                style={{
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    width: '100%',
                                }}
                            >
                                <Text style={{ color: isOpenPronunciation ? '#fff' : '#0dcaf0' }}>
                                    {t('Pronunciation')}
                                </Text>
                                {isOpenPronunciation ? (
                                    <AntDesign
                                        name="up"
                                        size={20}
                                        style={{ color: isOpenPronunciation ? '#fff' : '#0dcaf0' }}
                                    />
                                ) : (
                                    <AntDesign
                                        name="down"
                                        size={20}
                                        style={{ color: isOpenPronunciation ? '#fff' : '#0dcaf0' }}
                                    />
                                )}
                            </View>
                        </TouchableOpacity>

                        {isOpenPronunciation &&
                            recordingResult.words.map((item, index) => (
                                <View
                                    key={index}
                                    style={{
                                        backgroundColor: '#f8fdfd',
                                        padding: 8,
                                        borderRadius: 6,
                                        marginVertical: 8,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text style={{ color: '#3ca09e', fontSize: 20, fontWeight: 'bold' }}>
                                        {item.word_text}
                                    </Text>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                        {item.phonemes.map((phoneme, index) => (
                                            <View style={{ marginVertical: 8, marginHorizontal: 4 }} key={index}>
                                                <View
                                                    style={{
                                                        backgroundColor: '#629e48',
                                                        paddingVertical: 10,
                                                        paddingHorizontal: 16,
                                                        borderRadius: 6,
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            textAlign: 'center',
                                                            color: '#fff',
                                                            fontWeight: 'bold',
                                                        }}
                                                    >
                                                        {phoneme.ipa_label}
                                                    </Text>
                                                </View>
                                                <Text style={{ textAlign: 'center', fontWeight: 'bold', marginTop: 8 }}>
                                                    {phoneme.phoneme_score}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            ))}
                    </View>
                </View>
            ) : (
                <></>
            )}
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

export default PronunciationQtest;
