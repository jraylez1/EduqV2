import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useLayoutEffect, useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { CourseStore } from '../../services/course';
import { SvgUri } from 'react-native-svg';
import ListLession from '../../components/listLession/ListLession';
import { useTranslation } from 'react-i18next';
import { Entypo } from '@expo/vector-icons';
import { noImage } from '../../assets';

const LessonScreen = ({ route }) => {
    const navigation = useNavigation();
    const [data, setData] = useState(route?.params?.data);
    const studyRouteAliasUrl = route?.params?.studyAliasUrl;
    const scrollViewRef = useRef(null);
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

    const changeStudyRoute = async (idTopic) => {
        const lessonData = await CourseStore.getStudyRoute(
            data.extendData.course.aliasUrl,
            data.id,
            studyRouteAliasUrl,
            idTopic,
        );
        setData(lessonData);
    };
    return (
        <ScrollView style={{ backgroundColor: '#081D49', height: '100%', width: '100%' }} ref={scrollViewRef}>
            <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                contentContainerStyle={{ paddingHorizontal: 16 }}
                style={{
                    width: '100%',
                    flex: 1,
                    flexDirection: 'row',
                }}
            >
                {data?.extendData?.filters?.lessonTopics &&
                    data?.extendData?.filters?.lessonTopics.map((item, index) => (
                        <View style={{ padding: 4 }} key={index}>
                            <TouchableOpacity
                                style={{
                                    height: '80%',
                                    marginBottom: 16,
                                    backgroundColor: item.bgColor !== '' ? item.bgColor : '#ddd',
                                    paddingHorizontal: 8,
                                    paddingVertical: 16,
                                    borderRadius: 12,
                                    borderColor: item.borderColor !== '' ? item.borderColor : '#3785F2',
                                    borderWidth: 2,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: 120,
                                }}
                                key={index}
                                onPress={() => changeStudyRoute(item.id)}
                            >
                                {item.iconUrl !== '' ? (
                                    <SvgUri style={{ height: 80 }} uri={item?.iconUrl} />
                                ) : (
                                    <Image
                                        source={noImage}
                                        style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 12 }}
                                    />
                                )}
                                <Text
                                    numberOfLines={1}
                                    style={{
                                        color: item.textColor !== '' ? item.textColor : '#3785F2',
                                        fontSize: 18,
                                        fontWeight: '600',
                                        marginTop: 8,
                                    }}
                                >
                                    {item?.name}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ))}
            </ScrollView>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 32, fontWeight: '700' }}>{t('Main lesson')}</Text>
            </View>
            {data?.extendData?.mainLessons?.length > 0 ? (
                <View
                    style={{
                        width: '100%',
                        paddingHorizontal: 16,
                        paddingBottom: 16,
                        transform: [{ translateY: -30 }],
                    }}
                >
                    {data?.extendData?.mainLessons?.map((item, index) => (
                        <ListLession
                            studyRouteAliasUrl={studyRouteAliasUrl}
                            item={item}
                            data={data}
                            key={index}
                            scrollViewRef={scrollViewRef}
                            isScroll={false}
                        />
                    ))}
                </View>
            ) : (
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 16 }}>
                    <Entypo name="box" size={40} color="white" />
                    <Text style={styles.title}>{t('No lessons')}</Text>
                </View>
            )}

            {data?.extendData?.mainLessons?.length > 0 ? (
                <View>
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 4 }}>
                        <Text style={{ color: '#fff', fontSize: 32, fontWeight: '700' }}>{t('Additional lesson')}</Text>
                    </View>
                    {data?.extendData?.additionLessons.length > 0 ? (
                        <View
                            style={{
                                width: '100%',
                                paddingHorizontal: 16,
                                paddingBottom: 16,
                            }}
                        >
                            {data?.extendData?.additionLessons.map((item, index) => (
                                <View style={{ transform: [{ translateY: -30 }] }} key={index}>
                                    <ListLession
                                        studyRouteAliasUrl={studyRouteAliasUrl}
                                        item={item}
                                        data={data}
                                        scrollViewRef={scrollViewRef}
                                        isScroll={false}
                                    />
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 16 }}>
                            <Entypo name="box" size={40} color="white" />
                            <Text style={styles.title}>{t('No lessons')}</Text>
                        </View>
                    )}
                </View>
            ) : (
                <View></View>
            )}
        </ScrollView>
    );
};
const styles = StyleSheet.create({
    title: {
        fontWeight: '500',
        fontSize: 30,
        color: 'white',
        marginTop: 8,
    },
});
export default LessonScreen;
