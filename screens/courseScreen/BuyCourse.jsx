import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { AntDesign } from '@expo/vector-icons';
import { Radio, NativeBaseProvider, Modal, Center, Button } from 'native-base';
import { CourseStore } from '../../services/course';

const BuyCourse = ({ route }) => {
    const data = route?.params?.data;
    const navigation = useNavigation();
    const { t } = useTranslation();
    const [value, setValue] = React.useState(data.id);
    const [showModal, setShowModal] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: t('Course information'),
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: '#023468',
            },
            headerTintColor: '#fff',
            headerRight: () => {
                return (
                    <AntDesign
                        name="customerservice"
                        size={24}
                        color="white"
                        onPress={() => navigation.navigate('ContactScreen')}
                    />
                );
            },
        });
    }, []);

    const buyCourseFinish = async () => {
        setShowModal(false);
        const dataCourseFinish = await CourseStore.buy(data.aliasUrl, data.id);
        navigation.navigate('BuyCourseFinish', { data: dataCourseFinish });
    };
    return (
        <NativeBaseProvider>
            <View style={{ backgroundColor: '#023468', height: '100%', padding: 16 }}>
                <View>
                    <Text style={styles.title}>{t('Course name')}</Text>
                    <Text style={styles.text}>{data.name}</Text>
                </View>
                <View>
                    <Text style={styles.title}>{t('Description')}</Text>
                    <Text style={styles.text}>{data.htmlContent}</Text>
                </View>
                <View>
                    <Text style={styles.title}>{t('Payment information')}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Radio.Group name="myRadioGroup" accessibilityLabel="favorite number" value={value}>
                            <Radio value={data.id} my={1}>
                                <Text style={styles.text}>
                                    {data.packages[0].name} -{' '}
                                    {data.packages[0].priceSetting.sellingPrice.toLocaleString('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    })}
                                </Text>
                            </Radio>
                        </Radio.Group>
                    </View>
                </View>
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        padding: 16,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#2e72ad',
                        width: '100%',
                        marginTop: 20,
                        borderRadius: 6,
                    }}
                    onPress={() => setShowModal(true)}
                >
                    <Text style={{ color: '#fff', fontSize: 18, lineHeight: 28, marginLeft: 8 }}>{t('Payment')}</Text>
                </TouchableOpacity>
            </View>
            <Center>
                <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                    <Modal.Content maxWidth="400px">
                        <Modal.CloseButton />
                        <Modal.Header>{t('EduQ Notification')}</Modal.Header>
                        <Modal.Body>
                            <Text style={{ textAlign: 'justify' }}>
                                {t('Do you really want to initiate this order?')}
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
                                <Button onPress={() => buyCourseFinish()}>{t('Agree')}</Button>
                            </Button.Group>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>
            </Center>
        </NativeBaseProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#023468',
        flex: 1,
        paddingHorizontal: 16,
        // paddingVertical: 48,
        paddingBottom: 48,
    },
    title: { fontSize: 24, lineHeight: 28, color: '#fff', fontWeight: '700', marginBottom: 4, marginTop: 12 },
    text: { fontSize: 20, lineHeight: 24, color: '#fff', marginVertical: 4, textAlign: 'justify' },
});

export default BuyCourse;
