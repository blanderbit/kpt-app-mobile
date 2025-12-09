import appleAuth, {appleAuthAndroid,} from '@invertase/react-native-apple-authentication';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {Platform} from 'react-native';
import 'react-native-get-random-values';
import {v4 as uuid} from 'uuid';
import * as Crypto from 'expo-crypto';

// Web Client ID для Google Sign In (OAuth 2.0 Client ID типа "Web application" из Firebase Console)
// Для iOS и Android используется один и тот же Web Client ID
// Это должен быть Client ID типа "Web application", а не iOS или Android client
const WEB_CLIENT_ID = '78984716511-4fdfc5l4afgtag2hsbn3puvllmfc1v4h.apps.googleusercontent.com';

// Инициализация Google Sign In (должна быть вызвана один раз при запуске приложения)
export const configureGoogleSignIn = async () => {
    try {
        const config: any = {
            webClientId: WEB_CLIENT_ID,
            offlineAccess: true,
        };

        // Для iOS может потребоваться iosClientId
        if (Platform.OS === 'ios') {
            // iOS Client ID из GoogleService-Info.plist (CLIENT_ID)
            config.iosClientId = '78984716511-s4bgot52hv0f0njf3f9ltn1ka9ro8v9o.apps.googleusercontent.com';
        }

        await GoogleSignin.configure(config);
        console.log('Google Sign In configured successfully');
    } catch (error) {
        console.error('Failed to configure Google Sign In:', error);
        throw error;
    }
};

export const signInGoogle = async (): Promise<string> => {
    try {
        // Убеждаемся, что Google Sign In сконфигурирован
        await configureGoogleSignIn();

        if (Platform.OS === 'android') {
            await GoogleSignin.hasPlayServices({
                showPlayServicesUpdateDialog: true,
            });
        }

        const response = await GoogleSignin.signIn();
        
        // Логируем ответ для отладки
        console.log('Google Sign-In response:', JSON.stringify(response, null, 2));

        // В зависимости от версии библиотеки, idToken может быть в разных местах
        const idToken = response.data?.idToken || response.idToken;

        if (!idToken) {
            console.error('Google Sign-In response structure:', response);
            throw new Error('Google Sign-In failed - no ID token returned. Response: ' + JSON.stringify(response));
        }

        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        const {user} = await auth().signInWithCredential(googleCredential);

        return await user.getIdToken();
    } catch (error) {
        console.error('Google Sign-In error:', error);
        throw error;
    }
};

export const logoutGoogle = async () => {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
};

export const signInAppleIos = async (): Promise<string> => {
    console.log('signInAppleIos called');
    try {
        // Generate a random nonce (raw nonce)
        // According to @invertase/react-native-apple-authentication docs,
        // the library may hash the nonce automatically if we pass raw nonce
        const rawNonce = uuid();
        console.log('Raw nonce generated:', rawNonce);

        // Pass raw nonce to the library - it should hash it automatically
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
            nonce: rawNonce,
        });

        if (!appleAuthRequestResponse.identityToken) {
            throw new Error('Apple Sign-In failed - no identify token returned');
        }

        console.log('Apple auth response received');

        // Create a Firebase credential from the response
        // Use the same raw nonce that we passed to the library
        const {identityToken} = appleAuthRequestResponse;
        const appleCredential = auth.AppleAuthProvider.credential(
            identityToken,
            rawNonce,
        );

        console.log('Apple credential created with raw nonce');

        const {user} = await auth().signInWithCredential(appleCredential);

        console.log('Firebase user signed in:', user.uid);

        return await user.getIdToken();
    } catch (e) {
        console.error('Apple Sign-In error:', e);
        throw e;
    }
};

export const signInAppleAndroid = async (): Promise<string> => {
    const rawNonce = uuid();
    const state = uuid();

    // Configure the request
    appleAuthAndroid.configure({
        // The Service ID you registered with Apple
        clientId: 'com.codeska.service.gogym.',

        // Return URL added to your Apple dev console. We intercept this redirect, but it must still match
        // the URL you provided to Apple. It can be an empty route on your backend as it's never called.
        redirectUri: 'https://gogym-98053.firebaseapp.com/__/auth/handler',

        // The type of response requested - code, id_token, or both.
        responseType: appleAuthAndroid.ResponseType.ALL,

        // The amount of user information requested from Apple.
        scope: appleAuthAndroid.Scope.ALL,

        // Random nonce value that will be SHA256 hashed before sending to Apple.
        nonce: rawNonce,

        // Unique state value used to prevent CSRF attacks. A UUID will be generated if nothing is provided.
        state,
    });

    // Open the browser window for user sign in
    const {id_token: identityToken, nonce} = await appleAuthAndroid.signIn();
    const appleCredential = auth.AppleAuthProvider.credential(
        identityToken as string | null,
        nonce,
    );

    const {user} = await auth().signInWithCredential(appleCredential);
    const firebaseToken = await user.getIdToken();

    return firebaseToken;
};
