import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import React, { useState, useLayoutEffect, useEffect } from 'react';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartStore } from '../../services/cart';
import NumericInput from 'react-native-numeric-input';
import { Button, NativeBaseProvider } from 'native-base';
import { FontAwesome } from '@expo/vector-icons';
import { ProductStore } from '../../services/product';
import { AuthStore } from '../../services/auth';
import { Domain } from '@env';

const CartScreen = () => {
    const [cartItems, setCartItems] = useState([]);
    const navigation = useNavigation();
    const { t } = useTranslation();
    const isFocused = useIsFocused();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    useEffect(() => {
        if (isFocused) {
            loadCartData();
        }
    }, [isFocused]);

    const loadCartData = async () => {
        setCartItems([]);
        const data = await AsyncStorage.getItem('cart-store');
        if (JSON.parse(data).length > 0) {
            const cartDataItems = await CartStore.getCartProducts(JSON.parse(data));
            setCartItems(cartDataItems);
        }
    };

    const addToCart = async (product) => {
        try {
            const existingProductIndex = cartItems.findIndex((item) => item.id === product.id);

            if (existingProductIndex !== -1) {
                const updatedCartItems = [...cartItems];
                updatedCartItems[existingProductIndex].quantity = product.quantity;
                setCartItems(updatedCartItems);
                await AsyncStorage.setItem('cart-store', JSON.stringify(updatedCartItems));
            } else {
                const updatedCartItems = [...cartItems, product];
                setCartItems(updatedCartItems);
                await AsyncStorage.setItem('cart-store', JSON.stringify(updatedCartItems));
            }
            loadCartData();
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };
    const removeFromCart = async (itemId) => {
        try {
            const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
            await AsyncStorage.setItem('cart-store', JSON.stringify(updatedCartItems));
            setCartItems(updatedCartItems);
            loadCartData();
        } catch (error) {
            console.error('Error removing from cart:', error);
        }
    };

    const goToDetailProduct = async (aliasUrl) => {
        const product = await ProductStore.getProduct(aliasUrl);
        navigation.navigate('ProductDetailScreen', { data: product });
    };

    const renderCartItems = ({ item }) => {
        return (
            <View style={{ backgroundColor: '#fff', marginBottom: 8, borderRadius: 6 }}>
                <View style={{ flexDirection: 'row', paddingHorizontal: 8, paddingVertical: 16, borderBottomWidth: 1 }}>
                    <TouchableOpacity
                        style={{ borderWidth: 2, borderStyle: 'solid', borderRadius: 6, marginRight: 16 }}
                        onPress={() => goToDetailProduct(item.aliasUrl)}
                    >
                        {item.thumbnailUrl?.length > 0 ? (
                            <Image
                                source={{ uri: Domain + item.thumbnailUrl }}
                                style={{ height: 80, width: 80, objectFit: 'cover', borderRadius: 6 }}
                            />
                        ) : (
                            <Image
                                source={{
                                    uri: 'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg',
                                }}
                                style={{ height: 80, width: 80, objectFit: 'cover', borderRadius: 6 }}
                            />
                        )}
                    </TouchableOpacity>
                    <View style={{ width: '72%' }}>
                        <Text numberOfLines={1} style={{ fontWeight: '700', fontSize: 16, color: '#023468' }}>
                            {item.name}
                        </Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontWeight: '700', fontSize: 16, color: '#023468', marginTop: 28 }}>
                                {item.priceSetting.sellingPrice != 0
                                    ? item.priceSetting.sellingPrice.toLocaleString('vi-VN', {
                                          style: 'currency',
                                          currency: 'VND',
                                      })
                                    : t('Free')}
                            </Text>
                            <View
                                style={{
                                    padding: 8,
                                    backgroundColor: '#fff',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <NumericInput
                                    value={item.quantity}
                                    onChange={(value) => addToCart({ id: item.id, quantity: value })}
                                    totalWidth={130}
                                    totalHeight={45}
                                    iconSize={25}
                                    minValue={1}
                                    rounded
                                    valueType="real"
                                    textColor="#023468"
                                    iconStyle={{ color: '#023468' }}
                                    containerStyle={{ backgroundColor: '#fff' }}
                                    rightButtonBackgroundColor="#f8f8f8"
                                    leftButtonBackgroundColor="#f8f8f8"
                                />
                            </View>
                        </View>
                    </View>
                </View>

                <View
                    style={{
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        width: '100%',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: 'row',
                    }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text
                            style={{
                                color: '#023468',
                                fontWeight: '700',
                                fontSize: 18,
                                lineHeight: 28,
                                marginRight: 8,
                            }}
                        >
                            {t('Amount') + ':'}
                        </Text>
                        <Text style={{ color: '#023468', fontWeight: '700', fontSize: 18, lineHeight: 28 }}>
                            {item.amount != 0
                                ? item.amount.toLocaleString('vi-VN', {
                                      style: 'currency',
                                      currency: 'VND',
                                  })
                                : 0 + ' đ'}
                        </Text>
                    </View>
                    <View>
                        <NativeBaseProvider style={{ width: 'auto' }}>
                            <Button alignSelf="center" colorScheme="secondary" onPress={() => removeFromCart(item.id)}>
                                <FontAwesome name="remove" size={16} color="#fff" />
                            </Button>
                        </NativeBaseProvider>
                    </View>
                </View>
            </View>
        );
    };

    const calculateTotalAmount = (cartItems) => {
        if (cartItems != null) {
            const totalAmount = cartItems.reduce((accumulator, currentItem) => {
                return accumulator + currentItem.amount;
            }, 0);

            return totalAmount;
        } else {
            return 0;
        }
    };
    const totalAmount = calculateTotalAmount(cartItems);

    const gotoOderScreen = async () => {
        const profile = await AuthStore.getProfile();
        navigation.navigate('OrderInfoScreen', { data: profile });
    };

    return (
        <View style={{ paddingHorizontal: 16, flex: 1, backgroundColor: '#023468', paddingBottom: 48 }}>
            <NativeBaseProvider>
                <View
                    style={{
                        width: '100%',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: 'row',
                        zIndex: 50,
                        paddingVertical: 16,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => navigation.replace('BottomNavigation', { screen: 'StoreScreen' })}
                        style={{ padding: 8 }}
                    >
                        <AntDesign name="arrowleft" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={{ color: '#fff', fontWeight: '700', fontSize: 24, lineHeight: 32 }}>{t('Store')}</Text>

                    <TouchableOpacity
                        style={{ position: 'relative' }}
                        onPress={() => navigation.navigate('ContactScreen')}
                    >
                        <AntDesign name="customerservice" size={24} color="white" />
                    </TouchableOpacity>
                </View>
                <Text style={{ color: '#fff', fontWeight: '500', fontSize: 24, lineHeight: 32, marginBottom: 8 }}>
                    {t('Shopping Cart Information')}
                </Text>
                <View style={{ height: 500 }}>
                    {cartItems?.length > 0 ? (
                        <FlatList
                            data={cartItems}
                            renderItem={renderCartItems}
                            keyExtractor={(item, index) => index}
                            contentContainerStyle={{ marginTop: 8 }}
                        />
                    ) : (
                        <>
                            <View
                                style={{ width: '100%', height: 200, alignItems: 'center', justifyContent: 'center' }}
                            >
                                <Text
                                    style={{
                                        fontSize: 24,
                                        lineHeight: 32,
                                        color: '#fff',
                                        fontWeight: '600',
                                        textAlign: 'center',
                                    }}
                                >
                                    {t('Empty Cart')}
                                </Text>
                                <Text style={{ fontSize: 24, lineHeight: 32, color: '#fff', fontWeight: '600' }}>
                                    {t('Please click')}{' '}
                                    <Text
                                        style={{ textDecorationLine: 'underline', color: '#06B6D4' }}
                                        onPress={() =>
                                            navigation.replace('BottomNavigation', { screen: 'StoreScreen' })
                                        }
                                    >
                                        {t('here')}
                                    </Text>{' '}
                                    {t('to purchase products')}
                                </Text>
                            </View>
                        </>
                    )}
                </View>
                {cartItems.length > 0 ? (
                    <View style={{ width: '100%' }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                padding: 8,
                                backgroundColor: '#06B6D4',
                                marginBottom: 8,
                                borderBottomRightRadius: 6,
                                borderBottomLeftRadius: 6,
                            }}
                        >
                            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 20, lineHeight: 28 }}>
                                {t('Total Amount:')}
                            </Text>
                            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 20, lineHeight: 28 }}>
                                {totalAmount.toLocaleString('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                })}
                            </Text>
                        </View>

                        <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: 32 }}>
                            <TouchableOpacity
                                style={{
                                    width: '100%',
                                    paddingVertical: 16,
                                    backgroundColor: '#4EE3AF',
                                    alignItems: 'center',
                                    borderRadius: 6,
                                }}
                                onPress={() => gotoOderScreen()}
                            >
                                <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}> {t('Payment')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : null}
            </NativeBaseProvider>
        </View>
    );
};

export default CartScreen;
