import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import LoadingButton from './LoadingButton';

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
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={styles.modal}>
      <View style={styles.modalContent}>
        <Text style={styles.title}>{title}</Text>
        {children}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <LoadingButton label="Save" loading={!!loading} onPress={onSave} />
        </View>
      </View>
    </Modal>
  );
};

export default FormModal;

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#2A0845',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E1BEE7',
    paddingBottom: 25,
  },
  input: {
    backgroundColor: '#3E206D',
    color: '#E1BEE7',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#7B1FA2',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  buttonText: {
    color: '#E1BEE7',
    fontWeight: 'bold',
  },
});
