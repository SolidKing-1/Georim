import "dotenv/config";

export default {
  expo: {
    slug: "georim-app",

    ios: {
      bundleIdentifier: "com.yourcompany.georimapp",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },

    android: {
      package: "com.yourcompany.georimapp",
    },

    plugins: ["expo-secure-store", "expo-web-browser"],

    extra: {
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      BACKEND_URL: process.env.BACKEND_URL,
      eas: {
        projectId: "2bd07bef-b542-48da-aaef-ea9dec3f92bb",
      },
    },

    scheme: "georim",
  },
};
