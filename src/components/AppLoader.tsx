import React from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import {colors} from '@trackingPortal/themes/colors';

const {width} = Dimensions.get('window');

const AnimatedLoader = () => {
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    rotation.value = withRepeat(withTiming(360, {duration: 2000}), -1, false);
  }, []);

  // Animated style for the loader
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {rotate: `${rotation.value}deg`},
        {scale: interpolate(rotation.value, [0, 360], [1, 1.2])},
      ],
    };
  });

  return (
    <View style={[styles.container, styles.backdrop]}>
      <Animated.View style={[styles.loader, animatedStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    backgroundColor: colors.overlay,
  },
  loader: {
    width: width * 0.2,
    height: width * 0.2,
    borderWidth: 5,
    borderRadius: width * 0.1,
    borderColor: colors.primary,
    borderTopColor: colors.accent,
  },
});

export default AnimatedLoader;
