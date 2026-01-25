// utils/auth.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "jwt_token";
const BIOMETRIC_KEY = "biometric_enabled";

/* ================= JWT ================= */

export const getToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem(TOKEN_KEY);
};

export const setToken = async (token: string) => {
  await AsyncStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = async () => {
  await AsyncStorage.removeItem(TOKEN_KEY);
};

/* ================= BIOMETRICS ================= */

export const setBiometricEnabled = async (enabled: boolean) => {
  await SecureStore.setItemAsync(BIOMETRIC_KEY, enabled ? "true" : "false");
};

export const isBiometricEnabled = async (): Promise<boolean> => {
  const value = await SecureStore.getItemAsync(BIOMETRIC_KEY);
  return value === "true";
};
