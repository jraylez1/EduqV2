import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import React, { useLayoutEffect, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { uk_flag, us_flag } from '../../assets';
import { setHeaderOptions } from '../../assets/utils/setHeaderOptions ';

const ChooseAccentScreen = ({ route }) => {
    const data = route?.params?.data;
    const navigation = useNavigation();
    const { t } = useTranslation();
    useLayoutEffect(() => {
        const headerTitle = data.name;
        setHeaderOptions({ navigation, headerTitle });
    }, []);

    return (
        <View style={{ backgroundColor: '#023468', flex: 1, paddingTop: 20, alignItems: 'center' }}>
            <Text style={{ color: '#fff', marginBottom: 16, fontSize: 24, fontWeight: 'bold' }}>{t('ACCENT')}</Text>
            <TouchableOpacity
                style={{ width: '100%', height: 'auto', alignItems: 'center' }}
                onPress={() => navigation.navigate('ModeScreen', { data: data, accent: 'uk' })}
            >
                <Image source={uk_flag} style={{ width: '90%', height: 240, objectFit: 'cover', borderRadius: 12 }} />
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
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 24 }}>{t('UK Accent')}</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                style={{ width: '100%', height: 'auto', alignItems: 'center' }}
                onPress={() => navigation.navigate('ModeScreen', { data: data, accent: 'us' })}
            >
                <Image source={us_flag} style={{ width: '90%', height: 240, objectFit: 'cover', borderRadius: 12 }} />
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
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 24 }}>{t('US Accent')}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default ChooseAccentScreen;
