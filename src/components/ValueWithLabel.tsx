import {View, StyleSheet} from 'react-native';
import React from 'react';
import {Text} from 'react-native-paper';

interface IValueWithLabel {
  label: string;
  value: string | number;
  error?: boolean;
}

const ValueWithLabel: React.FC<IValueWithLabel> = ({label, value, error}) => {
  return (
    <View style={styles.container}>
      <Text variant="bodyLarge">{label}</Text>
      <Text variant="bodyLarge">{value}</Text>
    </View>
  );
};

export default ValueWithLabel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
});
