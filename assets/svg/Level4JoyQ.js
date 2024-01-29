import Svg, { G, Path, Circle, Text } from 'react-native-svg';
import React from 'react';

const Level4JoyQ = (props) => {
    const { name } = props;

    return (
        <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 154.92 154.58" {...props} width={120} height={120}>
            <G data-name="Layer 2">
                <G data-name="Layer 1">
                    <Path
                        d="m0 0 45.7 8.9 45.69 8.9-30.55 35.12-30.56 35.13-15.14-44.03L0 0z"
                        style={{
                            fill: '#7cbaf9',
                        }}
                    />
                    <Circle
                        cx={82.57}
                        cy={82.23}
                        r={70.85}
                        style={{
                            fill: '#fff',
                            stroke: '#7cbaf9',
                            strokeMiterlimit: 10,
                            strokeWidth: 3,
                        }}
                    />
                    <Text x="55%" y="55%" textAnchor="middle" dy=".3em" fontSize={20} fill="#7cbaf9" fontWeight={800}>
                        {name}
                    </Text>
                </G>
            </G>
        </Svg>
    );
};

export default Level4JoyQ;
