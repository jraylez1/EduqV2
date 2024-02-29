import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { BarChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CourseStore } from '../../services/course';
import { setHeaderOptions } from '../../assets/utils/setHeaderOptions ';
import { NativeBaseProvider, Select, Center, Button } from 'native-base';
import { AntDesign } from '@expo/vector-icons';
const ProgressScreen = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);
    const [time, setTime] = useState('1');
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
    const getProgressData = async () => {
        setIsLoading(true);
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
            const courseReportData = await CourseStore.getCourseReport({
                aliasUrl: 'joyq',
                idUser: userId,
                fromDate: '2024-01-01',
                toDate: '2024-03-01',
            });
            if (courseReportData && courseReportData.data) {
                setChartData({
                    labels: courseReportData.data.dates || [],
                    datasets: [{ data: courseReportData.data.values || [] }],
                });
            }
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getProgressData();
    }, []);

    useLayoutEffect(() => {
        setHeaderOptions({ navigation, headerTitle: t('Progress') });
    }, [navigation, t]);

    return (
        <ScrollView style={{ backgroundColor: '#fff', flex: 1, paddingTop: 10 }}>
            {!isLoading && (
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
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
            )}
            {isLoading && (
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, fontWeight: '600' }}>Loading...</Text>
                </View>
            )}
            <NativeBaseProvider>
                <View
                    style={{
                        paddingHorizontal: 20,
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
                        onValueChange={(itemValue) => setTime(itemValue)}
                    >
                        <Select.Item label="All time" value="1" />
                        <Select.Item label="today" value="2" />
                        <Select.Item label="Last week" value="3" />
                        <Select.Item label="Last month" value="4" />
                        <Select.Item label="Last year" value="5" />
                    </Select>
                </View>
            </NativeBaseProvider>
        </ScrollView>
    );
};

export default ProgressScreen;
