import Svg, { G, Path, Circle, Text } from 'react-native-svg';
import React from 'react';

const Level3JoyQ = (props) => {
    const { name } = props;

    return (
        <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 144.7 167.05" {...props} width={120} height={120}>
            <G data-name="Layer 2">
                <G data-name="Layer 1">
                    <Path
                        d="m4.45 167.05 1.44-46.53 1.44-46.53L46.91 98.5l39.58 24.52-41.02 22.01-41.02 22.02z"
                        style={{
                            fill: '#85e3ff',
                        }}
                    />
                    <Circle
                        cx={72.35}
                        cy={72.35}
                        r={70.85}
                        style={{
                            fill: '#fff',
                            stroke: '#85e3ff',
                            strokeMiterlimit: 10,
                            strokeWidth: 3,
                        }}
                    />
                    <Text x="45%" y="45%" textAnchor="middle" dy=".3em" fontSize={20} fill="#85e3ff" fontWeight={800}>
                        {name}
                    </Text>
                </G>
            </G>
        </Svg>
    );
};

export default Level3JoyQ;
