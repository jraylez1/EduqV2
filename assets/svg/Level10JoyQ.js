import Svg, { G, Path, Circle, Text } from 'react-native-svg';
import React from 'react';

const Level10JoyQ = (props) => {
    const { name } = props;

    return (
        <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 144.72 183.5" {...props} width={140} height={140}>
            <G data-name="Layer 2">
                <G data-name="Layer 1">
                    <Path
                        d="m37.33 0 36.36 29.07 36.36 29.07L66.69 75.1 23.34 92.05l6.99-46.02 7-46.03z"
                        style={{
                            fill: '#c8d85a',
                        }}
                    />
                    <Circle
                        cx={72.36}
                        cy={111.14}
                        r={70.85}
                        style={{
                            fill: '#fff',
                            stroke: '#c8d85a',
                            strokeMiterlimit: 10,
                            strokeWidth: 3,
                        }}
                    />
                    <Text x="40%" y="60%" textAnchor="middle" dy=".3em" fontSize={20} fill="#c8d85a" fontWeight={800}>
                        {name}
                    </Text>
                </G>
            </G>
        </Svg>
    );
};

export default Level10JoyQ;
