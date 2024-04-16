build app expo: 
1. npm install -g eas-cli
2. eas login
3. eas build:configure
4. eas build -p android --profile preview (eas build --platform android)

build app RN cli: 

1. chạy cmd bằng administrator (C:\Program Files\Java\jdk-17>bin)
2. keytool -genkeypair -v -storetype PKCS12 -keystore eduq.keystore -alias eduq -keyalg RSA -keysize 2048 -validity 10000
3. nhập password, re-password, dòng cuối gõ yes rồi enter
4. trong thư mục bin sẽ có 1 file my-upload-key.keystore
5. copy file my-upload-key.keystore vào thư mục dự án D:\_Web_PJ\Project\EduqV2\android\app
6. thiết lập trong file android/gradle.properties:

EDUQ_UPLOAD_STORE_FILE=eduq.keystore
EDUQ_UPLOAD_KEY_ALIAS=eduq
EDUQ_UPLOAD_STORE_PASSWORD=Abc123@@
EDUQ_UPLOAD_KEY_PASSWORD=Abc123@@

7. vào file android/app/src/build.gralde điền vào phần signingConfigs

 release {
    if (project.hasProperty('EDUQ_UPLOAD_STORE_FILE')) {
        storeFile file(EDUQ_UPLOAD_STORE_FILE)
        storePassword EDUQ_UPLOAD_STORE_PASSWORD
        keyAlias EDUQ_UPLOAD_KEY_ALIAS
        keyPassword EDUQ_UPLOAD_KEY_PASSWORD
    }
}

phần buildTypes:

release {
    signingConfig signingConfigs.release
}

8. cd android && ./gradlew bundleRelease