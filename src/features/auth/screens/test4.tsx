// import React, { useEffect } from "react";
// import { Button, View, Alert } from "react-native";
// import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
// import { auth, GoogleAuthProvider, signInWithCredential } from "../../../../firebase";
// import {signinGoogle} from "@features/auth/screens/test5";
//
// export default function GoogleSignInButton() {
//
//     useEffect(() => {
//         GoogleSignin.configure({
//             webClientId: "78984716511-4fdfc5l4afgtag2hsbn3puvllmfc1v4h.apps.googleusercontent.com", // из Firebase → Project settings → Web client ID
//             iosClientId: '78984716511-v1qg9hahti25vjvgmi72bcbov49fkcql.apps.googleusercontent.com'
//         });
//     }, []);
//
//     const handleGoogleSignIn = async () => {
//         try {
//             await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
//             const userInfo = await GoogleSignin.signIn();
//             const { idToken } = userInfo;
//
//             if (!idToken) throw new Error("No ID token!");
//
//             // Создаём Firebase credential
//             const credential = GoogleAuthProvider.credential(idToken);
//
//             // Авторизация в Firebase
//             const userCredential = await signInWithCredential(auth, credential);
//
//             Alert.alert("Success", `Welcome ${userCredential.user.email}!`);
//             console.log("Signed in user:", userCredential.user.email);
//
//         } catch (error: any) {
//             if (error.code === statusCodes.SIGN_IN_CANCELLED) {
//                 console.log("Sign in cancelled");
//             } else if (error.code === statusCodes.IN_PROGRESS) {
//                 console.log("Sign in in progress");
//             } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
//                 console.log("Play Services not available");
//             } else {
//                 console.error("Google Sign-In error:", error);
//             }
//         }
//     };
//
//     return (
//         <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//             <Button title="Sign in with Google" onPress={signinGoogle} />
//         </View>
//     );
// }
