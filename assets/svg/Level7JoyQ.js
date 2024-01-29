import Svg, { G, Path, Circle, Text } from 'react-native-svg';
import React from 'react';

const Level7JoyQ = (props) => {
    const { name } = props;

    return (
        <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 144.73 179.11" {...props} width={140} height={140}>
            <G data-name="Layer 2">
                <G data-name="Layer 1">
                    <Path
                        d="m111.39 179.11 6.21-46.14 6.21-46.14-43.06 17.69-43.06 17.68 36.85 28.46 36.85 28.45z"
                        style={{
                            fill: '#acaf31',
                        }}
                    />
                    <Circle
                        cx={72.37}
                        cy={72.37}
                        r={70.85}
                        style={{
                            fill: '#fff',
                            stroke: '#acaf31',
                            strokeMiterlimit: 10,
                            strokeWidth: 3,
                        }}
                    />
                    <Text x="40%" y="40%" textAnchor="middle" dy=".3em" fontSize={20} fill="#acaf31" fontWeight={800}>
                        {name}
                    </Text>
                </G>
            </G>
        </Svg>
    );
};

export default Level7JoyQ;
