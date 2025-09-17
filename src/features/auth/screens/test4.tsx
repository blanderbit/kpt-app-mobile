import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth'; // если используешь firebase

// Настройка
GoogleSignin.configure({
    webClientId: 'WEB_CLIENT_ID.apps.googleusercontent.com', // из Firebase
});

const signInWithGoogle = async () => {
    try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        const { idToken } = userInfo;
        const credential = auth.GoogleAuthProvider.credential(idToken);
        await auth().signInWithCredential(credential);
        console.log('User signed in!');
    } catch (error) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            console.log('Sign in cancelled');
        } else {
            console.error(error);
        }
    }
};
