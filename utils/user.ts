// Description: Utility functions for user authentication and storage management in a React Native application.
// utils/user.ts
import AsyncStorage from "@react-native-async-storage/async-storage";


const USER_KEY = "user_data";

export const setUserData = async (userData: object) => {
    try {
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
        return true;
    } catch (error) {
        console.error("Error Setting User Data:", error);
        return false;
    }
}; 

export const getUserData = async () => {
    try {
        const userData = await AsyncStorage.getItem(USER_KEY);
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error("Error Getting User Data:", error);
        return null;
    }
}