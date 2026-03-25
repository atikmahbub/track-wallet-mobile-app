import React, {useEffect} from 'react';
import {Stack, useRouter, useSegments} from 'expo-router';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {PaperProvider} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import notifee from '@notifee/react-native';
import {Text, TextInput} from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

import {darkTheme} from '@trackingPortal/themes/darkTheme';
import AppLayout from '@trackingPortal/layout';
import {
  Auth0ProviderWithHistory,
  useAuth,
} from '@trackingPortal/auth/Auth0ProviderWithHistory';
import {StoreProvider} from '@trackingPortal/contexts/StoreProvider';
import {AnimatedLoader} from '@trackingPortal/components';
import toastConfig from '@trackingPortal/components/ToastConfig';

const DEFAULT_AUTHENTICATED_ROUTE = '/(tabs)/expense';
const LOGIN_ROUTE = '/login';

SplashScreen.preventAutoHideAsync().catch(() => {});

const applyDefaultFont = () => {
  const components = [Text, TextInput];
  components.forEach(component => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const target = component as any;
    target.defaultProps = target.defaultProps || {};
    const existingStyle = target.defaultProps.style;
    const fontStyle = {fontFamily: 'Poppins_400Regular'};
    if (Array.isArray(existingStyle)) {
      target.defaultProps.style = [...existingStyle, fontStyle];
    } else if (existingStyle) {
      target.defaultProps.style = [existingStyle, fontStyle];
    } else {
      target.defaultProps.style = fontStyle;
    }
  });
};

const NavigationBoundary: React.FC = () => {
  const {token, loading} = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const rootSegment = segments[0];

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!token) {
      if (rootSegment !== 'login') {
        router.replace(LOGIN_ROUTE);
      }
      return;
    }

    if (!rootSegment || rootSegment === 'login' || rootSegment === 'index') {
      router.replace(DEFAULT_AUTHENTICATED_ROUTE);
    }
  }, [loading, token, router, rootSegment]);

  if (loading) {
    return <AnimatedLoader />;
  }

  return (
    <AppLayout>
      <Stack screenOptions={{headerShown: false}} />
    </AppLayout>
  );
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      applyDefaultFont();
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const settings = await notifee.requestPermission();
        if (settings.authorizationStatus === 1) {
          console.log('Notification permission granted.');
        } else {
          console.log('Notification permission denied.');
        }
      } catch (error) {
        console.warn('Failed to request notification permissions', error);
      }
    };

    requestPermissions();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <PaperProvider theme={darkTheme}>
          <Auth0ProviderWithHistory>
            <StoreProvider>
              <NavigationBoundary />
            </StoreProvider>
          </Auth0ProviderWithHistory>
        </PaperProvider>
      </SafeAreaProvider>
      <Toast topOffset={70} position="top" config={toastConfig} />
    </GestureHandlerRootView>
  );
}
