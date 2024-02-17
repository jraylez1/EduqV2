build app expo: 
1. npm install -g eas-cli
2. eas login
3. eas build:configure
4. eas build -p android --profile preview (eas build --platform android)

build app RN cli: 

1. chạy cmd bằng administrator (C:\Program Files\Java\jdk-17>bin)
2. keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
3. nhập password, re-password, dòng cuối gõ yes rồi enter
4. trong thư mục bin sẽ có 1 file my-upload-key.keystore
5. copy file my-upload-key.keystore vào thư mục dự án D:\_Web_PJ\Project\EduqV2\android\app
6. thiết lập trong file android/gradle.properties:

MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=123456
MYAPP_UPLOAD_KEY_PASSWORD=123456

7. vào file android/app/build/build.gralde điền vào phần signingConfigs

 release {
    if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
        storeFile file(MYAPP_UPLOAD_STORE_FILE)
        storePassword MYAPP_UPLOAD_STORE_PASSWORD
        keyAlias MYAPP_UPLOAD_KEY_ALIAS
        keyPassword MYAPP_UPLOAD_KEY_PASSWORD
    }
}

phần buildTypes:

release {
    signingConfig signingConfigs.debug
}

8. cd android && ./gradlew assembleRelease