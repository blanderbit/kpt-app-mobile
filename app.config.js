// app.config.js - читает .env файл и экспортирует конфигурацию для Expo
require("dotenv").config();

module.exports = {
  expo: {
    name: "Plesury",
    slug: "Plesury",
    owner: "wexis",
    originalFullName: "@wexis/Plesury",
    scheme: "plesury",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/plesury-icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "app.plesury",
      buildNumber: "5",
      googleServicesFile: "./GoogleService-Info.plist",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      package: "app.plesury",
      googleServicesFile: "./google-services.json",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: [
      "expo-localization",
      "@react-native-firebase/app",
      "@react-native-firebase/auth",
      [
        "expo-dev-client",
        {
          launchMode: "most-recent",
        },
      ],
      [
        "expo-build-properties",
        {
          ios: {
            useFrameworks: "static",
            deploymentTarget: "16.0",
          },
        },
      ],
      [
        "react-native-appsflyer",
        {
          shouldUseStrictMode: false,
          shouldUsePurchaseConnector: true,
        },
      ],
    ],
    extra: {
      eas: {
        projectId: "6e7f5b27-54a8-4c35-820a-2b4230b47e83",
      },
      // Экспортируем env переменные для использования в приложении
      revenueCatIosApiKey: process.env.REVENUECAT_IOS_API_KEY,
      revenueCatAndroidApiKey: process.env.REVENUECAT_ANDROID_API_KEY,
      revenueCatTestStoreApiKey: process.env.REVENUECAT_TEST_STORE_API_KEY,
    },
  },
};
