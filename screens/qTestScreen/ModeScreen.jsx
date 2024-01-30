import { View, Text, TouchableOpacity, Image } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { setHeaderOptions } from '../../assets/utils/setHeaderOptions ';
import { codingMan } from '../../assets';
const ModeScreen = ({ route }) => {
    const { data, accent } = route?.params;
    const navigation = useNavigation();
    const { t } = useTranslation();
    useLayoutEffect(() => {
        const headerTitle = data.name;
        setHeaderOptions({ navigation, headerTitle });
    }, []);

    return (
        <View style={{ backgroundColor: '#023468', flex: 1, paddingTop: 20, alignItems: 'center' }}>
            <Text style={{ color: '#fff', marginBottom: 16, fontSize: 24, fontWeight: 'bold' }}>{t('Mode')}</Text>
            <TouchableOpacity
                style={{ width: '100%', height: 'auto', alignItems: 'center' }}
                onPress={() => navigation.navigate('LevelScreen', { data: data, accent: accent })}
            >
                <Image source={codingMan} style={{ width: '90%', height: 240, objectFit: 'cover', borderRadius: 12 }} />
                <View
                    style={{
                        backgroundColor: '#4da09f',
                        padding: 16,
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '70%',
                        borderRadius: 12,
                        transform: [{ translateY: -40 }],
                    }}
                >
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 24 }}>{t('Scripted')}</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                style={{ width: '100%', height: 'auto', alignItems: 'center' }}
                onPress={() => navigation.navigate('QTestCustomQuestionScreen', { data: data, accent: accent })}
            >
                <Image source={codingMan} style={{ width: '90%', height: 240, objectFit: 'cover', borderRadius: 12 }} />
                <View
                    style={{
                        backgroundColor: '#4da09f',
                        padding: 16,
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '70%',
                        borderRadius: 12,
                        transform: [{ translateY: -40 }],
                    }}
                >
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 24 }}>{t('Custom')}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default ModeScreen;
