import { View, Text } from 'react-native';
import React from 'react';

const PronunciationWords = ({ words }) => {
    const getPhonemeColor = (phonemeScore) => {
        if (phonemeScore >= 0 && phonemeScore < 40) {
            return '#ee756e';
        } else if (phonemeScore >= 40 && phonemeScore <= 80) {
            return '#fee29d';
        } else if (phonemeScore >= 80) {
            return '#629e4b';
        }

        return '#000000';
    };
    return (
        <View>
            {words.map((item, index) => (
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
                    <Text style={{ color: '#3ca09e', fontSize: 20, fontWeight: 'bold' }}>{item?.word_text}</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {item?.phonemes.map((phoneme, index) => (
                            <View style={{ marginVertical: 8, marginHorizontal: 4 }} key={index}>
                                <View
                                    style={{
                                        backgroundColor: getPhonemeColor(phoneme?.phoneme_score),
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
                                        {phoneme?.ipa_label}
                                    </Text>
                                </View>
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        fontWeight: 'bold',
                                        marginTop: 8,
                                    }}
                                >
                                    {phoneme?.phoneme_score}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
            ))}
        </View>
    );
};

export default PronunciationWords;
