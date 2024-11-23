import React from 'react';
import {View, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {CustomAppBar} from '@trackingPortal/components';
import {darkTheme} from '@trackingPortal/themes/darkTheme';
interface LayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<LayoutProps> = ({children}) => {
  return (
    <View style={styles.container}>
      <View style={styles.navigationContent}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.colors.background,
  },
  appBarContainer: {
    backgroundColor: darkTheme.colors.background,
  },
  navigationContent: {
    flex: 1,
  },
});

export default AppLayout;
