import React from 'react';
import {PaperProvider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {darkTheme} from '@trackingPortal/themes/darkTheme';
import AppNavigation from '@trackingPortal/navigation/AppNavigation';
import AppLayout from '@trackingPortal/layout';

function App(): React.JSX.Element {
  return (
    <PaperProvider theme={darkTheme}>
      <NavigationContainer>
        <AppLayout>
          <AppNavigation />
        </AppLayout>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;
