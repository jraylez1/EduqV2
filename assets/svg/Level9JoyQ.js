import Svg, { G, Path, Circle, Text } from 'react-native-svg';
import React from 'react';

const Level9JoyQ = (props) => {
    const { name } = props;

    return (
        <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 144.7 165.91" {...props} width={120} height={120}>
            <G data-name="Layer 2">
                <G data-name="Layer 1">
                    <Path
                        d="m141.81 165.91-2.22-46.5-2.21-46.5-39.16 25.17-39.17 25.17 41.38 21.33 41.38 21.33z"
                        style={{
                            fill: '#d63b03',
                        }}
                    />
                    <Circle
                        cx={72.35}
                        cy={72.35}
                        r={70.85}
                        style={{
                            fill: '#fff',
                            stroke: '#d63b03',
                            strokeMiterlimit: 10,
                            strokeWidth: 3,
                        }}
                    />

                    <Text x="45%" y="45%" textAnchor="middle" dy=".3em" fontSize={20} fill="#d63b03" fontWeight={800}>
                        {name}
                    </Text>
                </G>
            </G>
        </Svg>
    );
};

export default Level9JoyQ;
