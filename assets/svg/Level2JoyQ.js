import Svg, { G, Path, Circle, Text } from 'react-native-svg';
import React from 'react';

const Level2JoyQ = (props) => {
    const { name } = props;

    return (
        <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 163.28 145.25" {...props} width={120} height={120}>
            <G data-name="Layer 2">
                <G data-name="Layer 1">
                    <Path
                        d="m163.28 0-13.94 44.42-13.93 44.42-31.5-34.28-31.5-34.28 45.43-10.14L163.28 0z"
                        style={{
                            fill: '#a69afe',
                        }}
                    />
                    <Circle
                        cx={72.36}
                        cy={72.89}
                        r={70.85}
                        style={{
                            fill: '#fff',
                            stroke: '#a69afe',
                            strokeMiterlimit: 10,
                            strokeWidth: 3,
                        }}
                    />
                    <Text x="45%" y="45%" textAnchor="middle" dy=".3em" fontSize={20} fill="#a69afe" fontWeight={800}>
                        {name}
                    </Text>
                </G>
            </G>
        </Svg>
    );
};

export default Level2JoyQ;
