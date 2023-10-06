import { View, Text } from 'react-native';
import { HomeScreen, UserScreen, StoreScreen, UserInforScreen } from '../../screens';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { AuthStore } from '../../services/auth';

const Tab = createBottomTabNavigator();

const screenOptions = {
    tabBarShowLabel: false,
    headerShown: false,
    tabBarStyle: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        elevation: 0,
        height: 60,
        background: '#fff',
    },
};
const BottomNavigation = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const updateLoginStatus = async () => {
            const loggedIn = await AuthStore.isLoggedIn();
            setIsLoggedIn(loggedIn);
        };
        updateLoginStatus();
    }, []);
    return (
        <Tab.Navigator screenOptions={screenOptions}>
            <Tab.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View class="items-center justify-center">
                                <AntDesign name="home" size={28} color={focused ? '#007BB5' : '#111'} />
                            </View>
                        );
                    },
                }}
            />
            <Tab.Screen
                name="StoreScreen"
                component={StoreScreen}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View class="items-center justify-center">
                                <AntDesign name="shoppingcart" size={28} color={focused ? '#007BB5' : '#111'} />
                            </View>
                        );
                    },
                }}
            />
            <Tab.Screen
                name="UserScreen"
                component={isLoggedIn ? UserInforScreen : UserScreen}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View class="items-center justify-center">
                                <AntDesign name="user" size={28} color={focused ? '#007BB5' : '#111'} />
                            </View>
                        );
                    },
                }}
            />
        </Tab.Navigator>
    );
};

export default BottomNavigation;
