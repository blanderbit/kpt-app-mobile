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

        const googleCredential = auth.GoogleAuthProvider.credential(data.idToken);
        const {user} = await auth().signInWithCredential(googleCredential);

        return await user.getIdToken();
    } catch (error) {
        console.log(error)
    }
};

export const logoutGoogle = async () => {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
};

export const signInAppleIos = async (): Promise<string> => {
    console.log('signInAppleIos called');
    try {
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
        });

        if (!appleAuthRequestResponse.identityToken) {
            throw new Error('Apple Sign-In failed - no identify token returned');
        }

        console.log(appleAuthRequestResponse)

        // Create a Firebase credential from the response
        const {identityToken, nonce} = appleAuthRequestResponse;
        const appleCredential = auth.AppleAuthProvider.credential(
            identityToken,
            nonce,
        );

        console.log(appleCredential)

        const {user} = await auth().signInWithCredential(appleCredential);

        console.log(user)

        return await user.getIdToken();
    } catch (e) {
        console.log(e)
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
