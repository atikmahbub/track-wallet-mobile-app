import React, {createContext, useContext, useEffect, useState} from 'react';
import {useAuth} from '@trackingPortal/auth/Auth0ProviderWithHistory';
import {ApiGateway} from '@trackingPortal/api/implementations';
import {IApiGateWay} from '@trackingPortal/api/interfaces';
import {IAddUserParams} from '@trackingPortal/api/params';
import {
  makeUnixTimestampString,
  URLString,
  UserId,
} from '@trackingPortal/api/primitives';
import Toast from 'react-native-toast-message';
import {UserModel} from '@trackingPortal/api/models';

type StoreContextType = {
  apiGateway: IApiGateWay;
  currentUser: NewUserModel;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);
const apiGateway = new ApiGateway();

interface NewUserModel extends UserModel {
  default: boolean;
}

const defaultUser: NewUserModel = {
  name: 'Admin',
  email: 'admin@gmail.com',
  userId: 'admin' as UserId,
  profilePicture: 'link' as URLString,
  created: makeUnixTimestampString(Number(new Date())),
  updated: makeUnixTimestampString(Number(new Date())),
  default: true,
};

export const StoreProvider = ({children}: {children: React.ReactNode}) => {
  const {token, user: auth0User} = useAuth();
  const [currentUser, setCurrentUser] = useState<NewUserModel>(defaultUser);

  useEffect(() => {
    if (token) {
      apiGateway.ajaxUtils.setAccessToken(token);
      addUserToDb();
    }
  }, [auth0User, token]);

  const addUserToDb = async () => {
    try {
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
      const user = await apiGateway.userService.addUser(params);
      setCurrentUser({
        ...user,
        default: false,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong!',
      });
    }
  };

  const contextValues: StoreContextType = {
    currentUser,
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
