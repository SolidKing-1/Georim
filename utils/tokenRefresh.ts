import {getUserData, setUserData} from "./user";
import {getToken, setToken } from "./auth"; 

// Move this to a separate auth utility
export const handleTokenRefresh = async () => {
  try {
    const userData = await getUserData();
    if (!userData) throw new Error('No user data found');
    
    const response = await fetch(`${BACKEND_URL}/auth/biometric-auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userData.email,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || 'Authentication failed');
    }

    const data = await response.json();
    await setToken(data.data.token);
    await setUserData({
      email: data.data.email,
      name: data.data.name,
      isGoogleUser: data.data.isGoogleUser || false,
      picture: { uri: data.data.picture || null },
    });
    
    return data.data.token;
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw error;
  }
};

