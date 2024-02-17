import { View, Text, Image, Linking, TouchableOpacity } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { facebook, messenger, phone, youtube, zalo } from '../assets';
import { useTranslation } from 'react-i18next';

const ContactScreen = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: t('Contact'),
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: '#023468',
            },
            headerTintColor: '#fff',
        });
    }, []);

    const [contact, setContact] = useState([
        {
            imageSource: phone,
            content: '0917072756',
            link: 'tel:0917072756',
        },
        {
            imageSource: zalo,
            content: '0917072756',
            link: 'tel:0917072756',
        },
        {
            imageSource: facebook,
            content: 'EduQ',
            link: 'fb://profile/100087556156963',
        },
        {
            imageSource: messenger,
            content: 'EduQ',
            link: 'http://m.me/100087556156963',
        },
        {
            imageSource: youtube,
            content: 'EduQ',
            link: 'https://www.youtube.com/channel/UCis_ekfLKDfpoc_056DEAxA',
        },
    ]);
    return (
        <View style={{ backgroundColor: '#023468', height: '100%' }}>
            <View style={{ width: '100%', paddingBottom: 48, paddingHorizontal: 16 }}>
                {
                    <>
                        {contact.map((data, index) => (
                            <TouchableOpacity key={index} onPress={() => Linking.openURL(data.link)}>
                                <View style={{ position: 'relative', marginBottom: 24 }}>
                                    <Image
                                        source={data.imageSource}
                                        style={{ width: '100%', height: 56, objectFit: 'cover' }}
                                    />
                                    <View
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 16,
                                            width: '60%',
                                            height: '100%',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: '#023468',
                                                fontWeight: '500',
                                                fontSize: 20,
                                                lineHeight: 28,
                                            }}
                                        >
                                            {data.content}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </>
                }
            </View>
        </View>
    );
};

export default ContactScreen;
