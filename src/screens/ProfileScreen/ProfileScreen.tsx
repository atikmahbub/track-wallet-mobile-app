import {View, Text} from 'react-native';
import React from 'react';
import {darkTheme} from '@trackingPortal/themes/darkTheme';
import {Button} from 'react-native-paper';
import {useAuth} from '@trackingPortal/auth/Auth0ProviderWithHistory';
import {AnimatedLoader} from '@trackingPortal/components';

export default function ProfileScreen() {
  const {logout, loading} = useAuth();

  if (loading) {
    return <AnimatedLoader />;
  }

  return (
    <View>
      <Text style={[{color: darkTheme.colors.text}]}>InvestScreen</Text>
      <Button mode="text" onPress={logout}>
        Log out
      </Button>
    </View>
  );
}
