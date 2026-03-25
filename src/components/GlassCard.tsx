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
  engine?: GlassEngine;
  glassEffectStyle?: GlassStyle;
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
  padding = 24,
  engine = 'auto',
  glassEffectStyle = 'clear',
  blurIntensity = 20,
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
        tintColor={colors.surface}
        isInteractive
        style={[styles.container, styles.shadow, style]}>
        <View style={[styles.inner, {padding}, contentStyle]}>{children}</View>
      </GlassView>
    );
  }

  if (useBlur) {
    return (
      <BlurView
        intensity={blurIntensity}
        tint="dark"
        style={[styles.container, styles.shadow, style]}>
        <View style={[styles.inner, {padding}, contentStyle]}>{children}</View>
      </BlurView>
    );
  }

  return (
    <View style={[styles.container, styles.shadow, style]}>
      <View style={[styles.inner, {padding}, contentStyle]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(161, 250, 255, 0.05)',
    overflow: 'hidden',
    backgroundColor: '#1b2026', 
  },
  inner: {
    gap: 0,
  },
  shadow: {
    shadowColor: 'rgba(161, 250, 255, 0.08)',
    shadowOpacity: 1,
    shadowRadius: 40,
    shadowOffset: {width: 0, height: 12},
    elevation: 8,
  },
});

export default GlassCard;
