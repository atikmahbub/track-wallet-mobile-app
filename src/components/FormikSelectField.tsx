import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';
import {useField} from 'formik';
import {TextInput, TouchableRipple} from 'react-native-paper';
import {darkTheme} from '@trackingPortal/themes/darkTheme';
import {colors} from '@trackingPortal/themes/colors';

interface FormikSelectFieldProps {
  name: string;
  label: string;
  options: {label: string; value: string | number}[];
  height: number;
}

const FormikSelectField: React.FC<FormikSelectFieldProps> = ({
  name,
  label,
  options,
  height,
}) => {
  const [field, meta, helpers] = useField(name);
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleSelect = (value: string | number) => {
    helpers.setValue(value);
    closeMenu();
  };

  return (
    <View style={styles.container}>
      <TouchableRipple onPress={openMenu}>
        <TextInput
          label={label}
          value={
            options.find(option => option.value === field.value)?.label || ''
          }
          editable={false}
          pointerEvents="none"
          style={styles.input}
          right={<TextInput.Icon icon="chevron-down" />}
          theme={{
            colors: {
              primary: colors.primary,
              text: colors.text,
              placeholder: colors.placeholder,
              background: colors.background,
            },
          }}
        />
      </TouchableRipple>
      {visible && (
        <TouchableWithoutFeedback onPress={closeMenu}>
          <View style={styles.dropdownOverlay}>
            <View style={[styles.dropdown, {height: height}]}>
              <FlatList
                data={options}
                keyExtractor={item => item.value.toString()}
                renderItem={({item}) => (
                  <TouchableRipple onPress={() => handleSelect(item.value)}>
                    <Text style={styles.dropdownItem}>{item.label}</Text>
                  </TouchableRipple>
                )}
                contentContainerStyle={styles.flatListContent}
                showsVerticalScrollIndicator
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
      {meta.touched && meta.error && (
        <Text style={styles.errorText}>{meta.error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: 14,
    overflow: 'hidden',
  },
  input: {
    backgroundColor: darkTheme.colors.surface,
    color: colors.text,
  },
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: colors.overlay,
  },
  dropdown: {
    backgroundColor: darkTheme.colors.surface,
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 18,
    padding: 10,
    zIndex: 999,
  },
  flatListContent: {
    paddingVertical: 5,
  },
  dropdownItem: {
    padding: 10,
    color: colors.text,
    fontSize: 16,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
});

export default FormikSelectField;
