import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import Constants from "expo-constants";

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
};

const GOOGLE_CLIENT_ID = Constants.expoConfig?.extra?.GOOGLE_CLIENT_ID;
const BACKEND_URL = Constants.expoConfig?.extra?.BACKEND_URL;

export function useGoogleAuth(onSuccess: (data: any) => void) {
  // preferLocalhost: false ensures you get the Expo proxy URI for Expo Go
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: undefined,
  });
  // console.log("Redirect URI:", redirectUri);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId:
        "271076448072-79m89tq5nsnl8t8627gv97kehmt9a9uc.apps.googleusercontent.com",
      redirectUri: "https://auth.expo.io/@SolidKing/georim-app",
      responseType: "token",
      scopes: [
        "openid",
        "profile",
        "email",
        "https://www.googleapis.com/auth/calendar",
      ],
      usePKCE: false,
    },
    discovery
  );
  // console.log(BACKEND_URL);

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      if (authentication && authentication.accessToken) {
        fetch(`${BACKEND_URL}/api/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token: authentication.accessToken }),
        })
          .then((res) => res.json())
          .then((data) => onSuccess(data))
          .catch((err) => console.error("Google OAuth error:", err));
      } else {
        console.error("Authentication object or access token is missing.");
      }
    }
  }, [response]);

  return { promptAsync, request };
}
