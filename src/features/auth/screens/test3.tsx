// App.tsx
import React, { useEffect, useState } from "react";
import {Button, View, Text, Alert, Linking} from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { initializeApp } from "firebase/app";
import {
    //@ts-ignore
    getReactNativePersistence,
    initializeAuth,
    signInWithCredential,
    GoogleAuthProvider,
    onAuthStateChanged, getAuth,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firebase from "firebase/compat";
import Auth = firebase.auth.Auth;

// Нужно для iOS, чтобы корректно закрывалась вкладка браузера после входа
// WebBrowser.maybeCompleteAuthSession();
WebBrowser.maybeCompleteAuthSession();

// ==== Firebase web config (из Firebase Console → Web app) ====
const firebaseConfig = {
    apiKey: "AIzaSyAlJfhzz4VMGQvN6nVZeW8vJBUyXIJN5LM",
    authDomain: "kpt-app-6ab7a.firebaseapp.com",
    projectId: "kpt-app-6ab7a",
    storageBucket: "kpt-app-6ab7a.firebasestorage.app",
    messagingSenderId: "78984716511",
    appId: "1:78984716511:web:38e88092981c38ead5496a",
    measurementId: "G-M11SFXPEBG"
};

const app = initializeApp(firebaseConfig);
// const auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) })

let auth: Auth;
try {
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
    });
} catch {
    // Если initializeAuth уже вызывался (hot reload/fast refresh)
    auth = getAuth(app);
}

const redirectUri =
    process.env.NODE_ENV === 'development'
        ? 'https://localhost:19006/redirect'  // This is for local web development
        : AuthSession.makeRedirectUri({ scheme: 'my-scheme', path: 'redirect' });  // Expo Go or production builds

// console.log(Linking.createURL() + '/--/')

export default function GoogleSignInButton() {
    // Настройка для iOS симулятора с Expo Go
    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: "78984716511-4fdfc5l4afgtag2hsbn3puvllmfc1v4h.apps.googleusercontent.com",
        iosClientId: '78984716511-v1qg9hahti25vjvgmi72bcbov49fkcql.apps.googleusercontent.com',
        // androidClientId: '78984716511-6u49n9quctr938qbdph6ffo4hi4redeb.apps.googleusercontent.com',
        clientId: "78984716511-4fdfc5l4afgtag2hsbn3puvllmfc1v4h.apps.googleusercontent.com",
        // webClientId: "1015243991043-knrfog6fsga3u7pt8vstln4jbojfae77.apps.googleusercontent.com",
        // clientId: "1015243991043-knrfog6fsga3u7pt8vstln4jbojfae77.apps.googleusercontent.com",
        // iosClientId: "1015243991043-tf5f0n2gsv8c8t28635v9rhv7j7rsg6a.apps.googleusercontent.com",
        // androidClientId: '1015243991043-qecjkbib04vpdh8ra0455mojffg1iqva.apps.googleusercontent.com',
        responseType: "id_token",
        scopes: ['profile', 'email'],
        // Переключаемся между прокси и прямым редиректом
        // redirectUri: 'https://auth.expo.io/@wexis/KptApp/redirect'
        // redirectUri: 'https://auth.expo.io/@wexis/KptApp'
        // redirectUri: 'exp://192.168.0.102:8081/redirect'
    },
        {
            scheme: 'test'
        }
        // {
        // projectNameForProxy: "@wexis/KptApp",
        // native: "com.my.schema",
    // }
    );

    // {path: 'https://auth.expo.io/@wexis/KptApp', scheme: 'https://', native: ''})


    useEffect(() => {
        console.log('response', response);

        const doLogin = async () => {
            console.log('🔄 Google Auth Response:', response);

            if (response?.type === "success") {
                console.log('✅ Google Auth Success');
                const idToken = response.params.id_token;

                if (!idToken) {
                    console.error('❌ No ID token received');
                    return;
                }

                try {
                    console.log('🔐 Signing in with Firebase...');
                    const cred = GoogleAuthProvider.credential(idToken);
                    const userCredential = await signInWithCredential(auth, cred);
                    console.log('✅ Firebase Sign-In Success:', userCredential.user.email);
                } catch (error) {
                    console.error('❌ Firebase Sign-In Error:', error);
                }
            } else if (response?.type === "error") {
                console.error('❌ Google Auth Error:', response.error);
            } else if (response?.type === "cancel") {
                console.log('🚫 Google Auth Cancelled');
            }
        };

        if (response) {
            doLogin();
        }
    }, [response]);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("✅ User signed in:", user.email);
                Alert.alert('Success', `Welcome ${user.email}!`);
            } else {
                console.log("👤 User signed out");
            }
        });
        return () => unsub();
    }, []);

    const handleGoogleSignIn = async () => {
        try {
            console.log('🚀 Starting Google Sign-In...');
            await promptAsync();
            console.log('test')
        } catch (error) {
            console.error('❌ Google Sign-In Error:', error);
            Alert.alert('Error', 'Failed to start Google Sign-In');
        }
    };

    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12 }}>
            <Button
                title={"Войти через Google"}
                onPress={handleGoogleSignIn}
            />
        </View>
    );
}
