import { View, Text } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';

const PronunciationFeedback = ({ text, feedback, isScore, transcript, mistake, haveBg }) => {
    const { t } = useTranslation();

    return (
        <View>
            <View
                style={{
                    backgroundColor: '#f8fdfd',
                    borderLeftColor: '#3ca09e',
                    borderLeftWidth: 3,
                    borderStyle: 'solid',
                    paddingHorizontal: 24,
                    marginVertical: 8,
                    marginBottom: 8,
                    borderRadius: 12,
                    display: 'flex',
                    flexDirection: isScore ? 'row' : 'column',
                    justifyContent: isScore ? 'space-between' : 'flex-start',
                    alignItems: isScore ? 'center' : 'flex-start',
                }}
            >
                <View
                    style={{
                        width: isScore ? 'auto' : '100%',
                        borderStyle: 'solid',
                        borderBottomColor: '#dde0e1',
                        borderBottomWidth: isScore ? 0 : 2,
                        paddingVertical: 8,
                        justifyContent: 'space-between',
                    }}
                >
                    <Text style={{ color: '#3ca09e', fontSize: 16, fontWeight: '700' }}>{text}</Text>
                    {mistake ? (
                        <Text style={{ color: '#3ca09e', fontSize: 16, fontWeight: '700' }}>{mistake}</Text>
                    ) : (
                        <></>
                    )}
                </View>
                <View style={{ padding: 4, marginVertical: 8 }}>
                    {transcript ? (
                        <View
                            style={{
                                width: 280,
                                display: 'flex',
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                            }}
                        >
                            <View style={{ marginRight: 12 }}>
                                <View
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        margin: 4,
                                    }}
                                >
                                    <View
                                        style={{
                                            backgroundColor: '#dfdffc',
                                            borderRadius: 800,
                                            paddingHorizontal: 10,
                                            paddingVertical: 4,
                                            marginRight: 4,
                                        }}
                                    >
                                        <Text style={{ fontWeight: 'bold', fontSize: 14 }}>
                                            {transcript?.discourse_markers ? transcript?.discourse_markers : 0}
                                        </Text>
                                    </View>
                                    <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Connectives</Text>
                                </View>

                                <View
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        margin: 4,
                                    }}
                                >
                                    <View
                                        style={{
                                            backgroundColor: '#bcf2fc',
                                            borderRadius: 800,
                                            paddingHorizontal: 10,
                                            paddingVertical: 4,
                                            marginRight: 4,
                                        }}
                                    >
                                        <Text style={{ fontWeight: 'bold', fontSize: 14 }}>
                                            {transcript?.repetitions ? transcript?.repetitions : 0}
                                        </Text>
                                    </View>
                                    <Text style={{ fontWeight: 'bold', fontSize: 14 }}>word repetitions</Text>
                                </View>
                            </View>
                            <View>
                                <View
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        margin: 4,
                                    }}
                                >
                                    <View
                                        style={{
                                            backgroundColor: '#f8e4ca',
                                            borderRadius: 800,
                                            paddingHorizontal: 10,
                                            paddingVertical: 4,
                                            marginRight: 4,
                                        }}
                                    >
                                        <Text style={{ fontWeight: 'bold', fontSize: 14 }}>
                                            {transcript?.filler_words ? transcript?.filler_words : 0}
                                        </Text>
                                    </View>
                                    <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Filter word</Text>
                                </View>
                                <View
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginHorizontal: 4,
                                    }}
                                >
                                    <View
                                        style={{
                                            backgroundColor: '#fbd4da',
                                            borderRadius: 800,
                                            paddingHorizontal: 10,
                                            paddingVertical: 4,
                                            marginRight: 4,
                                            marginVertical: 4,
                                        }}
                                    >
                                        <Text style={{ fontWeight: 'bold', fontSize: 14 }}>
                                            {transcript?.pauses ? transcript?.pauses : 0}
                                        </Text>
                                    </View>
                                    <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Pauses</Text>
                                </View>
                            </View>
                        </View>
                    ) : (
                        <></>
                    )}

                    {isScore ? (
                        <></>
                    ) : (
                        <Text style={{ color: '#221638', fontSize: 16, fontWeight: '700' }}>{t('Feedback')}</Text>
                    )}

                    {haveBg ? (
                        <View
                            style={{
                                paddingHorizontal: 16,
                                paddingVertical: 10,
                                borderRadius: 12,
                                textAlign: 'center',
                                backgroundColor: '#fae184',
                            }}
                        >
                            <Text
                                style={{ color: 'white', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' }}
                            >
                                {feedback}
                            </Text>
                        </View>
                    ) : (
                        <Text
                            style={{
                                color: isScore ? '#3ca09e' : '#221638',
                                fontSize: 16,
                                fontWeight: isScore ? 'bold' : '400',
                                textAlign: 'justify',
                            }}
                        >
                            {feedback === null ? 0 : feedback}
                        </Text>
                    )}
                </View>
            </View>
        </View>
    );
};

export default PronunciationFeedback;
