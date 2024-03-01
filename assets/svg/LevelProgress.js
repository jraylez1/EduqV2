import * as React from 'react';
import Svg, { G, Path, Image, Text, Polygon } from 'react-native-svg';
import { useTranslation } from 'react-i18next';

const LevelProgress = (props) => {
    const { svgWidth, svgHeight, Level } = props;
    const { t } = useTranslation();
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 83.21 96.08"
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
                        <Polygon
                            style={{
                                fill: '#79bc99',
                            }}
                            points="83.21 72.06 41.6 96.08 0 72.06 0 24.02 41.6 0 83.21 24.02 83.21 72.06"
                        />
                        <Image
                            style={{
                                opacity: 0.58,
                                mixBlendMode: 'multiply',
                            }}
                            width="76"
                            height="67"
                            transform="translate(5.32 23.46)"
                            xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEwAAABDCAYAAAA2weP+AAAACXBIWXMAAAsSAAALEgHS3X78AAAE30lEQVR4Xu2cW3PaSBBGjxxfEhtvcJy1ney+bO3//0tbtZck+B5sfAECsw/dzQyKBBqMHEWer2pKWEKYOdU9/WH3kDnnSKquzaKTWZZl9rDo+guQA3AF0ZSF5xSUjQ0d9vNLkNMx1eEQbjNIM2AKawN4hUTeth5f4cG1WQZqAnwDRnqcAFODFqZkhsDZBnaBjh4NXJsjzSLLQN0DAz2OgusCLEjFTQRSFzgCDhBw2wjMNgObIHAGwDVwptemwCTLssw558IIs+jqAMfAn8BH4B2wh4+yNsqi6w64Aj4jcw1Tcwo+JYsi7CPwB3AC7CMw2wxsBNwCPT13iUTaDZ6PK1vDOkhknQC/AW/1/Abt1BQB1tef+5QsRXlgG3puB0nDfQRWV8+1GdhQH98gc99BWMw5hLxxDf3XJrCFUN6h/cBA5rqFB/WdnSp0+nxvXsPRVoVzLLVQbQZQixKwSCVgkUrAIpWARSoBi1QCFqkELFIJWKQSsEglYJFKwCKVgEUqAYtUAhapBCxSCVikErBIJWCRSsAilYBFKgGLVAIWqQQsUglYpBKwSCVgkSoD5nLjpWjpvPPAwg7iiY65jmLaqWXznikEFnYRj4FH4EGPQ3zbYpug5ec8xM93jAc3m3PY7mQ3WxdxH2lZ7OLbNV/jW9F/5q7qsB9/ggAaIHP+qkfroC4EZi8wRqLqK3CK722d6rVfgDf4VsaFvVQNVLg+hVF1iwRHD/iCdFD3ERbj4J65CLMXGAAXwN/4Ztk7Hb8iLZwdpCNxi/loayq4IlCWSbdI5/Qp8A/wlx4vEBaWmoACc865LMsswu6RDuIMoX+HD9NbBNo7JPps40NTwS0CZfO6RGB9RkD9i0TalT5vDH77TH4Ns3y2/H7UF+4jzbJ94APSx3+IrG97NA9cFVC2ecFgWTqe6/UBwmJC0aKvUTbFV0MrAI96843+knOkh/8Yv1ukSeDyla8M1Bl+vTpFIuoayaIHPKzZPiPINQUH0BzeSpjFsHy/RPL7CIm2I5aDs+JQp8KI+oa8f9szVAbqTM9bRN3j5z2B+Z1swPz2v7kLfv+R7W7bwW/a6iKADFYRONvcZf3udVmRvEUYIRFilc8W9DJQd3gLMfNeRXslYQGw2RPmtwVa3/4uEkll4I6RwnCAFIc6rEiZRTA/dYGsSz1kjTJoi0A5CqIq1FJgQH7j6TJwx8gad6LjPeu1IlUswjnwCfgPiapTZClZGZSpEjBTRXCHCLQPwO/IXqV1WJEqlc8swhcE1icE3hUCc2VQprKdIIXSF3YKruyNm/241uM6rEjVyhdahB6Sln28RVgZlCkKmGkJuAd8ejzFisx+HXGVr8gijAg+SK8CyrQSMFMBOPNxT7UiVhgMVmzlq2QRVlHUGrZMa7Iib/DQDJZ92lil8pVahFW0VmCmJ1iRA6Si7ur99tnW0rqWyhejWoBB5YqatyJHSEXd13uGyDp4To2VL0a1ATNVBGdWxOB1kZS2v831kIiqpfLFqHZgpiXg9pFoO9TxFknJByTCLqmx8sXo2YCZSsDZHvMOAm9Pr4cO3taptVe+GD07MFMAzorDto7X+P8h2PdGDKmx8sXohwEzFYCzv2zA/L+9nm2dWqQfDsyUS1Vz+i4YhV9P9dxqDDCTgpupCZBCNQ5Y0/U/9ArtpudgvDkAAAAASUVORK5CYII="
                        />
                        <Polygon
                            style={{
                                fill: '#fff',
                            }}
                            points="73.14 66.43 41.41 83.59 9.69 66.43 9.69 29.58 73.14 29.58 73.14 66.43"
                        />
                        <Text
                            x="45%"
                            y="52%"
                            style={{
                                textAnchor: 'middle',
                                fontSize: '20',
                                fontWeight: 'bold',
                                fontFamily: "'Crimson Text'",
                                fill: '#79bc99',
                            }}
                        >
                            {Level}
                        </Text>
                        <Text
                            x="43%"
                            y="72%"
                            style={{
                                textAnchor: 'middle',
                                fontSize: '14',
                                fontWeight: 'bold',
                                fontFamily: "'Crimson Text'",
                                fill: '#79bc99',
                            }}
                        >
                            {t('Level')}
                        </Text>
                    </G>
                </G>
            </G>
        </Svg>
    );
};
export default LevelProgress;
