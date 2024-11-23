import React from 'react';
import {PaperProvider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {darkTheme} from '@trackingPortal/themes/darkTheme';
import AppNavigation from '@trackingPortal/navigation/AppNavigation';
import AppLayout from '@trackingPortal/layout';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Auth0ProviderWithHistory} from './auth/Auth0ProviderWithHistory';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <PaperProvider theme={darkTheme}>
          <NavigationContainer>
            <Auth0ProviderWithHistory>
              <AppLayout>
                <AppNavigation />
              </AppLayout>
            </Auth0ProviderWithHistory>
          </NavigationContainer>
        </PaperProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

export default App;
