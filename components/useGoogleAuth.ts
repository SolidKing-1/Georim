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
  const redirectUri = AuthSession.makeRedirectUri();
  console.log("Redirect URI:", redirectUri);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GOOGLE_CLIENT_ID,
      redirectUri,
      responseType: "token", // <--- get access token directly
      scopes: [
        "openid",
        "profile",
        "email",
        "https://www.googleapis.com/auth/calendar",
      ],
      usePKCE: false, // <--- PKCE not used for implicit flow
    },
    discovery
  );

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
