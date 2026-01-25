// utils/user.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_KEY = "user_data";

export type StoredUser = {
  id: string;
  first: string;
  last: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
};

export const setUserData = async (user: StoredUser) => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    return true;
  } catch (error) {
    console.error("Error setting user data:", error);
    return false;
  }
};

export const getUserData = async (): Promise<StoredUser | null> => {
  try {
    const data = await AsyncStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
};

export const removeUserData = async () => {
  await AsyncStorage.removeItem(USER_KEY);
};
