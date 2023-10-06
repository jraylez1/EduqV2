import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { ProductStore } from '../../services/product';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, NativeBaseProvider, Icon } from 'native-base';

const ProductRelated = React.memo(({ item, scrollViewRef }) => {
    const navigation = useNavigation();
    const goToDetailProduct = async (aliasUrl) => {
        const product = await ProductStore.getProduct(aliasUrl);
        navigation.navigate('ProductDetailScreen', { data: product });
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
    };
    return (
        <View style={{ width: '50%', paddingHorizontal: 6, marginBottom: 16, position: 'relative' }}>
            <TouchableOpacity onPress={() => goToDetailProduct(item.aliasUrl)}>
                <View>
                    {item.thumbnailUrl?.length > 0 ? (
                        <Image
                            source={{ uri: item.thumbnailUrl }}
                            style={{ height: 160, width: '100%', objectFit: 'cover', borderRadius: 8, zIndex: 10 }}
                        />
                    ) : (
                        <Image
                            source={{
                                uri: 'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg',
                            }}
                            style={{ height: 160, width: '100%', objectFit: 'cover', borderRadius: 8, zIndex: 10 }}
                        />
                    )}

                    <Text
                        numberOfLines={1}
                        style={{ fontWeight: '700', fontSize: 16, color: '#fff', marginTop: 8, height: 24 }}
                    >
                        {item.name}
                    </Text>
                    <View>
                        {item.priceSetting.sellingPrice != 0 ? (
                            <View>
                                <Text
                                    style={{
                                        fontWeight: '700',
                                        fontSize: 18,
                                        lineHeight: 28,
                                        color: '#fff',
                                        marginRight: 8,
                                    }}
                                >
                                    {item.priceSetting.sellingPrice.toLocaleString('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    })}
                                </Text>
                                <Text
                                    style={{
                                        fontWeight: '700',
                                        fontSize: 14,
                                        lineHeight: 28,
                                        color: '#a3a3a3',
                                        textDecorationLine: 'line-through',
                                    }}
                                >
                                    {item.priceSetting.price.toLocaleString('vi-VN', {
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
                </View>
            </TouchableOpacity>
        </View>
    );
});

export default ProductRelated;
