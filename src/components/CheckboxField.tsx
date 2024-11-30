import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Checkbox} from 'react-native-paper';
import {useField} from 'formik';

interface FormikCheckboxFieldProps {
  name: string;
  label: string;
}

const FormikCheckboxField: React.FC<FormikCheckboxFieldProps> = ({
  name,
  label,
}) => {
  const [field, meta, helpers] = useField(name);

  const handleChange = () => {
    helpers.setValue(!field.value);
  };

  return (
    <View style={styles.container}>
      <Checkbox.Item
        label={label}
        status={field.value ? 'checked' : 'unchecked'}
        onPress={handleChange}
        labelStyle={styles.label}
        mode="ios"
        style={styles.checkbox}
      />
      {meta.touched && meta.error && (
        <Text style={styles.errorText}>{meta.error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    color: '#FFFFFF', // Text color for dark mode
  },
  checkbox: {
    backgroundColor: '#1E1E2F', // Matches dark mode theme
  },
  errorText: {
    color: '#FF4081', // Error text color
    fontSize: 12,
    marginTop: 4,
  },
});

export default FormikCheckboxField;
