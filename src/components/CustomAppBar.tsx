import {useAuth} from '@trackingPortal/auth/Auth0ProviderWithHistory';
import {getGreeting} from '@trackingPortal/utils/utils';
import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Avatar} from 'react-native-paper';

const CustomAppBar: React.FC = () => {
  const {user} = useAuth();

  const greeting = React.useMemo(() => getGreeting(), []);
  const userName = React.useMemo(
    () => user?.name?.split(' ')[0] ?? 'Admin',
    [user],
  );
  const userPicture = React.useMemo(() => user?.picture ?? '', [user]);

  return (
    <View style={styles.greetingContainer}>
      <Avatar.Image
        size={50}
        source={{
          uri: userPicture,
        }}
      />
      <Text style={styles.greetingText}>
        {greeting}, {userName}
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

export default React.memo(CustomAppBar);
