import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

const PronunciationAccordion = ({ checkData, setData, text }) => {
    const { t } = useTranslation();

    return (
        <TouchableOpacity
            onPress={() => setData(!checkData)}
            style={{
                width: 360,
                backgroundColor: checkData ? '#3ca09e' : '#fff',
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
                <Text style={{ color: checkData ? '#fff' : '#0dcaf0' }}>{t(text)}</Text>
                {checkData ? (
                    <AntDesign name="up" size={20} style={{ color: checkData ? '#fff' : '#0dcaf0' }} />
                ) : (
                    <AntDesign name="down" size={20} style={{ color: checkData ? '#fff' : '#0dcaf0' }} />
                )}
            </View>
        </TouchableOpacity>
    );
};

export default PronunciationAccordion;
