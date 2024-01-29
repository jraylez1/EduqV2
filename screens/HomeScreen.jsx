import { View, Text, SafeAreaView, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { LogoEduQ, trial_register, toy_pngwing } from '../assets';
import { CourseStore } from '../services/course';
import { useTranslation } from 'react-i18next';
import { AuthStore } from '../services/auth';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const [courses, setCourses] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    useEffect(() => {
        updateLoginStatus();
        getBestCourses();
    }, [navigation]);

    const updateLoginStatus = async () => {
        const loggedIn = await AuthStore.isLoggedIn();
        setIsLoggedIn(loggedIn);
    };

    async function getBestCourses() {
        const coursesData = await CourseStore.getBestCourses();
        setCourses(coursesData);
    }

    const goToCourse = async (aliasUrl) => {
        const courseData = await CourseStore.get(aliasUrl);
        if (aliasUrl === 'qtest') {
            navigation.navigate('QTestScreen', { data: courseData });
        } else if (aliasUrl === 'joyq') {
            navigation.navigate('JoyQScreen', { data: courseData });
        } else {
            navigation.navigate('CourseScreen', { data: courseData });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Image source={LogoEduQ} style={styles.logo} />
                <Text style={styles.title}>LEARNING TO THINK - FREE PLAY</Text>
            </View>
            <ScrollView style={{ marginTop: 16 }}>
                <View styles={styles.containerCourses}>
                    {courses?.length > 0 ? (
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {courses.map((course, index) => (
                                <TouchableOpacity
                                    onPress={() => goToCourse(course.aliasUrl)}
                                    key={index}
                                    style={styles.course}
                                >
                                    <View>
                                        {course.thumbnailUrl?.length > 0 ? (
                                            <Image source={{ uri: course.thumbnailUrl }} style={styles.courseImg} />
                                        ) : (
                                            <Image
                                                source={{
                                                    uri: 'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg',
                                                }}
                                                style={styles.courseImg}
                                            />
                                        )}

                                        <Text numberOfLines={2} style={styles.courseName}>
                                            {course.name}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ) : (
                        <>
                            <View style={styles.containerLoadCourse}>
                                <Text style={styles.loadCourseText}>...Loading Courses</Text>
                            </View>
                        </>
                    )}
                </View>
                <View style={styles.containerBanner}>
                    {isLoggedIn ? (
                        <View style={{ marginBottom: 16 }}>
                            <Image source={trial_register} style={styles.banner} />
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={{ marginBottom: 16 }}
                            onPress={() => navigation.navigate('SignUpScreen')}
                        >
                            <Image source={trial_register} style={styles.banner} />
                        </TouchableOpacity>
                    )}
                </View>
                <View style={styles.containerQShop}>
                    <Text style={styles.qShopName}>QShop</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('StoreScreen')}>
                        <View style={styles.containerQShopChild}>
                            <Image source={toy_pngwing} style={styles.qShopImg} />
                            <View style={{ width: '75%' }}>
                                <Text style={styles.qShopTitle}>
                                    {t(
                                        'Providing a wide range of high-quality standard products for children, with diverse options.',
                                    )}
                                </Text>
                                <Text style={styles.qShopText}>{t('Wholesale and Retail Formats')}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#023468',
        flex: 1,
        paddingHorizontal: 8,
        paddingBottom: 48,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        height: 40,
        width: 96,
        objectFit: 'cover',
        marginRight: 8,
    },
    title: {
        fontWeight: '700',
        fontSize: 16,
        color: 'white',
    },
    containerCourses: {
        marginTop: 32,
    },
    course: {
        width: '50%',
        paddingHorizontal: 8,
        marginBottom: 16,
    },
    courseImg: {
        height: 112,
        width: '100%',
        objectFit: 'cover',
        borderRadius: 8,
        borderColor: '#fff',
        borderWidth: 1,
    },
    courseName: {
        fontWeight: '700',
        fontSize: 16,
        color: '#fff',
        marginTop: 8,
    },
    containerLoadCourse: {
        width: '100%',
        height: 300,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadCourseText: {
        fontSize: 24,
        lineHeight: 32,
        color: '#428288',
        fontWeight: '600',
    },
    containerBanner: {
        flex: 1,
        paddingHorizontal: 8,
    },
    banner: {
        width: '100%',
        objectFit: 'cover',
        height: 200,
        borderRadius: 16,
    },
    containerQShop: {
        flex: 1,
        paddingHorizontal: 8,
        marginBottom: 32,
    },
    qShopName: {
        color: '#fff',
        fontSize: 20,
        lineHeight: 28,
        fontWeight: '600',
    },
    containerQShopChild: {
        borderRadius: 12,
        backgroundColor: '#22c55e',
        height: 130,
        marginTop: 16,
        flex: 1,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    qShopImg: {
        width: '20%',
        height: 64,
        marginRight: 16,
    },
    qShopTitle: {
        flexWrap: 'wrap',
        color: '#fff',
        fontSize: 16,
        textAlign: 'justify',
        marginBottom: 16,
    },
    qShopText: {
        flexWrap: 'wrap',
        color: '#fff',
        fontSize: 16,
        textAlign: 'justify',
    },
});

export default HomeScreen;
