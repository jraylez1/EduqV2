import { View, Text, TouchableOpacity, Image, ScrollView, Button } from 'react-native';
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
    const [voice, setVoice] = useState('uk');
    const [isRecording, setIsRecording] = useState(false);

    const startRecording = async () => {
        try {
            const { status } = await Audio.requestPermissionsAsync();
            if (status !== 'granted') {
                console.error('Permission to access audio was denied');
                return;
            }

            const recording = new Audio.Recording();
            await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
            await recording.startAsync();
            setRecording(recording);
            setIsRecording(true);
        } catch (error) {
            console.error('Lỗi khi bắt đầu ghi âm: ', error);
        }
    };

    const stopRecording = async () => {
        try {
            await recording.stopAndUnloadAsync();
            setIsRecording(false);

            const uri = await recording.getURI();

            const formData = new FormData();
            formData.append('file', {
                uri,
                type: 'audio/mpeg',
                name: 'recording.mp3',
            });
            formData.append('expectedText', 'Hello');
            formData.append('extension', 'mp3');

            const response = await axios.post(
                `http://192.168.10.16/erp-pronounciation/pronunciation/file/uk`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            );

            console.log('Upload successful', response.data);
        } catch (error) {
            console.error('Lỗi khi dừng ghi âm hoặc lưu tệp: ', error);
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
                            onPress={stopRecording}
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
                        onPress={startRecording}
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

            <View style={{ paddingVertical: 32, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: '400', color: '#0dcaf0' }}>Kết quả: </Text>
                <Text style={{ fontSize: 32, fontWeight: '600', color: '#dc3545' }}>Tổng điểm </Text>
            </View>
        </ScrollView>
    );
};

export default PronunciationQuestion;
