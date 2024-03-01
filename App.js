import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomNavigation from './components/bottomNavigation/BottomNavigation';
import { AuthStore } from './services/auth';
import { useEffect } from 'react';
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
    QuestionScreen,
    QTestScreen,
    ChooseAccentScreen,
    LevelScreen,
    QTestQuestionScreen,
    QTestAverageScreen,
    TopicScreen,
    JoyQScreen,
    LearningPathScreen,
    ClassroomScreen,
    JoyQVideoScreen,
    JoyQuestion,
    ModeScreen,
    QTestCustomQuestionScreen,
    ProgressScreen,
} from './screens';

const Stack = createNativeStackNavigator();

export default function App() {
    useEffect(() => {
        const checkLogin = async () => {
            const isLoggedIn = await AuthStore.isLoggedIn();
        };
        checkLogin();
    }, []);
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="BottomNavigation" component={BottomNavigation} options={{ headerShown: false }} />{' '}
                <Stack.Screen name="HomeScreen" component={HomeScreen} />{' '}
                <Stack.Screen name="StoreScreen" component={StoreScreen} />{' '}
                <Stack.Screen name="UserScreen" component={UserScreen} options={{ headerShown: false }} />{' '}
                <Stack.Screen name="SignUpScreen" component={SignUpScreen} />{' '}
                <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />{' '}
                <Stack.Screen name="UserInforScreen" component={UserInforScreen} />{' '}
                <Stack.Screen name="ProfileScreen" component={ProfileScreen} />{' '}
                <Stack.Screen name="TransactionScreen" component={TransactionScreen} />{' '}
                <Stack.Screen name="AchievementsScreen" component={AchievementsScreen} />{' '}
                <Stack.Screen name="ContactScreen" component={ContactScreen} />{' '}
                <Stack.Screen name="CartScreen" component={CartScreen} />{' '}
                <Stack.Screen name="ProductDetailScreen" component={ProductDetailScreen} />{' '}
                <Stack.Screen name="OrderInfoScreen" component={OrderInfoScreen} />{' '}
                <Stack.Screen name="OrderFinishScreen" component={OrderFinishScreen} />{' '}
                <Stack.Screen name="CourseScreen" component={CourseScreen} />{' '}
                <Stack.Screen name="LessonScreen" component={LessonScreen} />{' '}
                <Stack.Screen name="VideoScreen" component={VideoScreen} />{' '}
                <Stack.Screen name="BuyCourse" component={BuyCourse} />{' '}
                <Stack.Screen name="BuyCourseFinish" component={BuyCourseFinish} />{' '}
                <Stack.Screen name="QuestionScreen" component={QuestionScreen} />{' '}
                <Stack.Screen name="QTestScreen" component={QTestScreen} />{' '}
                <Stack.Screen name="ChooseAccentScreen" component={ChooseAccentScreen} />{' '}
                <Stack.Screen name="LevelScreen" component={LevelScreen} />{' '}
                <Stack.Screen name="QTestQuestionScreen" component={QTestQuestionScreen} />{' '}
                <Stack.Screen name="QTestAverageScreen" component={QTestAverageScreen} />{' '}
                <Stack.Screen name="TopicScreen" component={TopicScreen} />{' '}
                <Stack.Screen name="JoyQScreen" component={JoyQScreen} />{' '}
                <Stack.Screen name="LearningPathScreen" component={LearningPathScreen} />{' '}
                <Stack.Screen name="ClassroomScreen" component={ClassroomScreen} />{' '}
                <Stack.Screen name="JoyQVideoScreen" component={JoyQVideoScreen} />{' '}
                <Stack.Screen name="JoyQuestion" component={JoyQuestion} />{' '}
                <Stack.Screen name="ModeScreen" component={ModeScreen} />{' '}
                <Stack.Screen name="QTestCustomQuestionScreen" component={QTestCustomQuestionScreen} />{' '}
                <Stack.Screen name="ProgressScreen" component={ProgressScreen} />{' '}
            </Stack.Navigator>{' '}
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
