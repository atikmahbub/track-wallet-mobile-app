import {View, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {darkTheme} from '@trackingPortal/themes/darkTheme';
import {Avatar, Card, Text} from 'react-native-paper';
import {useAuth} from '@trackingPortal/auth/Auth0ProviderWithHistory';
import {AnimatedLoader, ValueWithLabel} from '@trackingPortal/components';
import {useStoreContext} from '@trackingPortal/contexts/StoreProvider';
import {ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ProfileScreen() {
  const {logout, loading} = useAuth();
  const {currentUser: user} = useStoreContext();

  if (loading) {
    return <AnimatedLoader />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.avatarContainer}>
        <Avatar.Image
          size={100}
          source={{
            uri: user?.profilePicture ?? '',
          }}
        />
      </View>
      <Card style={styles.profileCard} mode="elevated">
        <Card.Content>
          <ValueWithLabel label="Name" value={user?.name || 'N/A'} />
          <ValueWithLabel label="Email" value={user?.email || 'N/A'} />
        </Card.Content>
      </Card>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => {
          logout();
        }}>
        <Icon name="logout" size={30} color={'white'} />
        <Text style={styles.buttonText}>Log out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: darkTheme.colors.background,
  },
  avatarContainer: {
    paddingTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    marginTop: 40,
    backgroundColor: darkTheme.colors.surface,
    padding: 10,
  },
  buttonContainer: {
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: darkTheme.colors.surface,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  buttonText: {
    color: darkTheme.colors.error,
    fontSize: 18,
    fontWeight: 700,
  },
});
