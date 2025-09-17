import * as AppleAuthentication from "expo-apple-authentication";
import * as firebase from "firebase/app";
import "firebase/auth";

// Initialize Firebase (only once in your app)
const firebaseConfig = {
    apiKey: "AIzaSyAlJfhzz4VMGQvN6nVZeW8vJBUyXIJN5LM",
    authDomain: "kpt-app-6ab7a.firebaseapp.com",
    projectId: "kpt-app-6ab7a",
    storageBucket: "kpt-app-6ab7a.firebasestorage.app",
    messagingSenderId: "78984716511",
    appId: "1:78984716511:web:38e88092981c38ead5496a",
    measurementId: "G-M11SFXPEBG"
};

firebase.initializeApp(firebaseConfig);

export async function signInWithApple() {
    try {
        const credential = await AppleAuthentication.signInAsync({
            requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
            ],
        });

        const provider = new firebase.auth.OAuthProvider("apple.com");
        const authCredential = provider.credential({
            idToken: credential.identityToken,
        });

        return firebase.auth().signInWithCredential(authCredential);
    } catch (error) {
        if (error.code === "ERR_CANCELED") {
            console.log("User canceled Apple Sign-In");
        } else {
            console.error(error);
        }
    }
}
