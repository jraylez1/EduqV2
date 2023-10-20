import { View, Text, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { uk_flag, us_flag } from '../../assets';
const PronunciationQuestion = ({ data, result }) => {
    const { t } = useTranslation();
    const [recording, setRecording] = useState(false);
    const [voice, setVoice] = useState('uk');
    const startRecording = () => {
        setRecording(true);
    };
    const stopRecording = () => {
        setRecording(false);
    };
    return (
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
            <View style={{ paddingVertical: 32 }}>
                {recording ? (
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
        </View>
    );
};

export default PronunciationQuestion;
