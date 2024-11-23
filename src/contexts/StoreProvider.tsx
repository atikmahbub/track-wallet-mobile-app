import React, {createContext, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuth} from '@trackingPortal/auth/Auth0ProviderWithHistory';
// import {addUserToDb} from '@trackingPortal/api/userService'; // Hypothetical service for adding users
import {Alert} from 'react-native';

type StoreContextType = {
  saveUserToDb: () => Promise<void>;
  getToken: () => Promise<string | null>;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({children}: {children: React.ReactNode}) => {
  const {token, user} = useAuth();
  const [storedToken, setStoredToken] = useState<string | null>(null);

  // Save token to AsyncStorage for persistence
  const saveToken = async () => {
    if (token) {
      await AsyncStorage.setItem('authToken', token);
      setStoredToken(token);
    }
  };

  const getToken = async () => {
    if (!storedToken) {
      const tokenFromStorage = await AsyncStorage.getItem('authToken');
      setStoredToken(tokenFromStorage);
      return tokenFromStorage;
    }
    return storedToken;
  };

  const saveUserToDb = async () => {
    try {
      if (user) {
        // await addUserToDb({
        //   userId: user.sub,
        //   name: user.name,
        //   email: user.email,
        //   profilePicture: user.picture,
        // });
        Alert.alert('Success', 'User added to database');
      }
    } catch (error) {
      console.error('Error saving user to database:', error);
      Alert.alert('Error', 'Failed to save user to database');
    }
  };

  useEffect(() => {
    saveToken();
  }, [token]);

  const contextValues: StoreContextType = {
    saveUserToDb,
    getToken,
  };

  return (
    <StoreContext.Provider value={contextValues}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStoreContext = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStoreContext must be used within a StoreProvider');
  }
  return context;
};
