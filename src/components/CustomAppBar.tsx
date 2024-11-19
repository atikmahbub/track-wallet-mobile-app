import {getGreeting} from '@trackingPortal/utils/utils';
import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Avatar} from 'react-native-paper';

const CustomAppBar: React.FC = () => {
  const greeting = getGreeting();

  return (
    <View style={styles.greetingContainer}>
      <Avatar.Image
        size={50}
        source={{
          uri: 'https://example.com/avatar.jpg',
        }}
      />
      <Text style={styles.greetingText}>{greeting}, Admin</Text>
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
