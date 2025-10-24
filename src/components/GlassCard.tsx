import React from 'react';
import {
  Platform,
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import {colors} from '@trackingPortal/themes/colors';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  padding?: number;
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  contentStyle,
  padding = 20,
}) => {
  if (Platform.OS === 'ios') {
    return (
      <View style={[styles.container, style]}>
        <BlurView
          blurType="ultraThinMaterialDark"
          blurAmount={24}
          reducedTransparencyFallbackColor={colors.surfaceAlt}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.tintLayer} />
        <View style={[styles.inner, {padding}, contentStyle]}>{children}</View>
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.androidContainer, style]}>
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
    position: 'relative',
  },
  inner: {
    gap: 0,
  },
  tintLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5, 9, 21, 0.35)',
  },
  androidContainer: {
    backgroundColor: colors.surfaceAlt,
    shadowColor: colors.primary,
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 10,
    shadowOffset: {width: 0, height: 12},
  },
});

export default GlassCard;
