import { Image, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { AuthStore } from '../../services/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const setHeaderOptions = ({ navigation, headerTitle, isProgress }) => {
    navigation.setOptions({
        headerTitle: headerTitle,
        headerTitleAlign: 'center',
        headerStyle: {
            backgroundColor: '#023468',
        },
        headerTintColor: '#fff',
        headerRight: () => null,
    });

    Promise.all([AsyncStorage.getItem('avatarUrl'), AuthStore.isLoggedIn()])
        .then(([avatarUrl, isLoggedIn]) => {
            navigation.setOptions({
                headerRight: () => (
                    <>
                        {isLoggedIn ? (
                            <TouchableOpacity
                                onPress={() =>
                                    isProgress
                                        ? navigation.navigate('ProgressScreen')
                                        : navigation.navigate('UserInforScreen')
                                }
                            >
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
                ),
            });
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
};
