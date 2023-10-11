import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomNavigation from './components/bottomNavigation/BottomNavigation';
import {
    HomeScreen,
    UserScreen,
    StoreScreen,
    SignUpScreen,
    ForgotPasswordScreen,
    UserInforScreen,
    ProfileScreen,
    TransactionScreen,
    AchievementsScreen,
    ContactScreen,
    CartScreen,
    ProductDetailScreen,
    OrderInfoScreen,
    OrderFinishScreen,
    CourseScreen,
    LessonScreen,
    VideoScreen,
    BuyCourse,
    BuyCourseFinish,
} from './screens';
const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="BottomNavigation" component={BottomNavigation} options={{ headerShown: false }} />
                <Stack.Screen name="HomeScreen" component={HomeScreen} />
                <Stack.Screen name="StoreScreen" component={StoreScreen} />
                <Stack.Screen name="UserScreen" component={UserScreen} />
                <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
                <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
                <Stack.Screen name="UserInforScreen" component={UserInforScreen} />
                <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
                <Stack.Screen name="TransactionScreen" component={TransactionScreen} />
                <Stack.Screen name="AchievementsScreen" component={AchievementsScreen} />
                <Stack.Screen name="ContactScreen" component={ContactScreen} />
                <Stack.Screen name="CartScreen" component={CartScreen} />
                <Stack.Screen name="ProductDetailScreen" component={ProductDetailScreen} />
                <Stack.Screen name="OrderInfoScreen" component={OrderInfoScreen} />
                <Stack.Screen name="OrderFinishScreen" component={OrderFinishScreen} />
                <Stack.Screen name="CourseScreen" component={CourseScreen} />
                <Stack.Screen name="LessonScreen" component={LessonScreen} />
                <Stack.Screen name="VideoScreen" component={VideoScreen} />
                <Stack.Screen name="BuyCourse" component={BuyCourse} />
                <Stack.Screen name="BuyCourseFinish" component={BuyCourseFinish} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
