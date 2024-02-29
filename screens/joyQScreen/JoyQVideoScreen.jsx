import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import React, { useLayoutEffect, useEffect, useState, useRef } from 'react';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Entypo } from '@expo/vector-icons';
import JoyQDetail from '../../components/lessionDetail/JoyQDetail';
import JoyQListLesson from '../../components/listLession/JoyQListLesson';
import { setHeaderOptions } from '../../assets/utils/setHeaderOptions ';

const JoyQVideoScreen = ({ route }) => {
    const navigation = useNavigation();
    const data = route?.params?.data;
    const studyRouteAliasUrl = route?.params?.studyRouteAliasUrl;
    const { t } = useTranslation();
    const scrollViewRef = useRef(null);
    useLayoutEffect(() => {
        const headerTitle = '';
        const isProgress = true;
        setHeaderOptions({ navigation, headerTitle, isProgress });
    }, []);
    return (
        <ScrollView style={{ backgroundColor: '#023468', height: '100%', width: '100%' }} ref={scrollViewRef}>
            <View style={{ paddingHorizontal: 16 }}>
                <JoyQDetail
                    data={data}
                    navigation={navigation}
                    studyRouteAliasUrl={studyRouteAliasUrl}
                    scrollViewRef={scrollViewRef}
                    isScroll={true}
                    route={route}
                />

                <View>
                    <Text
                        style={{
                            fontSize: 24,
                            textAlign: 'justify',
                            marginTop: 16,
                            color: '#fff',
                            fontWeight: '500',
                        }}
                    >
                        {t('Related lesson')}
                    </Text>

                    {data?.extendData?.relatedLessons.length > 0 ? (
                        <View
                            style={{
                                width: '100%',
                                paddingBottom: 16,
                            }}
                        >
                            <View style={{ transform: [{ translateY: -30 }] }}>
                                {data.extendData.relatedLessons.map((item, index) => (
                                    <JoyQListLesson
                                        item={item}
                                        data={data}
                                        studyRouteAliasUrl={studyRouteAliasUrl}
                                        scrollViewRef={scrollViewRef}
                                        isScroll={true}
                                        key={index}
                                    />
                                ))}
                            </View>
                        </View>
                    ) : (
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 16 }}>
                            <Entypo name="box" size={40} color="white" />
                            <Text style={{ fontWeight: '500', fontSize: 30, color: 'white' }}>{t('No lessons')}</Text>
                        </View>
                    )}
                </View>
            </View>
        </ScrollView>
    );
};

export default JoyQVideoScreen;
