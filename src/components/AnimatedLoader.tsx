import React from 'react';
import {StyleSheet, View} from 'react-native';
import LottieView from 'lottie-react-native';
import {darkTheme} from '@trackingPortal/themes/darkTheme';

const AppLoader = () => {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('@trackingPortal/assets/loader2.json')}
        autoPlay={true}
        loop
        style={styles.loader}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: darkTheme.colors.background,
  },
  loader: {
    width: 150,
    height: 150,
  },
});

export default AppLoader;
