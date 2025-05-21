import "dotenv/config";

export default {
  expo: {
    // ...other config...
    extra: {
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      BACKEND_URL: process.env.BACKEND_URL,
    },
  },
};
