import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { BarChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CourseStore } from '../../services/course';
import { setHeaderOptions } from '../../assets/utils/setHeaderOptions ';
import { NativeBaseProvider, Select, Center, Button } from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import LevelProgress from '../../assets/svg/LevelProgress';
import CircleProgress from '../../assets/svg/CircleProgress';

const ProgressScreen = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);
    const [time, setTime] = useState('1');
    const [level, setLevel] = useState('00');
    const [showAllSubjects, setShowAllSubjects] = useState(false);
    const [displayTopics, setDisplayTopics] = useState([]);
    const [topicData, setTopicData] = useState({
        courseInfo: null,
        data: [],
        totalLessonsWidth: 0,
        totalCompleteWidth: 0,
    });
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [{ data: [] }],
    });

    const chartConfig = {
        backgroundGradientFrom: '#fff',
        backgroundGradientTo: '#fff',
        barPercentage: 0.7,
        height: 5000,
        fillShadowGradient: `rgb(60, 134, 133)`,
        fillShadowGradientOpacity: 1,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgb(60, 134, 133)`,
        labelColor: (opacity = 1) => `rgb(60, 134, 133)`,
        style: {
            borderRadius: 4,
            fontFamily: 'Bogle-Regular',
        },
        propsForBackgroundLines: {
            strokeWidth: 1,
            stroke: '#e3e3e3',
            strokeDasharray: '0',
        },
        propsForLabels: {
            fontFamily: 'Bogle-Regular',
            fontWeight: '600', // Changed from 600 to '600' to ensure compatibility as some platforms expect a string.
        },
    };

    const getTopicProgressData = async () => {
        const userId = await AsyncStorage.getItem('userId');

        if (userId) {
            const alias = 'joyq';
            const studyingRouteData = await CourseStore.getStudyingRoute(alias);
            const studyRouteData = await CourseStore.getStudyRoute(alias, 0, studyingRouteData.aliasUrl, 0);
            if (studyRouteData) {
                const ids = studyRouteData.extendData.filters.lessonTopics.map((item) => item.id);

                const topicReportData = await CourseStore.getTopicReport({
                    aliasUrl: alias,
                    idUser: userId,
                    idTopics: ids,
                });

                const levelNumber = (
                    (topicReportData?.data?.courseInfo?.totalCompleted /
                        topicReportData?.data?.courseInfo?.totaLessons) *
                    100
                ).toFixed();
                await setTopicData({
                    courseInfo: topicReportData.data.courseInfo,
                    data: topicReportData.data.data,
                    totalCompleteWidth: levelNumber,
                    totalLessonsWidth: 100 - levelNumber,
                });

                const width = levelNumber;
                const level = Math.ceil(width / 10);
                const levelTotal = level < 10 ? '0' + level : String(level);
                setLevel(levelTotal);
                getTopics(topicReportData.data.data);
            }
        }
    };

    const getProgressData = async (time = '1') => {
        setIsLoading(true);
        const userId = await AsyncStorage.getItem('userId');
        let toDate;
        let fromDate;
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        setTime(time);
        switch (time) {
            case '1':
                fromDate = '2024-01-01';
                toDate = tomorrow.toISOString().split('T')[0];
                break;
            case '2':
                fromDate = today.toISOString().split('T')[0];
                toDate = tomorrow.toISOString().split('T')[0];
                break;
            case '3':
                const currentWeekEnd = new Date(today);
                currentWeekEnd.setDate(currentWeekEnd.getDate() - today.getDay() + 1);
                const currentWeekStart = new Date(currentWeekEnd);
                currentWeekStart.setDate(currentWeekEnd.getDate() - 7);
                fromDate = currentWeekStart.toISOString().split('T')[0];
                toDate = currentWeekEnd.toISOString().split('T')[0];
                break;
            case '4':
                const lastMonth = new Date(today);
                lastMonth.setMonth(lastMonth.getMonth() - 1);
                fromDate = lastMonth.toISOString().split('T')[0];
                toDate = today.toISOString().split('T')[0];
                break;
            case '5':
                const lastYear = new Date(today.getFullYear() - 1, 0, 1);
                const lastDayOfYear = new Date(today.getFullYear() - 1, 11, 31);
                fromDate = lastYear.toISOString().split('T')[0];
                toDate = lastDayOfYear.toISOString().split('T')[0];
                break;
            default:
                break;
        }

        if (userId) {
            const courseReportData = await CourseStore.getCourseReport({
                aliasUrl: 'joyq',
                idUser: userId,
                fromDate: fromDate,
                toDate: toDate,
            });
            if (courseReportData && courseReportData.data) {
                if (courseReportData.data.dates.length === 0 || courseReportData.data.length === 0) {
                    setChartData({
                        labels: [0],
                        datasets: [{ data: [0] }],
                    });
                } else {
                    setChartData({
                        labels: courseReportData.data.dates || [],
                        datasets: [{ data: courseReportData.data.values || [] }],
                    });
                }
            }
            await getTopicProgressData();
            setIsLoading(false);
        }
    };

    const getTopics = (data) => {
        if (showAllSubjects) {
            setDisplayTopics(data);
        } else {
            setDisplayTopics(data.slice(0, 3));
        }
    };

    useEffect(() => {
        getTopics(topicData.data);
    }, [showAllSubjects]);

    useEffect(() => {
        getProgressData();
    }, []);

    useLayoutEffect(() => {
        setHeaderOptions({ navigation, headerTitle: t('Progress') });
    }, [navigation, t]);

    return (
        <ScrollView style={{ backgroundColor: '#fff', flex: 1, paddingTop: 10 }}>
            {!isLoading && (
                <NativeBaseProvider>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ textAlign: 'center', color: '#9c3b38', fontWeight: 'bold', fontSize: 20 }}>
                            {t('Ticket progress')}
                        </Text>
                        <BarChart
                            data={chartData}
                            width={Dimensions.get('window').width - 10}
                            height={220}
                            yAxisInterval={1}
                            chartConfig={chartConfig}
                            bezier
                            style={{
                                marginVertical: 8,
                                borderRadius: 16,
                            }}
                        />
                    </View>
                    <View
                        style={{
                            paddingHorizontal: 20,
                            paddingBottom: 20,
                        }}
                    >
                        <Text style={{ fontWeight: 'bold', fontSize: 14 }}>{t('Select progress')}:</Text>
                        <Select
                            selectedValue={time}
                            minWidth="200"
                            accessibilityLabel="Choose Service"
                            placeholder="Choose Service"
                            _selectedItem={{
                                bg: 'teal.600',
                                endIcon: <AntDesign name="check" size={24} color="black" />,
                            }}
                            mt={1}
                            onValueChange={(itemValue) => getProgressData(itemValue)}
                        >
                            <Select.Item label={t('All time')} value="1" />
                            <Select.Item label={t('Today')} value="2" />
                            <Select.Item label={t('Last week')} value="3" />
                            <Select.Item label={t('Last month')} value="4" />
                            <Select.Item label={t('Last year')} value="5" />
                        </Select>
                        <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center' }}>
                            <LevelProgress svgWidth={90} svgHeight={90} Level={level} />
                            <View style={[{ flex: 1, marginLeft: 5 }, { width: 'calc(100% - 100px)' }]}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 30 }}>
                                    <View
                                        style={{
                                            height: 40,
                                            backgroundColor: '#3c8685',
                                            width: topicData.totalLessonsWidth + '%',
                                            borderRightWidth: 6,
                                            borderRightColor: '#fff',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                color: '#fff',
                                                fontWeight: 'bold',
                                                fontSize: 18,
                                            }}
                                        >
                                            {topicData.totalLessonsWidth + '%'}
                                        </Text>
                                    </View>
                                    <View
                                        style={{
                                            height: 40,
                                            backgroundColor: '#a8dba9',
                                            width: topicData.totalCompleteWidth + '%',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                color: '#fff',
                                                fontWeight: 'bold',
                                                fontSize: 18,
                                            }}
                                        >
                                            {topicData.totalCompleteWidth >= 18
                                                ? topicData.totalCompleteWidth + '%'
                                                : ''}
                                        </Text>
                                    </View>
                                </View>
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        fontWeight: 'bold',
                                        fontSize: 18,
                                        color: '#3c8685',
                                        marginTop: 5,
                                    }}
                                >
                                    {topicData?.courseInfo?.totalCompleted}/{topicData?.courseInfo?.totaLessons}{' '}
                                    {t('Activities completed')}
                                </Text>
                            </View>
                        </View>
                        <View
                            style={{
                                alignItems: 'center',
                            }}
                        >
                            <Text
                                style={{
                                    textAlign: 'center',
                                    color: '#9c3b38',
                                    fontWeight: 'bold',
                                    fontSize: 20,
                                    marginTop: 20,
                                }}
                            >
                                {t('Subject progress')}
                            </Text>
                            <View
                                style={{
                                    marginTop: 20,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                }}
                            >
                                {displayTopics.map((item, index) => (
                                    <View
                                        key={item.id}
                                        style={{
                                            padding: 5,
                                            width: '33%',
                                            marginTop: index % 3 === 1 ? 60 : 0,
                                        }}
                                    >
                                        {index % 3 === 1 && (
                                            <Text
                                                style={{
                                                    textAlign: 'center',
                                                    fontWeight: 'bold',
                                                    fontSize: 16,
                                                }}
                                                numberOfLines={2}
                                            >
                                                {item.name}
                                            </Text>
                                        )}

                                        <CircleProgress
                                            percent={((item.completedLessons / item.totalLessons) * 100).toFixed()}
                                            height={110}
                                            width={110}
                                        />

                                        {index % 3 !== 1 && (
                                            <Text
                                                style={{
                                                    textAlign: 'center',
                                                    fontWeight: 'bold',
                                                    fontSize: 16,
                                                }}
                                                numberOfLines={2}
                                            >
                                                {item.name}
                                            </Text>
                                        )}
                                    </View>
                                ))}
                            </View>
                            <TouchableOpacity
                                onPress={() => setShowAllSubjects(!showAllSubjects)}
                                style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
                            >
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        color: '#016abe',
                                        fontWeight: 'bold',
                                        marginRight: 5,
                                    }}
                                >
                                    {showAllSubjects ? t('Compact') : t('View all progress')}
                                </Text>
                                {showAllSubjects ? (
                                    <AntDesign name="caretup" size={16} color="#016abe" />
                                ) : (
                                    <AntDesign name="caretdown" size={16} color="#016abe" />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </NativeBaseProvider>
            )}
            {isLoading && (
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Text style={{ fontSize: 20, fontWeight: '600' }}>Loading...</Text>
                </View>
            )}
        </ScrollView>
    );
};

export default ProgressScreen;
