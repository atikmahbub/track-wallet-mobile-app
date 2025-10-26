import React, {createContext, useContext, useEffect, useState} from 'react';
import Auth0 from 'react-native-auth0';
import {AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_AUDIENCE} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRouter} from 'expo-router';

const TOKEN_KEY = 'auth_token';
const LOGGED_IN_ROUTE = '/(tabs)/expense';
const LOGIN_ROUTE = '/login';

const auth0 = new Auth0({
  domain: AUTH0_DOMAIN || '',
  clientId: AUTH0_CLIENT_ID || '',
});

type AuthContextType = {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  token: string | null;
  user: any;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const Auth0ProviderWithHistory = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const redirectUrl = 'com.track-wallet://auth';

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        const storedToken = await AsyncStorage.getItem(TOKEN_KEY);

        if (storedToken) {
          setToken(storedToken);

          try {
            const userInfo = await auth0.auth.userInfo({token: storedToken});
            setUser(userInfo);
          } catch (error) {
            console.error('Token expired or invalid:', error);
            await AsyncStorage.removeItem(TOKEN_KEY);
            setToken(null);
            setUser(null);
          }
        } else {
          setToken(null);
          setUser(null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async () => {
    try {
      setLoading(true);
      const credentials = await auth0.webAuth.authorize({
        scope: 'openid profile email',
        audience: AUTH0_AUDIENCE,
        redirectUrl: redirectUrl,
        connection: 'google-oauth2',
      });
      setToken(credentials.accessToken);
      await AsyncStorage.setItem(TOKEN_KEY, credentials.accessToken);

      const userInfo = await auth0.auth.userInfo({
        token: credentials.accessToken,
      });
      setUser(userInfo);

      router.replace(LOGGED_IN_ROUTE);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);

      await fetch(
        `https://${AUTH0_DOMAIN}/v2/logout?client_id=${AUTH0_CLIENT_ID}&federated=true`,
      );

      router.replace(LOGIN_ROUTE);
    } catch (error: any) {
      console.error('Logout error:', JSON.stringify(error, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{login, logout, token, user, loading}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an Auth0ProviderWithHistory');
  }
  return context;
};
