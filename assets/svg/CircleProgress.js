import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Svg, Circle, G, Text as SvgText } from 'react-native-svg';

const CircleProgress = (props) => {
    const [randomColor, setRandomColor] = useState('#FFFFFF');
    const { percent, width, height } = props;
    useEffect(() => {
        setRandomColor(getRandomColor());
    }, []);

    const cx = 85.59;
    const cy = 85.59;
    const radius = 80.09;
    const strokeWidth = 6;
    const perimeter = Math.PI * 2 * radius;

    const progressOffset = () => {
        const percentDecimal = percent / 100;
        return perimeter * (1 - percentDecimal);
    };

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    return (
        <View style={{ transform: [{ rotate: '180deg' }] }}>
            <Svg width={width} height={height} viewBox="0 0 171.18 171.18">
                <G id="Layer_2">
                    <G id="Layer_1-2">
                        <Circle cx={cx} cy={cy} r="85.09" fill="#fff" />
                        <Circle cx={cx} cy={cy} r={radius} fill="none" stroke="#a0a7aa" strokeWidth="1" />
                        <Circle
                            cx={cx}
                            cy={cy}
                            r={radius}
                            fill="none"
                            stroke={randomColor}
                            strokeWidth={strokeWidth}
                            strokeDasharray={perimeter}
                            strokeDashoffset={progressOffset()}
                            strokeLinecap="round"
                        />
                        <Circle cx={cx} cy={cy} r="55.12" fill={randomColor} />
                        <SvgText
                            x="50%"
                            y="50%"
                            fill="#fff"
                            fontWeight="bold"
                            fontSize="24"
                            textAnchor="middle"
                            alignmentBaseline="middle"
                            transform={`rotate(180 ${cx} ${cy})`}
                        >
                            {`${percent}%`}
                        </SvgText>
                    </G>
                </G>
            </Svg>
        </View>
    );
};

export default CircleProgress;
