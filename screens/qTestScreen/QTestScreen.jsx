import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import React, { useLayoutEffect, useEffect, useState } from 'react';
import { pronunciation } from '../../assets';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

const QTestScreen = ({ route }) => {
    const data = route?.params?.data;
    const navigation = useNavigation();
    const { t } = useTranslation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: data.name,
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: '#081D49',
            },
            headerTintColor: '#fff',
            headerRight: () => {
                return (
                    <AntDesign
                        name="customerservice"
                        size={24}
                        color="white"
                        onPress={() => navigation.navigate('ContactScreen')}
                    />
                );
            },
        });
    }, []);
    return (
        <View style={{ backgroundColor: '#081D49', flex: 1, paddingTop: 40, alignItems: 'center' }}>
            <Text style={{ color: '#fff', marginBottom: 16, fontSize: 24, fontWeight: 'bold' }}>
                {t('EXPLORER FEATURE')}
            </Text>
            <TouchableOpacity
                style={{ width: '100%', height: '100%', alignItems: 'center' }}
                onPress={() => navigation.navigate('ChooseAccentScreen', { data: data })}
            >
                <Image
                    source={pronunciation}
                    style={{ width: '90%', height: 240, objectFit: 'cover', borderRadius: 12 }}
                />
            </TouchableOpacity>
        </View>
    );
};

export default QTestScreen;
