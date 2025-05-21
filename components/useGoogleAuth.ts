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
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GOOGLE_CLIENT_ID,
      redirectUri: AuthSession.makeRedirectUri(),
      responseType: "code",
      scopes: [
        "openid",
        "profile",
        "email",
        "https://www.googleapis.com/auth/calendar",
      ],
      usePKCE: true,
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      fetch(`${BACKEND_URL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
        .then((res) => res.json())
        .then((data) => {
          onSuccess(data);
        })
        .catch((err) => {
          console.error("Google OAuth error:", err);
        });
    }
  }, [response]);

  return { promptAsync, request };
}
