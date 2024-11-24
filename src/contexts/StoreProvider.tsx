import React, {createContext, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuth} from '@trackingPortal/auth/Auth0ProviderWithHistory';
import {ApiGateway} from '@trackingPortal/api/implementations';
import {IApiGateWay} from '@trackingPortal/api/interfaces';
import {useAuth0} from 'react-native-auth0';
import {IAddUserParams} from '@trackingPortal/api/params';
import {URLString, UserId} from '@trackingPortal/api/primitives';
import Toast from 'react-native-toast-message';

type StoreContextType = {
  appLoading: boolean;
  apiGateway: IApiGateWay;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);
const apiGateway = new ApiGateway();

export const StoreProvider = ({children}: {children: React.ReactNode}) => {
  const {token, user} = useAuth();
  const {user: auth0User} = useAuth0();
  const [hasToken, setHasToken] = useState<boolean>(false);
  const [appLoading, setAppLoading] = useState<boolean>(false);

  // navigation.navigate(ENavigationStack.Login); //* for logout

  const saveToken = async () => {
    if (token) {
      apiGateway.ajaxUtils.setAccessToken(token);
      setHasToken(true);
    }
  };

  useEffect(() => {
    saveToken();
  }, [token]);

  useEffect(() => {
    hasToken && addUserToDb();
  }, [auth0User, hasToken]);

  const addUserToDb = async () => {
    try {
      setAppLoading(true);
      if (
        !auth0User?.name ||
        !auth0User?.email ||
        !auth0User.picture ||
        !auth0User.sub
      )
        return;

      const params: IAddUserParams = {
        userId: UserId(auth0User.sub),
        name: auth0User.name,
        profilePicture: URLString(auth0User.picture),
        email: auth0User.email,
      };
      await apiGateway.userService.addUser(params);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong!',
        position: 'bottom',
      });
    }
  };

  const contextValues: StoreContextType = {
    appLoading,
    apiGateway,
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
