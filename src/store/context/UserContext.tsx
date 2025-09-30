import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../../config/environment";

interface UserContextType {
  userId: string | null;
  setUserId: (id: string) => void;
}

export const UserContext = createContext<UserContextType>({
  userId: null,
  setUserId: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  console.log("userId", userId);
  
  // Load userId from AsyncStorage when app starts
  useEffect(() => {
    const loadUserId = async () => {
      try {
        // First try to get userId from the old key for backward compatibility
        let storedId = await AsyncStorage.getItem("userId");
        
        // If not found, try to get it from the user profile
        if (!storedId) {
          const userProfile = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
          if (userProfile) {
            const user = JSON.parse(userProfile);
            storedId = user.UserID;
          }
        }
        
        if (storedId) {
          setUserId(storedId);
        }
      } catch (error) {
        console.error("Error loading userId:", error);
      }
    };
    loadUserId();
  }, []);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};
