import {View, Pressable, StyleSheet} from 'react-native';
import React, {useMemo, useState} from 'react';
import {useFormikContext} from 'formik';
import {EAddLoanFields} from '@trackingPortal/screens/LoanScreen';
import {TextInput} from 'react-native-paper';
import {FormikSelectField, FormikTextInput} from '@trackingPortal/components';
import DatePicker from 'react-native-date-picker';
import dayjs from 'dayjs';
import {LoanType} from '@trackingPortal/api/enums';

export default function LoanForm() {
  const {values, setFieldValue} = useFormikContext<any>();
  const [pickerVisible, setPickerVisible] = useState(false);
  const deadlineValue = values[EAddLoanFields.DEADLINE];
  const currentDeadline = useMemo(() => {
    if (deadlineValue instanceof Date && !isNaN(deadlineValue.getTime())) {
      return deadlineValue;
    }
    const parsed = new Date(deadlineValue);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  }, [deadlineValue]);

  return (
    <View style={{gap: 16}}>
      <FormikSelectField
        name={EAddLoanFields.LOAN_TYPE}
        label="Type"
        options={[
          {label: 'Given', value: LoanType.GIVEN},
          {label: 'Taken', value: LoanType.TAKEN},
        ]}
        height={110}
      />
      <FormikTextInput name={EAddLoanFields.NAME} label="Name" />
      <FormikTextInput
        name={EAddLoanFields.AMOUNT}
        label="Amount"
        keyboardType="numeric"
      />
      <FormikTextInput name={EAddLoanFields.NOTE} label="Note" />
      <View style={styles.inputWrapper}>
        <TextInput
          mode="outlined"
          label="Soft Deadline"
          value={dayjs(currentDeadline).format('DD MMM YYYY')}
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
        date={currentDeadline}
        theme="dark"
        onConfirm={selectedDate => {
          setFieldValue(EAddLoanFields.DEADLINE, selectedDate);
          setPickerVisible(false);
        }}
        onCancel={() => setPickerVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    position: 'relative',
  },
});
