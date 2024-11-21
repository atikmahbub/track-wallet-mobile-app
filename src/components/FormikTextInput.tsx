import React from 'react';
import {TextInput, TextInputProps} from 'react-native-paper';
import {useField} from 'formik';
import {View, Text, StyleSheet} from 'react-native';

interface FormikTextInputProps extends TextInputProps {
  name: string;
}

const FormikTextInput: React.FC<FormikTextInputProps> = ({
  name,
  label,
  keyboardType = 'default',
  mode = 'outlined',
}) => {
  const [field, meta] = useField(name);

  return (
    <View style={styles.container}>
      <TextInput
        mode={mode}
        label={label}
        value={field.value}
        onChangeText={field.onChange(name)}
        onBlur={field.onBlur(name)}
        keyboardType={keyboardType as any}
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
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});

export default FormikTextInput;
