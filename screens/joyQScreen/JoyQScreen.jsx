import { View, Text, TouchableOpacity, Image, ScrollView, BackHandler } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { AuthStore } from '../../services/auth';
import { CourseStore } from '../../services/course';
import { NativeBaseProvider, Modal, Center, Button } from 'native-base';
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
import * as ScreenOrientation from 'expo-screen-orientation';
import { setHeaderOptions } from '../../assets/utils/setHeaderOptions ';

const JoyQScreen = ({ route }) => {
    const { data } = route?.params;
    const [buyCourseData, setBuyCourseData] = useState(null);
    const navigation = useNavigation();
    const { t } = useTranslation();

    useEffect(() => {
        return () => {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
        };
    }, []);

    useLayoutEffect(() => {
        const headerTitle = data.name;
        const isProgress = true;
        setHeaderOptions({ navigation, headerTitle, isProgress });
    }, []);

    const [joyQRoutes, setJoyQRoutes] = useState([
        {
            title: 'My Learning Path',
            color: '#fac05e',
            bgImage: learningPathBg,
            subImage: rabbit,
            routeLink: 'LearningPathScreen',
            type: 1,
        },
        {
            title: 'Class Room',
            color: '#8c55fc',
            bgImage: classroomBg,
            routeLink: 'ClassroomScreen',
            type: 2,
        },
        {
            title: 'Zoo',
            color: '#fe7952',
            bgImage: zooBg,
            subImage: huuCaoCo,
            routeLink: 'JoyQScreen',
            type: 1,
        },
        {
            title: 'Map',
            color: '#fec4e7',
            bgImage: mapBg,
            routeLink: 'JoyQScreen',
            type: 1,
        },
        {
            title: 'Farm',
            color: '#8c9bc5',
            bgImage: farmBg,
            routeLink: 'JoyQScreen',
            type: 1,
        },
        {
            title: 'My hamster',
            color: '#f8c4bb',
            bgImage: myHamterBg,
            routeLink: 'JoyQScreen',
            type: 1,
        },
        {
            title: 'My Pet Park',
            color: '#8c55fc',
            bgImage: myPetParkBg,
            routeLink: 'JoyQScreen',
            type: 1,
        },
        {
            title: 'Things To Do',
            color: '#89b449',
            bgImage: thingsToDoBg,
            routeLink: 'JoyQScreen',
            type: 1,
        },
    ]);
    const [showModal, setShowModal] = useState(false);

    const goToBuyCourseScreen = () => {
        navigation.navigate('BuyCourse', { data: buyCourseData });
    };

    const goToLessonScreen = async (routeLink, type) => {
        const isLoggedIn = await AuthStore.isLoggedIn();
        if (isLoggedIn) {
            const buyInfo = await CourseStore.getProductPackages(data.aliasUrl);
            if (buyInfo?.isOwner) {
                if (type === 2) {
                    const classroomData = await CourseStore.getStudyingRoute(data.aliasUrl);
                    navigation.navigate(routeLink, {
                        name: classroomData.name,
                        aliasUrl: data.aliasUrl,
                        idStudyRoute: classroomData.id,
                        studyRouteAliasUrl: classroomData.aliasUrl,
                    });
                } else {
                    navigation.navigate(routeLink, { aliasUrl: data.aliasUrl });
                }
            } else {
                setBuyCourseData(buyInfo);
                setShowModal(true);
            }
        } else {
            navigation.navigate('UserScreen', {
                backScreen: 'JoyQScreen',
                aliasUrl: data.aliasUrl,
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
                        onPress={() => goToLessonScreen(route.routeLink, route.type)}
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
                                {t(route.title)}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
            <NativeBaseProvider>
                <Center>
                    <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                        <Modal.Content maxWidth="400px">
                            <Modal.CloseButton />
                            <Modal.Header>{t('EduQ Notification')}</Modal.Header>
                            <Modal.Body>
                                <Text style={{ textAlign: 'justify' }}>
                                    {t('You do not own this course, own it now?')}
                                </Text>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button.Group space={2}>
                                    <Button
                                        variant="ghost"
                                        colorScheme="blueGray"
                                        onPress={() => {
                                            setShowModal(false);
                                        }}
                                    >
                                        {t('Cancel')}
                                    </Button>
                                    <Button onPress={() => goToBuyCourseScreen()}>{t('Agree')}</Button>
                                </Button.Group>
                            </Modal.Footer>
                        </Modal.Content>
                    </Modal>
                </Center>
            </NativeBaseProvider>
        </ScrollView>
    );
};

export default JoyQScreen;
