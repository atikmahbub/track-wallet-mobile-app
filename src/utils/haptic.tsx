import HapticFeedback from 'react-native-haptic-feedback';

export const withHaptic = (action: () => void): void => {
  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };
  HapticFeedback.trigger('impactMedium', options);
  action();
};
