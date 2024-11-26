import {useAuth} from '@trackingPortal/auth/Auth0ProviderWithHistory';
import {getGreeting} from '@trackingPortal/utils/utils';
import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Avatar} from 'react-native-paper';

const CustomAppBar: React.FC = () => {
  const greeting = getGreeting();
  const {user} = useAuth();

  return (
    <View style={styles.greetingContainer}>
      <Avatar.Image
        size={50}
        source={{
          uri: user?.picture ?? '',
        }}
      />
      <Text style={styles.greetingText}>
        {greeting}, {user?.name ? user.name.split(' ')[0] : 'Admin'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  greetingText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
});

export default CustomAppBar;
