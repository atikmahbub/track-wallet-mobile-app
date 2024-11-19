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
    <SafeAreaView style={styles.safeArea}>
      <CustomAppBar />
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: darkTheme.colors.background,
  },
  content: {
    flex: 1,
  },
});

export default AppLayout;
