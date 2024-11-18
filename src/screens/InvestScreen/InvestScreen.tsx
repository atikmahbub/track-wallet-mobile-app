import {View, Text} from 'react-native';
import React from 'react';
import {darkTheme} from '@trackingPortal/themes/darkTheme';

export default function InvestScreen() {
  return (
    <View>
      <Text style={[{color: darkTheme.colors.text}]}>InvestScreen</Text>
    </View>
  );
}
