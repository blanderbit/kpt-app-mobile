import appleAuth, {appleAuthAndroid,} from '@invertase/react-native-apple-authentication';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import 'react-native-get-random-values';
import {v4 as uuid} from 'uuid';

export const signInGoogle = async (): Promise<string> => {
    try {
        await GoogleSignin.hasPlayServices({
            showPlayServicesUpdateDialog: true,
        });

        const { data } = await GoogleSignin.signIn();

        if (!data?.idToken) {
            throw new Error('Google Sign-In failed - no idToken returned');
        }

        const googleCredential = auth.GoogleAuthProvider.credential(data.idToken);
        const {user} = await auth().signInWithCredential(googleCredential);

        const token = await user.getIdToken();
        if (!token) {
            throw new Error('Failed to get Firebase ID token from Google');
        }

        return token;
    } catch (error: any) {
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
        // Проверяем доступность Apple Sign-In
        const isAvailable = await appleAuth.isSupported();
        if (!isAvailable) {
            throw new Error('Apple Sign-In is not available on this device');
        }

        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
        });

        console.log('Apple Auth Response:', appleAuthRequestResponse);

        if (!appleAuthRequestResponse.identityToken) {
            throw new Error('Apple Sign-In failed - no identity token returned');
        }

        // Create a Firebase credential from the response
        const {identityToken, nonce} = appleAuthRequestResponse;
        
        if (!identityToken) {
            throw new Error('Apple Sign-In failed - identityToken is null');
        }

        const appleCredential = auth.AppleAuthProvider.credential(
            identityToken,
            nonce,
        );

        console.log('Apple Credential created');

        const {user} = await auth().signInWithCredential(appleCredential);

        console.log('Firebase user signed in:', user.uid);

        const token = await user.getIdToken();
        if (!token) {
            throw new Error('Failed to get Firebase ID token from Apple');
        }

        console.log('Firebase ID token obtained');
        return token;
    } catch (e: any) {
        console.error('Apple Sign-In iOS error:', e);
        // Если пользователь отменил авторизацию, пробрасываем специальную ошибку
        if (e?.code === appleAuth.Error.CANCELED || e?.code === '1001') {
            throw new Error('Apple Sign-In was canceled by user');
        }
        throw e;
    }
};

export const signInAppleAndroid = async (): Promise<string> => {
    try {
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

        console.log('Apple Auth Android configured');

        // Open the browser window for user sign in
        const response = await appleAuthAndroid.signIn();
        console.log('Apple Auth Android response:', response);

        const {id_token: identityToken, nonce} = response;

        if (!identityToken) {
            throw new Error('Apple Sign-In Android failed - no identity token returned');
        }

        const appleCredential = auth.AppleAuthProvider.credential(
            identityToken as string,
            nonce,
        );

        console.log('Apple Credential created for Android');

        const {user} = await auth().signInWithCredential(appleCredential);
        console.log('Firebase user signed in (Android):', user.uid);

        const firebaseToken = await user.getIdToken();
        if (!firebaseToken) {
            throw new Error('Failed to get Firebase ID token from Apple (Android)');
        }

        console.log('Firebase ID token obtained (Android)');
        return firebaseToken;
    } catch (e: any) {
        console.error('Apple Sign-In Android error:', e);
        throw e;
    }
};
