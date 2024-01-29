import Svg, { G, Path, Circle, Text } from 'react-native-svg';
import React from 'react';

const Level8JoyQ = (props) => {
    const { name } = props;

    return (
        <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 152.52 156.92" {...props} width={120} height={120}>
            <G data-name="Layer 2">
                <G data-name="Layer 1">
                    <Path
                        d="m152.52 0-7.77 45.9-7.77 45.9-35.87-29.68-35.86-29.67 43.63-16.23L152.52 0z"
                        style={{
                            fill: '#71ff9c',
                        }}
                    />
                    <Circle
                        cx={72.35}
                        cy={84.57}
                        r={70.85}
                        style={{
                            fill: '#fff',
                            stroke: '#71ff9c',
                            strokeMiterlimit: 10,
                            strokeWidth: 3,
                        }}
                    />
                    <Text x="50%" y="55%" textAnchor="middle" dy=".3em" fontSize={20} fill="#71ff9c" fontWeight={800}>
                        {name}
                    </Text>
                </G>
            </G>
        </Svg>
    );
};

export default Level8JoyQ;
