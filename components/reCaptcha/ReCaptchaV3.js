import React from 'react';
import Recaptcha from 'react-native-recaptcha-that-works';
import { SiteKey } from '@env';

const ReCaptchaV3 = ({ recaptchaRef, onVerify }) => {
    const onExpire = () => {
        console.warn('expired!');
    };

    return (
        <Recaptcha
            ref={recaptchaRef}
            siteKey={SiteKey}
            baseUrl={`https://www.google.com/recaptcha/api.js?render=${SiteKey}`}
            onVerify={onVerify}
            onExpire={onExpire}
            size="invisible"
        />
    );
};

export default ReCaptchaV3;
