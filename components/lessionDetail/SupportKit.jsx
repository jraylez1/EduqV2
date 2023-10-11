import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { ProductStore } from '../../services/product';
import { CartStore } from '../../services/cart';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5 } from '@expo/vector-icons';

const SupportKit = ({ data, cartItems, setCartItems, navigation }) => {
    const { t } = useTranslation();

    const goToDetailProduct = async (aliasUrl) => {
        const product = await ProductStore.getProduct(aliasUrl);
        navigation.navigate('ProductDetailScreen', { data: product });
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
            navigation.navigate('CartScreen');
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const loadCartData = async () => {
        const data = await AsyncStorage.getItem('cart-store');
        if (JSON.parse(data).length > 0) {
            const cartDataItems = await CartStore.getCartProducts(JSON.parse(data));
            setCartItems(cartDataItems);
        }
    };
    return (
        <View>
            <Text
                style={{
                    fontSize: 24,
                    textAlign: 'justify',
                    marginVertical: 16,
                    color: '#fff',
                    fontWeight: '500',
                }}
            >
                {t('Support kit')}
            </Text>
            <View style={{ backgroundColor: '#ffeaa5', padding: 8, borderRadius: 6 }}>
                <View>
                    {data.extendData.products[0].thumbnailUrl?.length > 0 ? (
                        <TouchableOpacity onPress={() => goToDetailProduct(data.extendData.products[0].aliasUrl)}>
                            <Image
                                source={{ uri: data.extendData.products[0].thumbnailUrl }}
                                style={{
                                    height: 300,
                                    width: '100%',
                                    objectFit: 'cover',
                                    borderRadius: 8,
                                    zIndex: 10,
                                }}
                            />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => goToDetailProduct(data.extendData.products[0].aliasUrl)}>
                            <Image
                                source={{
                                    uri: 'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg',
                                }}
                                style={{
                                    height: 300,
                                    width: '100%',
                                    objectFit: 'cover',
                                    borderRadius: 8,
                                    zIndex: 10,
                                }}
                            />
                        </TouchableOpacity>
                    )}

                    <Text
                        numberOfLines={1}
                        style={{
                            fontWeight: '700',
                            fontSize: 24,
                            lineHeight: 28,
                            fontWeight: '600',
                            marginVertical: 12,
                            height: 24,
                        }}
                    >
                        {data.extendData.products[0].name}
                    </Text>
                    <View>
                        {data.extendData.products[0].priceSetting.sellingPrice != 0 ? (
                            <View style={{ flexDirection: 'row' }}>
                                <Text
                                    style={{
                                        fontWeight: '700',
                                        fontSize: 20,
                                        lineHeight: 28,
                                        marginRight: 8,
                                    }}
                                >
                                    {data.extendData.products[0].priceSetting.sellingPrice.toLocaleString('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    })}
                                </Text>
                                <Text
                                    style={{
                                        fontWeight: '700',
                                        fontSize: 16,
                                        lineHeight: 28,
                                        color: '#a3a3a3',
                                        textDecorationLine: 'line-through',
                                    }}
                                >
                                    {data.extendData.products[0].priceSetting.price.toLocaleString('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    })}
                                </Text>
                            </View>
                        ) : (
                            <Text
                                style={{
                                    fontWeight: '700',
                                    fontSize: 20,
                                    lineHeight: 28,
                                    marginVertical: 12,
                                }}
                            >
                                {t('Free')}
                            </Text>
                        )}
                    </View>
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            padding: 16,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#c45840',
                            width: '60%',
                            marginTop: 12,
                            borderRadius: 6,
                        }}
                        onPress={() => addToCart({ id: data.extendData.products[0].id, quantity: 1 })}
                    >
                        <FontAwesome5 name="cart-plus" size={24} color="#fff" />
                        <Text style={{ color: '#fff', fontSize: 18, lineHeight: 28, marginLeft: 8 }}>
                            {t('Add to cart')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default SupportKit;
