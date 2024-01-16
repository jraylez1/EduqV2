import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import { PronunciationStore } from '../../services/pronunciation';
import CircularProgress from '../progressBar/CircularProgress';
import PronunciationFeedback from '../selectAnswer/PronunciationFeedback';
import PronunciationAccordion from '../selectAnswer/PronunciationAccordion';
import PronunciationWords from '../selectAnswer/PronunciationWords';
import LineProgress from '../progressBar/LineProgress';

const PronunciationQtest = ({ data, onSelectAnswer, accent, setIsFinishAnswer }) => {
    const { t } = useTranslation();
    const [recording, setRecording] = useState(null);
    const [recordingStatus, setRecordingStatus] = useState('idle');
    const [audioPermission, setAudioPermission] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingResult, setRecordingResult] = useState(null);
    const [tabScore, setTabScore] = useState('IELTS');
    const [metadata, setMetadata] = useState(false);
    const [fluency, setFluency] = useState(false);
    const [pronunciation, setPronunciation] = useState(false);
    const [grammar, setGrammar] = useState(false);
    const [vocabulary, setVocabulary] = useState(false);

    const selectQuestion = (item) => {
        onSelectAnswer(item);
    };

    useEffect(() => {
        setRecordingResult(null);
        setMetadata(false);
        setFluency(false);
        setPronunciation(false);
        setGrammar(false);
        setVocabulary(false);
        setIsFinishAnswer(false);
    }, [data]);

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

                if (data.idType === 3) {
                    const response = await PronunciationStore.pronunciationQuest(
                        fileMp3Uri,
                        fileName,
                        data.data.text,
                        accent,
                    );
                    setRecordingResult(response);
                    const jsonString = JSON.stringify({ words: response.words });
                    selectQuestion(jsonString);
                } else if (data.idType === 4) {
                    const response = await PronunciationStore.scriptedQuest(
                        fileMp3Uri,
                        fileName,
                        data.questionContent,
                        accent,
                    );
                    setRecordingResult(response);
                    const jsonString = JSON.stringify({ words: response.pronunciation.words });
                    selectQuestion(jsonString);
                } else if (data.idType === 5) {
                    const response = await PronunciationStore.unscriptedQuest(
                        fileMp3Uri,
                        fileName,
                        data.questionContent,
                        accent,
                        data.explain,
                        data.question,
                    );
                    setRecordingResult(response);
                    const jsonString = JSON.stringify({ words: response.pronunciation.words });
                    selectQuestion(jsonString);
                }

                // await updateCefrProgress(response.english_proficiency_scores.mock_cefr.prediction);

                setRecording(null);
                setRecordingStatus('stopped');
                setIsFinishAnswer(true);
            }
        } catch (error) {
            console.error('Failed to stop recording', error);
        }
    };

    const getOverallPrediction = (data) => {
        if (tabScore === 'IELTS') {
            return data?.mock_ielts?.prediction * 10;
        } else if (tabScore === 'PTE') {
            return data?.mock_pte?.prediction;
        } else if (tabScore === 'CEFR') {
            switch (data?.mock_cefr?.prediction) {
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
        }
        return 0;
    };

    const getOverallScore = (data) => {
        if (tabScore === 'IELTS') {
            return data?.mock_ielts?.prediction;
        } else if (tabScore === 'PTE') {
            return data?.mock_pte?.prediction;
        } else if (tabScore === 'CEFR') {
            return data?.mock_cefr?.prediction;
        }
        return 0;
    };

    const getMaxScoreText = () => {
        if (tabScore === 'IELTS') {
            return '9';
        } else if (tabScore === 'PTE') {
            return '90';
        } else if (tabScore === 'CEFR') {
            return 'C2';
        }
        return 0;
    };

    const getMinScoreText = () => {
        if (tabScore === 'IELTS' || tabScore === 'PTE') {
            return '0';
        } else if (tabScore === 'CEFR') {
            return 'A1';
        }
        return 0;
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
        <ScrollView
            style={{
                marginTop: 16,
                width: '100%',
            }}
        >
            <Text
                style={{
                    textAlign: 'center',
                    fontSize: 18,
                    lineHeight: 28,
                    fontWeight: '600',
                    color: '#198754',
                    marginVertical: 8,
                }}
            >
                {data.questionContent === '' ? data?.data?.text : data.questionContent}
            </Text>
            <Text
                style={{
                    textAlign: 'center',
                    fontSize: 15,
                    lineHeight: 28,
                    fontWeight: '600',
                    color: '#dc3545',
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
            <Text style={{ alignItems: 'center', fontSize: 15, fontWeight: '500', textAlign: 'justify' }}>
                {t(
                    'You need to speak no more than 45 seconds. Click the microphone button above to start recording, pause for a moment and then start speaking. Once you have finished your attempt, click the stop button and your audio will be submitted.',
                )}
            </Text>

            {recordingResult ? (
                <>
                    {data.idType === 3 ? (
                        <View>
                            <Text>ok</Text>
                        </View>
                    ) : (
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
                            <View
                                style={{
                                    marginVertical: 20,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: '#e5e9ee',
                                    borderRadius: 800,
                                }}
                            >
                                <TouchableOpacity
                                    style={{
                                        width: '33%',
                                        backgroundColor: tabScore === 'IELTS' ? '#3ca09e' : '#e5e9ee',
                                        padding: 8,
                                        borderRadius: 800,
                                    }}
                                    onPress={() => setTabScore('IELTS')}
                                >
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            color: tabScore === 'IELTS' ? 'white' : 'black',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        IELTS
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                        width: '33%',
                                        backgroundColor: tabScore === 'PTE' ? '#3ca09e' : '#e5e9ee',
                                        padding: 8,
                                        borderRadius: 800,
                                    }}
                                    onPress={() => setTabScore('PTE')}
                                >
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            color: tabScore === 'PTE' ? 'white' : 'black',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        PTE
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                        width: '33%',
                                        backgroundColor: tabScore === 'CEFR' ? '#3ca09e' : '#e5e9ee',
                                        padding: 8,
                                        borderRadius: 800,
                                    }}
                                    onPress={() => setTabScore('CEFR')}
                                >
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            color: tabScore === 'CEFR' ? 'white' : 'black',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        CEFR
                                    </Text>
                                </TouchableOpacity>
                            </View>
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
                                        progress={getOverallPrediction(
                                            recordingResult.overall?.english_proficiency_scores,
                                        )}
                                        radius={70}
                                        strokeWidth={15}
                                        score={getOverallScore(recordingResult.overall?.english_proficiency_scores)}
                                    />
                                </View>
                            </View>
                            <View style={{ borderBottomWidth: 2, borderBottomColor: '#3ca09e', borderStyle: 'dotted' }}>
                                <Text
                                    style={{ textAlign: 'center', marginBottom: 16, fontSize: 24, fontWeight: 'bold' }}
                                >
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
                                            {t('Reading Fluency')}
                                        </Text>
                                        <LineProgress
                                            progress={getOverallPrediction(
                                                recordingResult.fluency.english_proficiency_scores,
                                            )}
                                            width={300}
                                            height={10}
                                            strokeWidth={50}
                                            maxScoreText={getMaxScoreText()}
                                            minScoreText={getMinScoreText()}
                                            score={getOverallScore(recordingResult.fluency.english_proficiency_scores)}
                                        />
                                    </View>
                                    {data.idType === 5 ? (
                                        <>
                                            <View>
                                                <Text
                                                    style={{
                                                        textAlign: 'left',
                                                        marginBottom: 4,
                                                        fontSize: 16,
                                                        fontWeight: '500',
                                                    }}
                                                >
                                                    {t('Vocabulary')}
                                                </Text>
                                                <LineProgress
                                                    progress={getOverallPrediction(
                                                        recordingResult?.vocabulary?.english_proficiency_scores,
                                                    )}
                                                    width={300}
                                                    height={10}
                                                    strokeWidth={50}
                                                    maxScoreText={getMaxScoreText()}
                                                    minScoreText={getMinScoreText()}
                                                    score={getOverallScore(
                                                        recordingResult?.vocabulary?.english_proficiency_scores,
                                                    )}
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
                                                    {t('Grammar')}
                                                </Text>
                                                <LineProgress
                                                    progress={getOverallPrediction(
                                                        recordingResult?.grammar?.english_proficiency_scores,
                                                    )}
                                                    width={300}
                                                    height={10}
                                                    strokeWidth={50}
                                                    maxScoreText={getMaxScoreText()}
                                                    minScoreText={getMinScoreText()}
                                                    score={getOverallScore(
                                                        recordingResult?.grammar?.english_proficiency_scores,
                                                    )}
                                                />
                                            </View>
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                    <View>
                                        <Text
                                            style={{
                                                textAlign: 'left',
                                                marginBottom: 4,
                                                fontSize: 16,
                                                fontWeight: '500',
                                            }}
                                        >
                                            {t('Pronunciation')}
                                        </Text>
                                        <LineProgress
                                            progress={getOverallPrediction(
                                                recordingResult.pronunciation.english_proficiency_scores,
                                            )}
                                            width={300}
                                            height={10}
                                            strokeWidth={50}
                                            maxScoreText={getMaxScoreText()}
                                            minScoreText={getMinScoreText()}
                                            score={getOverallScore(
                                                recordingResult.pronunciation.english_proficiency_scores,
                                            )}
                                        />
                                    </View>
                                </View>
                            </View>
                            <View>
                                <View>
                                    <PronunciationAccordion
                                        checkData={metadata}
                                        setData={setMetadata}
                                        text={'Content feedback'}
                                    />
                                    {metadata ? (
                                        <View>
                                            <PronunciationFeedback
                                                text={'The Predicted text'}
                                                feedback={recordingResult?.metadata?.predicted_text}
                                            />
                                            <PronunciationFeedback
                                                text={'Unscripted content relevance score'}
                                                feedback={recordingResult?.metadata?.content_relevance}
                                                isScore={true}
                                            />
                                        </View>
                                    ) : (
                                        <></>
                                    )}
                                </View>
                                <View>
                                    <PronunciationAccordion
                                        checkData={pronunciation}
                                        setData={setPronunciation}
                                        text={'Pronunciation'}
                                    />
                                    {pronunciation ? (
                                        <PronunciationWords words={recordingResult?.pronunciation?.words} />
                                    ) : (
                                        <></>
                                    )}
                                </View>
                                <View>
                                    <PronunciationAccordion
                                        checkData={fluency}
                                        setData={setFluency}
                                        text={'Fluency feedback'}
                                    />
                                    {fluency ? (
                                        <>
                                            <PronunciationFeedback
                                                text={'Detailed transcript'}
                                                feedback={data.questionContent}
                                                transcript={recordingResult?.fluency?.metrics}
                                            />
                                            <PronunciationFeedback
                                                text={'Speech rate'}
                                                feedback={
                                                    recordingResult?.fluency?.feedback?.speech_rate?.feedback_text
                                                }
                                            />
                                            <PronunciationFeedback
                                                text={'Number of pauses'}
                                                feedback={recordingResult?.fluency?.feedback?.pauses?.feedback_text}
                                            />
                                            <PronunciationFeedback
                                                text={'Number of filler words'}
                                                feedback={
                                                    recordingResult?.fluency?.feedback?.filler_words?.feedback_text
                                                }
                                            />
                                            <PronunciationFeedback
                                                text={'Filter words per minute'}
                                                feedback={recordingResult?.fluency?.metrics?.filler_words_per_min}
                                                isScore={true}
                                            />
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                </View>
                                {data.idType === 5 ? (
                                    <>
                                        <View>
                                            <PronunciationAccordion
                                                checkData={grammar}
                                                setData={setGrammar}
                                                text={'Grammar feedback'}
                                            />
                                            {grammar ? (
                                                <View>
                                                    <PronunciationFeedback
                                                        text={'Number of grammar mistakes'}
                                                        feedback={
                                                            recordingResult?.grammar?.grammar_feedback
                                                                ? recordingResult?.grammar?.grammar_feedback
                                                                : 'No comment'
                                                        }
                                                        mistake={recordingResult?.grammar?.metrics?.mistake_count}
                                                    />
                                                    <PronunciationFeedback
                                                        text={'Grammar complexity'}
                                                        feedback={
                                                            recordingResult?.grammar?.metrics?.grammatical_complexity
                                                        }
                                                        isScore={true}
                                                        haveBg={true}
                                                    />
                                                </View>
                                            ) : (
                                                <></>
                                            )}
                                        </View>
                                        <View>
                                            <PronunciationAccordion
                                                checkData={vocabulary}
                                                setData={setVocabulary}
                                                text={'Vocabulary feedback'}
                                            />
                                            {vocabulary ? (
                                                <View>
                                                    <PronunciationFeedback
                                                        text={'Vocabulary complexity'}
                                                        feedback={
                                                            recordingResult?.vocabulary?.metrics?.vocabulary_complexity
                                                        }
                                                        isScore={true}
                                                        haveBg={true}
                                                    />
                                                </View>
                                            ) : (
                                                <></>
                                            )}
                                        </View>
                                    </>
                                ) : (
                                    <></>
                                )}
                            </View>
                        </View>
                    )}
                </>
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
