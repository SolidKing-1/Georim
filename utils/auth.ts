// utils/auth.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "jwt";
const BIOMETRIC_KEY = "biometric_enabled";

export const getToken = async () => {
  return await AsyncStorage.getItem(TOKEN_KEY);
};

export const setToken = async (token: string) => {
  await AsyncStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = async () => {
  await AsyncStorage.removeItem(TOKEN_KEY);
};

export const setBiometricEnabled = async (enabled: boolean) => {
  await SecureStore.setItemAsync(BIOMETRIC_KEY, enabled ? "true" : "false");
};

export const isBiometricEnabled = async () => {
  const value = await SecureStore.getItemAsync(BIOMETRIC_KEY);
  return value === "true";
};
