import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import LottieView from 'lottie-react-native';
import {colors} from '@trackingPortal/themes/colors';

const AppLoader = () => {
  return (
    <View style={styles.container}>
      <View pointerEvents="none" style={styles.glowLayer}>
        <View style={[styles.glow, styles.primaryGlow]} />
        <View style={[styles.glow, styles.accentGlow]} />
      </View>
      <View style={styles.loaderCard}>
        <LottieView
          source={require('@trackingPortal/assets/loader2.json')}
          autoPlay={true}
          loop
          style={styles.loader}
        />
        <Text style={styles.loaderLabel}>Warming up TrackWallet…</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  glowLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  glow: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 260,
    opacity: 0.35,
    shadowColor: colors.primary,
    shadowOpacity: 0.5,
    shadowRadius: 120,
    shadowOffset: {width: 0, height: 0},
  },
  primaryGlow: {
    top: -40,
    left: -60,
    backgroundColor: colors.primary,
  },
  accentGlow: {
    bottom: -80,
    right: -40,
    backgroundColor: colors.accent,
  },
  loaderCard: {
    width: 220,
    borderRadius: 32,
    paddingVertical: 32,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.surface,
    shadowColor: colors.overlay,
    shadowOpacity: 0.35,
    shadowRadius: 24,
    shadowOffset: {width: 0, height: 16},
  },
  loader: {
    width: 150,
    height: 150,
  },
  loaderLabel: {
    color: colors.text,
    fontSize: 14,
    letterSpacing: 0.4,
  },
});

export default AppLoader;
