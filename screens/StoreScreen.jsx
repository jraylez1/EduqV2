import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, FlatList, ActivityIndicator, TextInput } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { ProductStore } from '../services/product';
import { Button, NativeBaseProvider } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProductDetail from '../components/productDetail/ProductDetail';
const StoreScreen = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const isFocused = useIsFocused();
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProduct, setTotalProduct] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = async () => {
        try {
            const productData = await ProductStore.getListProduct(1, searchQuery);
            setProducts(productData.products);
            setIsLoading(false);
        } catch (error) {
            console.error('Error searching for products:', error);
        }
    };
    useEffect(() => {
        if (isFocused) {
            loadCartItems();
            setIsLoading(true);
            async function fetchProduct() {
                const productData = await ProductStore.getListProduct(currentPage, '');
                setProducts([...products, ...productData.products]);
                setTotalProduct(productData.total);
                setIsLoading(false);
            }
            fetchProduct();
        }
    }, [currentPage, isFocused]);

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
    const renderLoader = () => {
        return isLoading ? (
            <View style={{ marginBottom: 32 }}>
                <ActivityIndicator size="large" color="#aaa" />
            </View>
        ) : null;
    };

    const loadMoreItem = () => {
        setCurrentPage(currentPage + 1);
    };

    const renderProduct = React.useMemo(
        () =>
            ({ item }) =>
                <ProductDetail item={item} cartItems={cartItems} setCartItems={setCartItems} />,
        [cartItems, setCartItems],
    );
    const ITEM_HEIGHT = 200;
    const getItemLayout = (data, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
    });

    return (
        <SafeAreaView
            style={{
                backgroundColor: '#023468',
                height: '100%',
                // paddingTop: 48,
                paddingHorizontal: 16,
                paddingBottom: 60,
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
                    paddingBottom: 8,
                    paddingTop: 16,
                }}
            >
                <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
                    <AntDesign name="arrowleft" size={24} color="white" />
                </TouchableOpacity>
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 24, lineHeight: 32 }}>{t('Store')}</Text>

                <TouchableOpacity style={{ position: 'relative' }} onPress={() => navigation.navigate('CartScreen')}>
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
            <Text style={{ color: '#fff', fontWeight: '500', fontSize: 20, lineHeight: 28, marginBottom: 16 }}>
                {t('Found') + ' ' + totalProduct + ' ' + t('product for you.')}
            </Text>
            <View style={{ marginBottom: 16, height: 48 }}>
                <NativeBaseProvider>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ width: '80%', marginRight: 8 }}>
                            <TextInput
                                placeholder={t('Search')}
                                clearButtonMode="always"
                                style={{
                                    backgroundColor: '#fff',
                                    paddingHorizontal: 20,
                                    paddingVertical: 8,
                                    borderColor: '#ccc',
                                    borderWidth: 2,
                                    borderRadius: 6,
                                }}
                                autoCapitalize="none"
                                autoCorrect={false}
                                value={searchQuery}
                                onChangeText={(text) => setSearchQuery(text)}
                            />
                        </View>
                        <Button size="lg" style={{ width: '18%' }} onPress={handleSearch}>
                            <AntDesign name="search1" size={18} color="white" />
                        </Button>
                    </View>
                </NativeBaseProvider>
            </View>
            {products.length > 0 ? (
                <FlatList
                    data={products}
                    renderItem={renderProduct}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={2}
                    contentContainerStyle={{ marginTop: 8 }}
                    ListFooterComponent={renderLoader}
                    onEndReached={loadMoreItem}
                    onEndReachedThreshold={0}
                    getItemLayout={getItemLayout}
                />
            ) : (
                <>
                    <View style={{ width: '100%', height: 300, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 24, lineHeight: 32, color: '#428288', fontWeight: '600' }}>
                            ...Loading products
                        </Text>
                    </View>
                </>
            )}
        </SafeAreaView>
    );
};

export default StoreScreen;
