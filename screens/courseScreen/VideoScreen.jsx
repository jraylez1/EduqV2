import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import React, { useLayoutEffect, useEffect, useState, useRef } from 'react';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ListLession from '../../components/listLession/ListLession';
import { useTranslation } from 'react-i18next';
import SupportKit from '../../components/lessionDetail/SupportKit';
import LessonDetail from '../../components/lessionDetail/LessonDetail';
import { Entypo } from '@expo/vector-icons';
import { AuthStore } from '../../services/auth';
import { setHeaderOptions } from '../../assets/utils/setHeaderOptions ';

const VideoScreen = ({ route }) => {
    const navigation = useNavigation();
    const data = route?.params?.data;
    const studyRouteAliasUrl = route?.params?.studyRouteAliasUrl;
    const [cartItems, setCartItems] = useState([]);
    const isFocused = useIsFocused();
    const scrollViewRef = useRef(null);
    const { t } = useTranslation();

    useEffect(() => {
        if (isFocused) {
            loadCartItems();
        }
    }, [isFocused]);

    const loadCartItems = async () => {
        try {
            const storedCartItems = await AsyncStorage.getItem('cart-store');
            if (storedCartItems !== null) {
                setCartItems(JSON.parse(storedCartItems));
            }
        } catch (error) {
            console.error('Error loading cart items:', error);
        }
    };

    useLayoutEffect(() => {
        const headerTitle = '';
        setHeaderOptions({ navigation, headerTitle });
    }, []);

    return (
        <ScrollView style={{ backgroundColor: '#023468', height: '100%', width: '100%' }} ref={scrollViewRef}>
            <View style={{ paddingHorizontal: 16 }}>
                <LessonDetail
                    data={data}
                    navigation={navigation}
                    studyRouteAliasUrl={studyRouteAliasUrl}
                    scrollViewRef={scrollViewRef}
                    isScroll={true}
                    route={route}
                />
                {data?.extendData?.products ? (
                    <SupportKit data={data} cartItems={cartItems} setCartItems={setCartItems} navigation={navigation} />
                ) : (
                    <></>
                )}
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
                                    <ListLession
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

export default VideoScreen;
