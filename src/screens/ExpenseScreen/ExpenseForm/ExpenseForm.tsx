import {View, Pressable, StyleSheet} from 'react-native';
import React, {useMemo, useState} from 'react';
import {useFormikContext} from 'formik';
import {EAddExpenseFields} from '@trackingPortal/screens/ExpenseScreen/ExpenseCreation/ExpenseCreation.constants';
import {TextInput} from 'react-native-paper';
import {FormikTextInput} from '@trackingPortal/components';
import DatePicker from 'react-native-date-picker';
import dayjs from 'dayjs';

export default function ExpenseForm() {
  const {values, setFieldValue} = useFormikContext<any>();
  const [pickerVisible, setPickerVisible] = useState(false);
  const dateValue = values[EAddExpenseFields.DATE];

  const currentDate = useMemo(() => {
    if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
      return dateValue;
    }
    const parsed = new Date(dateValue);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  }, [dateValue]);

  return (
    <View style={{gap: 16}}>
      <View style={styles.inputWrapper}>
        <TextInput
          mode="outlined"
          label="Select Date"
          value={dayjs(currentDate).format('DD MMM YYYY')}
          editable={false}
          pointerEvents="none"
        />
        <Pressable
          style={StyleSheet.absoluteFillObject}
          onPress={() => setPickerVisible(true)}
        />
      </View>
      <DatePicker
        modal
        mode="date"
        open={pickerVisible}
        date={currentDate}
        theme="dark"
        onConfirm={selectedDate => {
          setFieldValue(EAddExpenseFields.DATE, selectedDate);
          setPickerVisible(false);
        }}
        onCancel={() => setPickerVisible(false)}
      />
      <FormikTextInput name={EAddExpenseFields.DESCRIPTION} label="Purpose" />
      <FormikTextInput
        name={EAddExpenseFields.AMOUNT}
        label="Amount"
        keyboardType="numeric"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    position: 'relative',
  },
});
