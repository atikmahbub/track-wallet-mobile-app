import {View, StyleSheet, Image} from 'react-native';
import React from 'react';
import {darkTheme} from '@trackingPortal/themes/darkTheme';
import {Button, Text} from 'react-native-paper';
import {useAuth} from '@trackingPortal/auth/Auth0ProviderWithHistory';
import {AppLoader} from '@trackingPortal/components';

export default function LoginScreen() {
  const {login, loading} = useAuth();

  if (loading) {
    return <AppLoader />;
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('@trackingPortal/assets/logo1.png')}
        style={styles.logo}
      />
      <Text variant="headlineLarge" style={{fontWeight: 700}}>
        TrackWallet
      </Text>
      <Text variant="titleMedium" style={styles.header}>
        TrackWallet helps you effortlessly manage your daily spending, set
        monthly goals, and keep your finances in check. Stay on top of your
        budget with a clean, intuitive interface designed to make tracking your
        expenses fast and easy.
      </Text>
      <Button mode="contained" onPress={login}>
        Log in
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  header: {
    marginTop: 20,
    textAlign: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: -30,
  },
});
