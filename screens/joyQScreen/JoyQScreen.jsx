import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthStore } from '../../services/auth';
import {
    learningPathBg,
    rabbit,
    classroomBg,
    zooBg,
    mapBg,
    farmBg,
    myHamterBg,
    myPetParkBg,
    thingsToDoBg,
    huuCaoCo,
} from '../../assets';
const JoyQScreen = ({ route }) => {
    const data = route?.params?.data;
    const navigation = useNavigation();
    const { t } = useTranslation();
    useLayoutEffect(() => {
        const setHeaderOptions = async () => {
            const avatarUrl = await AsyncStorage.getItem('avatarUrl');
            const isLoggedIn = await AuthStore.isLoggedIn();
            navigation.setOptions({
                headerTitle: data.name,
                headerTitleAlign: 'center',
                headerStyle: {
                    backgroundColor: '#023468',
                },
                headerTintColor: '#fff',
                headerRight: () => {
                    return (
                        <>
                            {isLoggedIn ? (
                                <TouchableOpacity onPress={() => navigation.navigate('UserInforScreen')}>
                                    <Image
                                        source={{
                                            uri:
                                                avatarUrl && avatarUrl !== ''
                                                    ? avatarUrl
                                                    : 'https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png',
                                        }}
                                        style={{
                                            objectFit: 'cover',
                                            width: 40,
                                            height: 40,
                                            borderRadius: 800,
                                            backgroundColor: 'white',
                                        }}
                                    />
                                </TouchableOpacity>
                            ) : (
                                <AntDesign
                                    name="customerservice"
                                    size={24}
                                    color="white"
                                    onPress={() => navigation.navigate('ContactScreen')}
                                />
                            )}
                        </>
                    );
                },
            });
        };

        setHeaderOptions();
    }, []);
    const [joyQRoutes, setJoQRoutes] = useState([
        {
            title: 'My Learning Path',
            color: '#fac05e',
            bgImage: learningPathBg,
            subImage: rabbit,
            routeLink: 'LearningPathScreen',
        },
        {
            title: 'Class Room',
            color: '#8c55fc',
            bgImage: classroomBg,
            routeLink: 'ClassroomScreen',
        },
        {
            title: 'Zoo',
            color: '#fe7952',
            bgImage: zooBg,
            subImage: huuCaoCo,
            routeLink: 'JoyQScreen',
        },
        {
            title: 'Map',
            color: '#fec4e7',
            bgImage: mapBg,
            routeLink: 'JoyQScreen',
        },
        {
            title: 'Farm',
            color: '#8c9bc5',
            bgImage: farmBg,
            routeLink: 'JoyQScreen',
        },
        {
            title: 'My hamster',
            color: '#f8c4bb',
            bgImage: myHamterBg,
            routeLink: 'JoyQScreen',
        },
        {
            title: 'My Pet Park',
            color: '#8c55fc',
            bgImage: myPetParkBg,
            routeLink: 'JoyQScreen',
        },
        {
            title: 'Things To Do',
            color: '#89b449',
            bgImage: thingsToDoBg,
            routeLink: 'JoyQScreen',
        },
    ]);

    const goToLessonScreen = async (routeLink) => {
        const isLoggedIn = await AuthStore.isLoggedIn();
        if (isLoggedIn) {
            navigation.navigate(routeLink);
        } else {
            navigation.navigate('UserScreen', {
                backScreen: 'JoyQScreen',
            });
        }
    };
    return (
        <ScrollView style={{ backgroundColor: '#023468', flex: 1, paddingHorizontal: 20, paddingTop: 10 }}>
            <View>
                {joyQRoutes.map((route, index) => (
                    <TouchableOpacity
                        key={index}
                        style={{
                            borderColor: route.color,
                            borderRadius: 16,
                            borderWidth: 2,
                            borderStyle: 'solid',
                            marginBottom: 20,
                            width: '100%',
                            position: 'relative',
                        }}
                        onPress={() => goToLessonScreen(route.routeLink)}
                    >
                        <Image
                            source={route.bgImage}
                            style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 14 }}
                        />
                        {route.subImage ? (
                            <Image
                                source={route.subImage}
                                style={{ position: 'absolute', bottom: 0, right: 10, height: 200, zIndex: 90 }}
                            />
                        ) : (
                            <></>
                        )}
                        <View
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                backgroundColor: route.color,
                                borderBottomEndRadius: 11,
                                borderBottomStartRadius: 11,
                                zIndex: 99,
                                padding: 4,
                            }}
                        >
                            <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: 24 }}>
                                {route.title}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
};

export default JoyQScreen;
