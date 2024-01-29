import Svg, { G, Path, Circle, Text } from 'react-native-svg';
import React from 'react';

const Level6JoyQ = (props) => {
    const { name } = props;

    return (
        <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 144.71 188.67" {...props} width={140} height={140}>
            <G data-name="Layer 2">
                <G data-name="Layer 1">
                    <Path
                        d="M65.41 0 93.6 37.04l28.2 37.04-46.18 5.9-46.17 5.91 17.97-42.95L65.41 0z"
                        style={{
                            fill: '#afcaff',
                        }}
                    />
                    <Circle
                        cx={72.35}
                        cy={116.32}
                        r={70.85}
                        style={{
                            fill: '#fff',
                            stroke: '#afcaff',
                            strokeMiterlimit: 10,
                            strokeWidth: 3,
                        }}
                    />
                    <Text x="40%" y="60%" textAnchor="middle" dy=".3em" fontSize={20} fill="#afcaff" fontWeight={800}>
                        {name}
                    </Text>
                </G>
            </G>
        </Svg>
    );
};

export default Level6JoyQ;
