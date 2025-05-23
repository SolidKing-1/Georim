import "dotenv/config";

export default {
  expo: {
    slug: "georim-app",
    // ...other config...
    ios: {
      bundleIdentifier: "com.yourcompany.georimapp", // <-- set this!
    },
    android: {
      package: "com.yourcompany.georimapp", // <-- set this!
    },
    extra: {
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      BACKEND_URL: process.env.BACKEND_URL,
    },
  },
};
