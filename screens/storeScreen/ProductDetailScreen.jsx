import { View, Text, TouchableOpacity, Image, ScrollView, FlatList } from 'react-native';
import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Button, NativeBaseProvider, Icon } from 'native-base';
import NumericInput from 'react-native-numeric-input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProductRelated from '../../components/productDetail/ProductRelated';
import { Domain } from '@env';

const ProductDetailScreen = ({ route }) => {
    const data = route?.params?.data;
    const navigation = useNavigation();
    const { t } = useTranslation();
    const [totalProduct, setTotalProduct] = useState(1);
    const [cartItems, setCartItems] = useState([]);
    const isFocused = useIsFocused();
    const [totalQuantity, setTotalQuantity] = useState(0);
    const scrollViewRef = useRef(null);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    useEffect(() => {
        if (isFocused) {
            loadCartItems();
        }
    }, [isFocused]);

    useEffect(() => {
        const calculatedTotalQuantity = cartItems.reduce((accumulator, currentItem) => {
            return accumulator + currentItem.quantity;
        }, 0);
        setTotalQuantity(calculatedTotalQuantity);
    }, [cartItems]);

    const loadCartItems = async () => {
        try {
            const storedCartItems = await AsyncStorage.getItem('cart-store');
            if (storedCartItems !== null) {
                setCartItems(JSON.parse(storedCartItems));
            }
        } catch (error) {
            console.error('Error loading cart items:', error);
        }
    };

    const addToCart = React.useCallback(
        async (product) => {
            try {
                const existingProductIndex = cartItems.findIndex((item) => item.id === product.id);

                setCartItems((prevCartItems) => {
                    if (existingProductIndex !== -1) {
                        const updatedCartItems = [...prevCartItems];
                        updatedCartItems[existingProductIndex].quantity += product.quantity;
                        AsyncStorage.setItem('cart-store', JSON.stringify(updatedCartItems)).catch((error) => {
                            console.error('Error saving cart items to AsyncStorage:', error);
                        });

                        return updatedCartItems;
                    } else {
                        const updatedCartItems = [...prevCartItems, product];
                        AsyncStorage.setItem('cart-store', JSON.stringify(updatedCartItems)).catch((error) => {
                            console.error('Error saving cart items to AsyncStorage:', error);
                        });
                        return updatedCartItems;
                    }
                });
            } catch (error) {
                console.error('Error adding to cart:', error);
            }
        },
        [cartItems, setCartItems],
    );

    return (
        <View
            style={{
                backgroundColor: '#023468',
                height: '100%',
                paddingHorizontal: 16,
                position: 'relative',
            }}
        >
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
                    className="p-4"
                >
                    <AntDesign name="arrowleft" size={24} color="white" />
                </TouchableOpacity>
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 24, lineHeight: 32 }}>{t('Store')}</Text>

                <TouchableOpacity style={{ position: 'relative' }} onPress={() => navigation.replace('CartScreen')}>
                    <View
                        style={{
                            backgroundColor: '#06b6d4',
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            borderRadius: 8,
                        }}
                    >
                        <AntDesign name="shoppingcart" size={24} color="white" />
                    </View>
                    <View
                        style={{
                            position: 'absolute',
                            bottom: -8,
                            right: -8,
                            backgroundColor: '#e11d48',
                            borderRadius: 9999,
                            paddingHorizontal: 8,
                        }}
                    >
                        <Text style={{ color: '#fff', fontWeight: '700' }}>{totalQuantity}</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <ScrollView ref={scrollViewRef} style={{ flex: 1 }}>
                <View>
                    {data.thumbnailUrl?.length > 0 ? (
                        <Image
                            source={{ uri: Domain + data.thumbnailUrl }}
                            style={{ height: 240, width: '100%', objectFit: 'cover', borderRadius: 8 }}
                        />
                    ) : (
                        <Image
                            source={{
                                uri: 'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg',
                            }}
                            style={{ height: 240, width: '100%', objectFit: 'cover', borderRadius: 8 }}
                        />
                    )}

                    <Text
                        numberOfLines={2}
                        style={{ fontWeight: '700', fontSize: 24, lineHeight: 32, color: '#fff', marginTop: 8 }}
                    >
                        {data.name}
                    </Text>
                    <View>
                        {data.priceSetting.sellingPrice != 0 ? (
                            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                                <Text
                                    style={{
                                        fontWeight: '700',
                                        fontSize: 20,
                                        lineHeight: 28,
                                        color: '#fff',
                                        marginVertical: 12,
                                        marginRight: 8,
                                    }}
                                >
                                    {data.priceSetting.sellingPrice.toLocaleString('vi-VN', {
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
                                        marginVertical: 8,
                                        textDecorationLine: 'line-through',
                                    }}
                                >
                                    {data.priceSetting.price.toLocaleString('vi-VN', {
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
                                    color: '#fff',
                                    marginVertical: 12,
                                }}
                            >
                                {t('Free')}
                            </Text>
                        )}
                    </View>
                    <Text numberOfLines={4} style={{ fontSize: 16, color: '#fff', textAlign: 'justify' }}>
                        {data.summary}
                    </Text>
                </View>
                <View style={{ marginTop: 32 }}>
                    <View
                        style={{
                            width: '100%',
                            marginRight: 8,
                            borderRadius: 9999,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingBottom: 16,
                        }}
                    >
                        <Text
                            style={{
                                color: '#fff',
                                fontWeight: '700',
                                fontSize: 20,
                                lineHeight: 28,
                                marginRight: 16,
                                textAlign: 'center',
                            }}
                        >
                            {t('Quantity') + ':'}
                        </Text>
                        <NumericInput
                            value={totalProduct}
                            onChange={(value) => setTotalProduct(value)}
                            totalWidth={160}
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
                    <NativeBaseProvider style={{ width: '100%' }}>
                        <Button
                            alignSelf="center"
                            leftIcon={<Icon as={AntDesign} name="shoppingcart" size="xl" />}
                            style={{ fontSize: 20, lineHeight: 28, width: '100%', height: 48 }}
                            onPress={() => addToCart({ id: data.id, quantity: totalProduct })}
                        >
                            {t('Add to Cart')}
                        </Button>
                    </NativeBaseProvider>
                </View>
                <View>
                    <Text
                        numberOfLines={2}
                        style={{
                            fontWeight: '700',
                            fontSize: 24,
                            lineHeight: 32,
                            color: '#fff',
                            marginTop: 20,
                            marginBottom: 8,
                            textAlign: 'center',
                        }}
                    >
                        {t('Related Products')}
                    </Text>

                    {data.relatedProducts?.length > 0 ? (
                        <View style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap' }}>
                            {data.relatedProducts.map((item, index) => (
                                <ProductRelated key={index} item={item} scrollViewRef={scrollViewRef} />
                            ))}
                        </View>
                    ) : (
                        <View style={{ width: '100%', height: 100, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 24, lineHeight: 32, color: '#428288', fontWeight: '600' }}>
                                {t('0 products')}
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

export default ProductDetailScreen;
