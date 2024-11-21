import React from 'react';
import {PaperProvider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {darkTheme} from '@trackingPortal/themes/darkTheme';
import AppNavigation from '@trackingPortal/navigation/AppNavigation';
import AppLayout from '@trackingPortal/layout';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <PaperProvider theme={darkTheme}>
          <NavigationContainer>
            <AppLayout>
              <AppNavigation />
            </AppLayout>
          </NavigationContainer>
        </PaperProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

export default App;
