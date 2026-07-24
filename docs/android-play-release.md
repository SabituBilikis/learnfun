# Android and Google Play release

## One-time setup

1. Choose a final, unique Android application ID before creating the Google Play listing. Update `appId` in `capacitor.config.ts`, then run `npx cap sync android`.
2. Install Android Studio, the Android SDK, and JDK 21. Capacitor 8 requires Java 21; set Android Studio's Gradle JDK and `JAVA_HOME` to that JDK before building. Open the project with `npm run cap:android`.
3. Create a Google Play Console developer account and a new app with the package ID chosen above.
4. Host `public/privacy.html` at the public privacy-policy URL and replace its contact placeholder with a real publisher email.
5. Create a release key, store it securely outside the repository, then either copy `android/keystore.properties.example` to `android/keystore.properties` and replace its values, or provide `LEARNFUN_KEYSTORE_FILE`, `LEARNFUN_KEYSTORE_PASSWORD`, `LEARNFUN_KEY_ALIAS`, and `LEARNFUN_KEY_PASSWORD` as environment variables. A suitable command is:

```bash
keytool -genkeypair -v -keystore learnfun-release.keystore -alias learnfun -keyalg RSA -keysize 2048 -validity 10000
```

## Build commands

```bash
npm run cap:sync
npm run cap:android:debug
npm run cap:android:release
```

`cap:android:release` produces an Android App Bundle at `android/app/build/outputs/bundle/release/app-release.aab` after the signing properties are configured. The release build deliberately fails until signing is set up. Keep the keystore and its passwords outside the repository.

## Play Console checklist

- Upload the signed `.aab` to Internal testing first and test on a real Android phone.
- Complete the store listing with icon, screenshots, feature graphic, support email, category, and age rating.
- Use the public privacy-policy URL and complete the Data safety form to match the app: no personal data collected or shared; profiles and progress remain on-device.
- Declare the app's child audience accurately and complete Google Play's Families Policy requirements before production rollout.
- Increment `versionCode` and `versionName` in `android/app/build.gradle` for every later Play upload.
