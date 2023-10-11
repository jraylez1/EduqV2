import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { CourseStore } from '../../services/course';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

const ListLession = ({ item, data, studyRouteAliasUrl, scrollViewRef, isScroll }) => {
    const navigation = useNavigation();
    const { t } = useTranslation();

    const goToFreeQVideo = async () => {
        const freeQVideoData = await CourseStore.getLesson(
            data.extendData.course.aliasUrl,
            item.id,
            studyRouteAliasUrl,
            true,
        );
        navigation.navigate('VideoScreen', { data: freeQVideoData, studyRouteAliasUrl: studyRouteAliasUrl });
        if (isScroll) {
            scrollViewRef.current.scrollTo({ y: 0, animated: true });
        }
    };
    return (
        <TouchableOpacity style={{ width: '100%' }} onPress={() => goToFreeQVideo()}>
            <View
                style={{
                    width: '100%',
                    paddingHorizontal: 16,
                    zIndex: 99,
                    transform: [{ translateY: 45 }],
                }}
            >
                <Image source={{ uri: item.coverUrl }} style={{ height: 96, width: 160, borderRadius: 12 }} />
            </View>
            <View
                style={{
                    width: '100%',
                    backgroundColor: '#fff',
                    borderRadius: 12,
                    paddingHorizontal: 8,
                    paddingBottom: 8,
                }}
            >
                <View style={{ width: '100%', alignItems: 'flex-end', paddingVertical: 8 }}>
                    {item.isTrial || item.isOwner ? (
                        <View
                            style={{
                                width: 100,
                                backgroundColor: '#00a2ce',
                                padding: 8,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 6,
                            }}
                        >
                            <Text style={{ fontSize: 16, color: '#fff' }} numberOfLines={2} ellipsizeMode="tail">
                                {t('Opened')}
                            </Text>
                        </View>
                    ) : (
                        <View
                            style={{
                                width: 100,
                                backgroundColor: '#d12700',
                                padding: 8,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 6,
                            }}
                        >
                            <Text style={{ fontSize: 16, color: '#fff' }} numberOfLines={2} ellipsizeMode="tail">
                                {t('Locked')}
                            </Text>
                        </View>
                    )}
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {item.isTrial || item.isOwner ? (
                        <AntDesign name="play" size={45} color="#005DB4" />
                    ) : (
                        <View
                            style={{
                                paddingHorizontal: 14,
                                paddingVertical: 8,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#d12700',
                                borderRadius: 9999,
                            }}
                        >
                            <FontAwesome name="lock" size={30} color="#fff" />
                        </View>
                    )}
                    <View style={{ marginLeft: 8, width: '85%' }}>
                        <Text
                            style={{
                                color: '#005DB4',
                                fontSize: 20,
                                lineHeight: 28,
                                fontWeight: 700,
                            }}
                            numberOfLines={2}
                            ellipsizeMode="tail"
                        >
                            {item.name}
                        </Text>
                        <Text style={{ fontSize: 16, color: '#939393' }} numberOfLines={2} ellipsizeMode="tail">
                            {item.description}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default ListLession;
