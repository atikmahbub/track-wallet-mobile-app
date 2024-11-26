import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';

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
          <TouchableOpacity style={styles.saveButton} onPress={onSave}>
            <Text style={styles.buttonText}>Save</Text>
            {loading && (
              <ActivityIndicator
                size="small"
                color="#FFF"
                style={styles.loader}
              />
            )}
          </TouchableOpacity>
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
    paddingBottom: 50,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E1BEE7',
    marginBottom: 10,
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
  saveButton: {
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
