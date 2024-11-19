/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {PaperProvider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {darkTheme} from '@trackingPortal/themes/darkTheme';
import AppNavigation from './navigation/AppNavigation';

function App(): React.JSX.Element {
  return (
    <PaperProvider theme={darkTheme}>
      <NavigationContainer>
        <View
          style={[
            styles.safeArea,
            {backgroundColor: darkTheme.colors.background},
          ]}>
          <AppNavigation />
        </View>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  sectionContainer: {
    paddingHorizontal: 24,
    color: darkTheme.colors.text,
  },
});

export default App;
