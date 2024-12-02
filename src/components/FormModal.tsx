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
      <SafeAreaView style={{flex: 1}}>
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
                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <LoadingButton
                  label="Save"
                  loading={!!loading}
                  onPress={onSave}
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
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#2A0845',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 50,
    height: 'auto',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E1BEE7',
    paddingBottom: 15,
  },
  scrollView: {
    flexGrow: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10, // Adjusted spacing above the buttons
  },
  cancelButton: {
    backgroundColor: '#7B1FA2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 10,
  },
  buttonText: {
    color: '#E1BEE7',
    fontWeight: 'bold',
  },
});
