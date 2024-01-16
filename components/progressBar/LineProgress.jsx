import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

const LineProgress = ({ progress, width, height, strokeWidth, maxScoreText, minScoreText, score }) => {
    const progressValue = (progress / 90) * width;

    return (
        <View style={{ display: 'flex', flexDirection: 'row' }}>
            <View style={{ width: 30, justifyContent: 'flex-start', alignItems: 'center' }}>
                <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: '500' }}>{minScoreText}</Text>
            </View>
            <View>
                <Svg height={height + 40} width={width}>
                    <Rect x="0" y={height / 2 - strokeWidth / 2} width={width} height={strokeWidth} fill="#e9ecef" />
                    <Rect
                        x="0"
                        y={height / 2 - strokeWidth / 2}
                        width={progressValue}
                        height={strokeWidth}
                        fill="#3ca09e"
                    />
                </Svg>

                <View
                    style={{
                        position: 'absolute',
                        top: height / 2 - 5,
                        left: 0,
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: `${progress}%`,
                        borderRadius: 8,
                    }}
                >
                    <Text style={{ fontSize: 20, zIndex: 1, color: '#fff', fontWeight: 'bold' }}>{score}</Text>
                </View>
            </View>
            <View style={{ width: 30, justifyContent: 'flex-start', alignItems: 'center' }}>
                <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: '500' }}>{maxScoreText}</Text>
            </View>
        </View>
    );
};

export default LineProgress;
