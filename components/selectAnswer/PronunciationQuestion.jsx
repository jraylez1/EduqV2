import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { uk_flag, us_flag } from '../../assets';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import axios from 'axios';

const PronunciationQuestion = ({ data }) => {
    const { t } = useTranslation();
    const [recording, setRecording] = useState(null);
    const [recordingStatus, setRecordingStatus] = useState('idle');
    const [audioPermission, setAudioPermission] = useState(null);
    const [voice, setVoice] = useState('uk');
    const [isRecording, setIsRecording] = useState(false);

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

                const playbackObject = new Audio.Sound();
                await playbackObject.loadAsync({ uri: fileMp3Uri });
                await playbackObject.playAsync();

                // const formData = new FormData();
                // formData.append('file', {
                //     uri: fileMp3Uri,
                //     type: 'audio/mpeg',
                //     name: fileName,
                // });
                // formData.append('expectedText', 'Hello');
                // formData.append('extension', 'mp3');

                // const serverRecordingUri = `http://192.168.10.16/erp-pronounciation/pronunciation/file/uk/${fileName}`;

                // const response = await axios.post(serverRecordingUri, formData, {
                //     headers: {
                //         'Content-Type': 'audio/mp3',
                //     },
                // });

                // console.log('Upload successful', response.data);

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
            <View
                style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', marginTop: 16 }}
            >
                <TouchableOpacity
                    style={{ width: '50%', justifyContent: 'center', alignItems: 'center', borderRadius: 6 }}
                    onPress={() => setVoice('uk')}
                >
                    <Image
                        source={uk_flag}
                        style={{
                            width: 120,
                            height: 64,
                            objectFit: 'cover',
                            borderRadius: 6,
                            borderWidth: voice === 'uk' ? 2 : 0,
                            borderColor: '#4da09f',
                            opacity: voice === 'uk' ? 1 : 0.4,
                        }}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ width: '50%', justifyContent: 'center', alignItems: 'center', borderRadius: 6 }}
                    onPress={() => setVoice('us')}
                >
                    <Image
                        source={us_flag}
                        style={{
                            width: 120,
                            height: 64,
                            objectFit: 'cover',
                            borderRadius: 6,
                            borderWidth: voice === 'us' ? 2 : 0,
                            borderColor: '#4da09f',
                            opacity: voice === 'us' ? 1 : 0.4,
                        }}
                    />
                </TouchableOpacity>
            </View>
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

            {/* <View style={{ paddingVertical: 32, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: '400', color: '#0dcaf0' }}>Kết quả: </Text>
                <Text style={{ fontSize: 32, fontWeight: '600', color: '#dc3545' }}>Tổng điểm </Text>
            </View> */}
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

export default PronunciationQuestion;
