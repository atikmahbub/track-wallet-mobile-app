import React, {Fragment, useEffect, useRef} from 'react';
import {PaperProvider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {darkTheme} from '@trackingPortal/themes/darkTheme';
import AppNavigation from '@trackingPortal/navigation/AppNavigation';
import AppLayout from '@trackingPortal/layout';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Auth0ProviderWithHistory} from './auth/Auth0ProviderWithHistory';

import Toast from 'react-native-toast-message';
import {StoreProvider} from '@trackingPortal/contexts/StoreProvider';

function App(): React.JSX.Element {
  const navigationRef = useRef(null);
  const isReadyRef = useRef(false);

  return (
    <Fragment>
      <SafeAreaProvider>
        <GestureHandlerRootView>
          <PaperProvider theme={darkTheme}>
            <NavigationContainer
              ref={navigationRef}
              onReady={() => {
                isReadyRef.current = true;
              }}>
              <Auth0ProviderWithHistory>
                <StoreProvider>
                  <AppLayout>
                    <AppNavigation />
                  </AppLayout>
                </StoreProvider>
              </Auth0ProviderWithHistory>
            </NavigationContainer>
          </PaperProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
      <Toast topOffset={70} position="top" />
    </Fragment>
  );
}

export default App;
