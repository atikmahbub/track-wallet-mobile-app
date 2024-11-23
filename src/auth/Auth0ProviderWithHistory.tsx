import React, {createContext, useContext, useState} from 'react';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import Auth0 from 'react-native-auth0';
import {AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_AUDIENCE} from '@env';
import {
  ENavigationTab,
  ENavigationStack,
  RootStackParamList,
} from '@trackingPortal/navigation/ERoutes';

const auth0 = new Auth0({
  domain: AUTH0_DOMAIN || '',
  clientId: AUTH0_CLIENT_ID || '',
});

type AuthContextType = {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  token: string | null;
  user: any;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const Auth0ProviderWithHistory = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const login = async () => {
    try {
      const credentials = await auth0.webAuth.authorize({
        scope: 'openid profile email',
        audience: AUTH0_AUDIENCE,
        redirectUrl: 'com.track-wallet://auth',
      });

      setToken(credentials.accessToken);
      const userInfo = await auth0.auth.userInfo({
        token: credentials.accessToken,
      });
      setUser(userInfo);

      navigation.navigate('Tabs', {
        screen: ENavigationTab.Expense,
      });
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = async () => {
    try {
      await auth0.webAuth.clearSession();
      setToken(null);
      setUser(null);

      navigation.navigate(ENavigationStack.Login);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{login, logout, token, user}}>
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
