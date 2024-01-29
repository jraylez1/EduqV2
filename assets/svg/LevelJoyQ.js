import React from 'react';
import Svg, { Defs, G, Path, Circle, Text } from 'react-native-svg';

const LevelJoyQ = (props) => {
    const { name } = props;
    return (
        <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 144.7 187.58" {...props} width={140} height={140}>
            <G data-name="Layer 2">
                <G data-name="Layer 1">
                    <Path
                        d="m89.7 187.58-31.41-34.37-31.41-34.36 45.47-10.02 45.46-10.02-14.05 44.39-14.06 44.38z"
                        style={{
                            fill: '#f9a0a0',
                        }}
                    />
                    <Circle
                        cx={72.35}
                        cy={72.35}
                        r={70.85}
                        style={{
                            fill: '#fff',
                            stroke: '#f9a0a0',
                            strokeMiterlimit: 10,
                            strokeWidth: 3,
                        }}
                    />
                    <Text x="40%" y="40%" textAnchor="middle" dy=".3em" fontSize={20} fill="#f9a0a0" fontWeight={800}>
                        {name}
                    </Text>
                </G>
            </G>
        </Svg>
    );
};

export default LevelJoyQ;
