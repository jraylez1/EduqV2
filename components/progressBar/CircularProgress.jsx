import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const CircularProgress = ({ progress, radius, strokeWidth, score }) => {
    const diameter = radius * 2;
    const circumference = Math.PI * diameter;
    const progressValue = (progress / 100) * circumference;
    return (
        <View style={{ alignItems: 'center' }}>
            <Svg height={diameter} width={diameter}>
                <Circle
                    cx={radius}
                    cy={radius}
                    r={radius - strokeWidth / 2}
                    fill="transparent"
                    stroke="#e9ecef"
                    strokeWidth={strokeWidth}
                />
                <Circle
                    cx={radius}
                    cy={radius}
                    r={radius - strokeWidth / 2}
                    fill="transparent"
                    stroke="#3ca09e"
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${progressValue} ${circumference}`}
                />
            </Svg>
            <View
                style={{
                    position: 'absolute',
                    top: radius - 15,
                    left: radius - 13,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Text style={{ textAlign: 'center', fontSize: 24, fontWeight: 'bold' }}>{score}</Text>
            </View>
        </View>
    );
};

export default CircularProgress;
