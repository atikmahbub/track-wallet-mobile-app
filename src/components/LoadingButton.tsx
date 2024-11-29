import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import React from 'react';

interface ILoadingButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  loading: boolean;
  label: string;
}

const LoadingButton: React.FC<ILoadingButtonProps> = ({
  onPress,
  label,
  loading,
}) => {
  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
      <Text style={styles.buttonText}>{label}</Text>
      {loading && (
        <ActivityIndicator size="small" color="#FFF" style={styles.loader} />
      )}
    </TouchableOpacity>
  );
};

export default LoadingButton;

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: '#9C27B0',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#E1BEE7',
    fontWeight: 'bold',
  },
  loader: {
    marginLeft: 10,
  },
});
