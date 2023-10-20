import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
const SingleSelect = ({ data, onSelectAnswer, result }) => {
    const { t } = useTranslation();
    const [resultSelect, setResultSelect] = useState({});
    const selectQuestion = (item) => {
        onSelectAnswer(item.idAnswer);
    };

    useEffect(() => {
        if (result != null) {
            setResultSelect(result.logs.find((item) => item.idQuestion === data.id));
        }
    }, [data]);

    return (
        <View>
            <FlatList
                data={data.data}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        style={{
                            padding: 12,
                            borderRadius: 8,
                            marginTop: 16,
                            borderWidth: 2,
                            borderColor: '#ddd',
                            backgroundColor: data.answer.includes(item.idAnswer) ? '#2dd4bf' : '#fff',
                            borderColor: data.answer.includes(item.idAnswer) ? '#2dd4bf' : '#081D49',
                        }}
                        onPress={() => selectQuestion(item)}
                    >
                        <Text
                            style={{
                                fontSize: 18,
                                lineHeight: 28,
                                fontWeight: '500',
                                color: data.answer.includes(item.idAnswer) ? '#fff' : '#081D49',
                            }}
                        >
                            {String.fromCharCode(65 + index)}. {item.answer}
                        </Text>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.idAnswer}
            />
            {result != null ? (
                <View style={{ marginTop: 32 }}>
                    {resultSelect.isCorrect ? (
                        <View style={{ paddingHorizontal: 8 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <FontAwesome5 name="smile" size={30} color="#0fab4b" />
                                <Text style={{ color: '#0fab4b', marginLeft: 16, fontSize: 22, fontWeight: '700' }}>
                                    {t('You have answered correctly')}
                                </Text>
                            </View>
                            <Text style={{ marginTop: 8, fontSize: 18, lineHeight: 24, fontWeight: '400' }}>
                                {data.explain}
                            </Text>
                        </View>
                    ) : (
                        <View style={{ paddingHorizontal: 8 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <FontAwesome name="frown-o" size={30} color="#d12700" />
                                <Text style={{ color: '#d12700', marginLeft: 16, fontSize: 22, fontWeight: '600' }}>
                                    {t('You have answered incorrectly')}
                                </Text>
                            </View>
                            <Text style={{ marginTop: 8, fontSize: 18, lineHeight: 24, fontWeight: '400' }}>
                                {data.explain}
                            </Text>
                        </View>
                    )}
                </View>
            ) : (
                <View></View>
            )}
        </View>
    );
};

export default SingleSelect;
