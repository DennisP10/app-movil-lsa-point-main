import { ToastAndroid, Platform, Alert } from 'react-native';

interface ToastParams {
  message: string;
}

export const showToast = ({ message }: ToastParams): void => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    // Fallback for iOS
    Alert.alert('', message);
  }
};
