// import React from "react";
// import { Button } from "react-native";
// import { getAuth, signInWithPopup, signInWithRedirect } from "firebase/auth";
// import { initializeApp } from "firebase/app";
//
// // Firebase инициализация
// const firebaseConfig = {
//     apiKey: "AIzaSyAlJfhzz4VMGQvN6nVZeW8vJBUyXIJN5LM",
//     authDomain: "kpt-app-6ab7a.firebaseapp.com",
//     projectId: "kpt-app-6ab7a",
//     storageBucket: "kpt-app-6ab7a.firebasestorage.app",
//     messagingSenderId: "78984716511",
//     appId: "1:78984716511:web:38e88092981c38ead5496a",
//     measurementId: "G-M11SFXPEBG"
// };
// const app = initializeApp(firebaseConfig);
//
// import { GoogleAuthProvider } from "firebase/auth";
//
// const provider = new GoogleAuthProvider();
//
// const auth = getAuth();
//
// // Конфигурация для Android
// const ANDROID_CLIENT_ID = "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com";
//
// export default function GoogleSignInButton() {
//     const onSignInWithPopup = () => {
//         // signInWithPopup(auth, provider)
//         //     .then((result) => {
//         //         // This gives you a Google Access Token. You can use it to access the Google API.
//         //         const credential = GoogleAuthProvider.credentialFromResult(result);
//         //         const token = credential.accessToken;
//         //         // The signed-in user info.
//         //         const user = result.user;
//         //         // IdP data available using getAdditionalUserInfo(result)
//         //         // ...
//         //     }).catch((error) => {
//         //     // Handle Errors here.
//         //     const errorCode = error.code;
//         //     const errorMessage = error.message;
//         //     // The email of the user's account used.
//         //     const email = error.customData.email;
//         //     // The AuthCredential type that was used.
//         //     const credential = GoogleAuthProvider.credentialFromError(error);
//         //     // ...
//         // });
//         signInWithRedirect(auth, provider);
//     }
//
//     return (
//         <Button
//             title="Sign in with Google"
//             onPress={() => onSignInWithPopup()}
//         />
//     );
// }
