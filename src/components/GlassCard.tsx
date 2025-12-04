// src/components/GlassCard.tsx
import React from 'react';
import {
  Platform,
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {BlurView} from 'expo-blur';
import {GlassView, GlassStyle} from 'expo-glass-effect';

import {colors} from '@trackingPortal/themes/colors';

type GlassEngine = 'auto' | 'glass' | 'blur';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  padding?: number;
  /**
   * Force a specific rendering engine.
   * - `auto` (default) chooses native glass on supported iOS, blur elsewhere
   * - `glass` always uses the native glass engine
   * - `blur` always uses the blur fallback
   */
  engine?: GlassEngine;
  /**
   * Controls the native glass style. Only applies when the glass engine is used.
   */
  glassEffectStyle?: GlassStyle;
  /**
   * Controls the blur intensity for the fallback engine.
   */
  blurIntensity?: number;
}

const MIN_IOS_GLASS_VERSION = 17;

function getIOSMajorVersion(): number {
  if (Platform.OS !== 'ios') {
    return 0;
  }

  const version = Platform.Version as unknown;
  if (typeof version === 'string') {
    const major = parseInt(version.split('.')[0] ?? '0', 10);
    return Number.isNaN(major) ? 0 : major;
  }

  if (typeof version === 'number') {
    return version;
  }

  return 0;
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  contentStyle,
  padding = 20,
  engine = 'auto',
  glassEffectStyle = 'clear',
  blurIntensity = 85,
}) => {
  const iosMajor = getIOSMajorVersion();
  const glassSupported =
    Platform.OS === 'ios' && iosMajor >= MIN_IOS_GLASS_VERSION;

  const forceGlass = engine === 'glass';
  const forceBlur = engine === 'blur';

  const useGlass = forceGlass || (engine === 'auto' && glassSupported);
  const useBlur = forceBlur || !useGlass;

  if (useGlass) {
    return (
      <GlassView
        glassEffectStyle={glassEffectStyle}
        tintColor={colors.glassTint}
        isInteractive
        style={[styles.container, styles.shadow, style]}>
        <View pointerEvents="none" style={styles.tintLayer} />
        <View pointerEvents="none" style={styles.decorLayer}>
          <View style={[styles.glow, styles.primaryGlow]} />
          <View style={[styles.glow, styles.accentGlow]} />
          <View style={[styles.glow, styles.highlightGlow]} />
        </View>
        <View style={[styles.inner, {padding}, contentStyle]}>{children}</View>
      </GlassView>
    );
  }

  if (useBlur) {
    return (
      <BlurView
        intensity={blurIntensity}
        tint="system"
        style={[styles.container, styles.shadow, style]}>
        <View pointerEvents="none" style={styles.tintLayer} />
        <View pointerEvents="none" style={styles.decorLayer}>
          <View style={[styles.glow, styles.primaryGlow]} />
          <View style={[styles.glow, styles.accentGlow]} />
          <View style={[styles.glow, styles.highlightGlow]} />
        </View>
        <View style={[styles.inner, {padding}, contentStyle]}>{children}</View>
      </BlurView>
    );
  }

  return (
    <View style={[styles.container, styles.shadow, style]}>
      <View pointerEvents="none" style={styles.tintLayer} />
      <View pointerEvents="none" style={styles.decorLayer}>
        <View style={[styles.glow, styles.primaryGlow]} />
        <View style={[styles.glow, styles.accentGlow]} />
        <View style={[styles.glow, styles.highlightGlow]} />
      </View>
      <View style={[styles.inner, {padding}, contentStyle]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 26,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  inner: {
    gap: 0,
  },
  tintLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.glassTint,
  },
  decorLayer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 240,
    opacity: 0.25,
  },
  primaryGlow: {
    top: -140,
    left: -100,
    backgroundColor: 'rgba(255, 140, 66, 0.55)',
  },
  accentGlow: {
    bottom: -160,
    right: -60,
    backgroundColor: 'rgba(255, 217, 160, 0.4)',
  },
  highlightGlow: {
    top: 80,
    right: 40,
    width: 160,
    height: 160,
    borderRadius: 160,
    backgroundColor: 'rgba(194, 76, 48, 0.25)',
  },
  shadow: {
    shadowColor: colors.primary,
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: {width: 0, height: 12},
    elevation: 10,
  },
});

export default GlassCard;
