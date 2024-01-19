import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import React, { useLayoutEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

const AchievementsScreen = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: t('Achievement'),
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: '#023468',
            },
            headerTintColor: '#fff',
        });
    }, []);
    return (
        <SafeAreaView style={styles.container}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <MaterialCommunityIcons name="archive-star" size={80} color="white" />
                <Text style={styles.title}>{t('No achievement yet')}</Text>
            </View>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#023468',
        height: '100%',
        padding: 16,
    },
    title: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 24,
        lineHeight: 32,
        marginTop: 24,
    },
});
export default AchievementsScreen;
