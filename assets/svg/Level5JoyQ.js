import Svg, { G, Path, Circle, Text } from 'react-native-svg';
import React from 'react';

const Level5JoyQ = (props) => {
    const { name } = props;

    return (
        <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 144.73 188.64" {...props} width={140} height={140}>
            <G data-name="Layer 2">
                <G data-name="Layer 1">
                    <Path
                        d="M64.97 188.64 43.96 147.1l-21.01-41.55 46.48 2.58 46.48 2.58-25.47 38.97-25.47 38.96z"
                        style={{
                            fill: '#fe9bee',
                        }}
                    />
                    <Circle
                        cx={72.36}
                        cy={72.36}
                        r={70.85}
                        style={{
                            fill: '#fff',
                            stroke: '#fe9bee',
                            strokeMiterlimit: 10,
                            strokeWidth: 3,
                        }}
                    />
                    <Text x="40%" y="40%" textAnchor="middle" dy=".3em" fontSize={20} fill="#fe9bee" fontWeight={800}>
                        {name}
                    </Text>
                </G>
            </G>
        </Svg>
    );
};

export default Level5JoyQ;
