import * as React from 'react';
import Svg, { G, Path, Image, Text } from 'react-native-svg';
const HexagonSteamQ = (props) => {
    const { fillColor, svgWidth, svgHeight, number } = props;
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 65.95 76.16"
            width={svgWidth}
            height={svgHeight}
            {...props}
        >
            <G
                style={{
                    isolation: 'isolate',
                }}
            >
                <G id="Layer_2" data-name="Layer 2">
                    <G id="Layer_1-2" data-name="Layer 1">
                        <Path
                            d="M63.07 55.45 32.98 72.83 2.88 55.45V20.7l30.1-17.37L63.07 20.7v34.75z"
                            fill={fillColor}
                        />
                        <Path
                            d="M65.45 56.83 32.98 75.58.5 56.83v-37.5L32.98.58l32.47 18.75v37.5z"
                            stroke={fillColor}
                            style={{
                                fill: 'none',
                                strokeMiterlimit: 10,
                            }}
                        />

                        <Image
                            xlinkHref="data:image/png;base64,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"
                            width={50}
                            height={50}
                            style={{
                                opacity: 0.29,
                                mixBlendMode: 'multiply',
                            }}
                            transform="translate(12.97 16.97)"
                        />

                        <Path
                            d="M32.59 20.27a18.57 18.57 0 1 0 18.57 18.57 18.57 18.57 0 0 0-18.57-18.57Z"
                            style={{
                                fill: '#fff',
                            }}
                        />
                        <Text
                            x={svgWidth / 2.1}
                            y={svgHeight / 1.8}
                            fontSize={18}
                            fontWeight={700}
                            textAnchor="middle"
                            dy="0.3em"
                            fill={fillColor}
                        >
                            {number}
                        </Text>
                    </G>
                </G>
            </G>
        </Svg>
    );
};
export default HexagonSteamQ;
