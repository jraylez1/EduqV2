import { View, Text } from 'react-native';
import React from 'react';

const test = () => {
    return (
        <View>
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
        </View>
    );
};

export default test;
