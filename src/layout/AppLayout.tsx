import React from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {colors} from '@trackingPortal/themes/colors';

interface LayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<LayoutProps> = ({children}) => {
  return (
    <View style={styles.container}>
      <View pointerEvents="none" style={styles.backgroundDecor}>
        <View style={[styles.glow, styles.glowPrimary]} />
        <View style={[styles.glow, styles.glowAccent]} />
        <View style={[styles.glow, styles.glowSecondary]} />
        <View style={styles.noiseOverlay} />
      </View>
      <View style={styles.navigationContent}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  navigationContent: {
    flex: 1,
  },
  backgroundDecor: {
    ...StyleSheet.absoluteFillObject,
  },
  glow: {
    position: 'absolute',
    opacity: 0.45,
    width: 320,
    height: 320,
    borderRadius: 320,
    shadowColor: colors.accent,
    shadowOpacity: Platform.OS === 'ios' ? 0.35 : 0.25,
    shadowRadius: 120,
    shadowOffset: {width: 0, height: 0},
    elevation: 12,
  },
  glowPrimary: {
    top: -140,
    left: -60,
    backgroundColor: colors.primary,
  },
  glowAccent: {
    top: 180,
    right: -120,
    backgroundColor: colors.accent,
  },
  glowSecondary: {
    bottom: -160,
    left: -100,
    backgroundColor: colors.secondary,
  },
  noiseOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.softOverlay,
  },
});

export default AppLayout;
