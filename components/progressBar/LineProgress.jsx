import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

const LineProgress = ({ title, progress, width, height, strokeWidth }) => {
    const progressValue = (progress / 100) * width;

    return (
        <View>
            <Svg height={height + 40} width={width}>
                <Rect x="0" y={height / 2 - strokeWidth / 2} width={width} height={strokeWidth} fill="#CCCCCC" />
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
                }}
            >
                <Text style={{ fontSize: 20, zIndex: 1, color: '#fff', fontWeight: 'bold' }}>{title}</Text>
            </View>
        </View>
    );
};

export default LineProgress;
