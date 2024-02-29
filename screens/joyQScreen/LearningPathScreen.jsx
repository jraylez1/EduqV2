import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useNavigation, useIsFocused, useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import * as ScreenOrientation from 'expo-screen-orientation';
import { level1, level2, level3, level4, level5, level6, level7, level8, level9, level10, road } from '../../assets';
import { CourseStore } from '../../services/course';
import LevelJoyQ from '../../assets/svg/LevelJoyQ';
import Level2JoyQ from '../../assets/svg/Level2JoyQ';
import Level3JoyQ from '../../assets/svg/Level3JoyQ';
import Level4JoyQ from '../../assets/svg/Level4JoyQ';
import Level5JoyQ from '../../assets/svg/Level5JoyQ';
import Level6JoyQ from '../../assets/svg/Level6JoyQ';
import Level7JoyQ from '../../assets/svg/Level7JoyQ';
import Level8JoyQ from '../../assets/svg/Level8JoyQ';
import Level9JoyQ from '../../assets/svg/Level9JoyQ';
import Level10JoyQ from '../../assets/svg/Level10JoyQ';
import { setHeaderOptions } from '../../assets/utils/setHeaderOptions ';

const LearningPathScreen = ({ route }) => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const [aliasUrl, setAliasUrl] = useState(route?.params?.aliasUrl);
    const [studyRoutes, setStudyRoute] = useState([]);
    const levelImages = [level1, level2, level3, level4, level5, level6, level7, level8, level9, level10];
    const isFocused = useIsFocused();
    useLayoutEffect(() => {
        const headerTitle = t('My Learning Path');
        const isProgress = true;
        setHeaderOptions({ navigation, headerTitle, isProgress });
    }, []);

    useEffect(() => {
        getPathData();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            const changeScreenOrientation = async () => {
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
            };

            changeScreenOrientation();

            return () => {
                ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
            };
        }, []),
    );

    const getPathData = async () => {
        const response = await CourseStore.get(aliasUrl);
        setStudyRoute(response?.studyRoutes);
    };

    const goToClassroom = async (name, idStudyRoute, studyRouteAliasUrl) => {
        navigation.navigate('ClassroomScreen', {
            name: name,
            aliasUrl: aliasUrl,
            idStudyRoute: idStudyRoute,
            studyRouteAliasUrl: studyRouteAliasUrl,
        });
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
    };

    return (
        <ScrollView style={{ backgroundColor: '#023468', flex: 1 }}>
            <View
                style={{
                    width: '100%',
                    padding: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                }}
            >
                {studyRoutes &&
                    studyRoutes.map((item, index) => (
                        <TouchableOpacity
                            style={{
                                borderTopColor: '#d63a02',
                                borderTopWidth: 2,
                                borderStyle: 'solid',
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'relative',
                                paddingHorizontal: 8,
                            }}
                            key={index}
                            onPress={() => goToClassroom(item.name, item.id, item.aliasUrl)}
                        >
                            <View
                                style={{
                                    paddingVertical: 6,
                                    paddingHorizontal: 12,
                                    borderRadius: 800,
                                    backgroundColor: '#fff',
                                    position: 'absolute',
                                    top: -18,
                                    zIndex: 9999,
                                }}
                            >
                                <Text style={{ color: '#d63a02', fontWeight: 'bold', textAlign: 'center' }}>
                                    {index + 1}
                                </Text>
                            </View>

                            <Image source={levelImages[index]} />
                        </TouchableOpacity>
                    ))}
            </View>
            <View style={{ paddingVertical: 80 }}>
                <View style={{ position: 'relative' }}>
                    <Image source={road} />
                </View>
                {studyRoutes[0] && (
                    <TouchableOpacity
                        style={{ position: 'absolute', top: 15, left: 0 }}
                        onPress={() => goToClassroom(studyRoutes[0].name, studyRoutes[0].id, studyRoutes[0].aliasUrl)}
                    >
                        <LevelJoyQ name={studyRoutes[0].name} />
                    </TouchableOpacity>
                )}
                {studyRoutes[1] && (
                    <TouchableOpacity
                        style={{ position: 'absolute', bottom: 25, left: 30 }}
                        onPress={() => goToClassroom(studyRoutes[1].name, studyRoutes[1].id, studyRoutes[1].aliasUrl)}
                    >
                        <Level2JoyQ name={studyRoutes[1].name} />
                    </TouchableOpacity>
                )}
                {studyRoutes[2] && (
                    <TouchableOpacity
                        style={{ position: 'absolute', top: 10, left: 150 }}
                        onPress={() => goToClassroom(studyRoutes[2].name, studyRoutes[2].id, studyRoutes[2].aliasUrl)}
                    >
                        <Level3JoyQ name={studyRoutes[2].name} />
                    </TouchableOpacity>
                )}
                {studyRoutes[3] && (
                    <TouchableOpacity
                        onPress={() => goToClassroom(studyRoutes[3].name, studyRoutes[3].id, studyRoutes[3].aliasUrl)}
                        style={{ position: 'absolute', bottom: 25, left: 200 }}
                    >
                        <Level4JoyQ name={studyRoutes[3].name} />
                    </TouchableOpacity>
                )}
                {studyRoutes[4] && (
                    <TouchableOpacity
                        onPress={() => goToClassroom(studyRoutes[4].name, studyRoutes[4].id, studyRoutes[4].aliasUrl)}
                        style={{ position: 'absolute', top: 0, left: 300 }}
                    >
                        <Level5JoyQ name={studyRoutes[4].name} />
                    </TouchableOpacity>
                )}
                {studyRoutes[5] && (
                    <TouchableOpacity
                        onPress={() => goToClassroom(studyRoutes[5].name, studyRoutes[5].id, studyRoutes[5].aliasUrl)}
                        style={{ position: 'absolute', bottom: 5, left: 350 }}
                    >
                        <Level6JoyQ name={studyRoutes[5].name} />
                    </TouchableOpacity>
                )}
                {studyRoutes[6] && (
                    <TouchableOpacity
                        onPress={() => goToClassroom(studyRoutes[6].name, studyRoutes[6].id, studyRoutes[6].aliasUrl)}
                        style={{ position: 'absolute', top: 0, left: 450 }}
                    >
                        <Level7JoyQ name={studyRoutes[6].name} />
                    </TouchableOpacity>
                )}
                {studyRoutes[7] && (
                    <TouchableOpacity
                        onPress={() => goToClassroom(studyRoutes[7].name, studyRoutes[7].id, studyRoutes[7].aliasUrl)}
                        style={{ position: 'absolute', bottom: 30, left: 500 }}
                    >
                        <Level8JoyQ name={studyRoutes[7].name} />
                    </TouchableOpacity>
                )}
                {studyRoutes[8] && (
                    <TouchableOpacity
                        onPress={() => goToClassroom(studyRoutes[8].name, studyRoutes[8].id, studyRoutes[8].aliasUrl)}
                        style={{ position: 'absolute', top: 0, left: 600 }}
                    >
                        <Level9JoyQ name={studyRoutes[8].name} />
                    </TouchableOpacity>
                )}
                {studyRoutes[9] && (
                    <TouchableOpacity
                        onPress={() => goToClassroom(studyRoutes[9].name, studyRoutes[9].id, studyRoutes[9].aliasUrl)}
                        style={{ position: 'absolute', bottom: 30, left: 650 }}
                    >
                        <Level10JoyQ name={studyRoutes[9].name} />
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
    );
};

export default LearningPathScreen;
