import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Modal from 'react-native-modal';
import LoadingButton from '@trackingPortal/components/LoadingButton';
import {colors} from '@trackingPortal/themes/colors';

interface IFormModal {
  isVisible: boolean;
  title: string;
  onClose: () => void;
  onSave: () => void;
  loading?: boolean;
  children: React.ReactNode;
}

const FormModal: React.FC<IFormModal> = ({
  isVisible,
  title,
  onClose,
  onSave,
  loading,
  children,
}) => {
  const dismissKeyboard = () => Keyboard.dismiss();

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={() => {
        dismissKeyboard();
        onClose();
      }}
      onBackButtonPress={() => {
        dismissKeyboard();
        onClose();
      }}
      style={styles.modal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      useNativeDriver
      useNativeDriverForBackdrop
      backdropTransitionOutTiming={0}
      animationInTiming={300}
      animationOutTiming={300}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoidingView}>
          <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={styles.modalContent}>
              <Text style={styles.title}>{title}</Text>
              <ScrollView
                contentContainerStyle={styles.scrollView}
                keyboardShouldPersistTaps="handled">
                {children}
              </ScrollView>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    dismissKeyboard();
                    onClose();
                  }}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <LoadingButton
                  label="Save"
                  loading={!!loading}
                  onPress={() => {
                    dismissKeyboard();
                    onSave();
                  }}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

export default FormModal;

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  safeArea: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.overlay,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 36,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.glassBorder,
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 30,
    shadowOffset: {width: 0, height: -12},
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    paddingBottom: 16,
    letterSpacing: 0.4,
  },
  scrollView: {
    flexGrow: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 18,
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.surface,
  },
  buttonText: {
    color: colors.subText,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
