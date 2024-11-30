import {View, Pressable, Animated, StyleSheet} from 'react-native';
import React, {useRef, useState} from 'react';
import {useFormikContext} from 'formik';
import {EAddLoanFields} from '@trackingPortal/screens/LoanScreen';
import {Button, TextInput} from 'react-native-paper';
import {FormikSelectField, FormikTextInput} from '@trackingPortal/components';
import DatePicker from 'react-native-date-picker';
import dayjs from 'dayjs';
import {darkTheme} from '@trackingPortal/themes/darkTheme';
import {LoanType} from '@trackingPortal/api/enums';

export default function LoanForm() {
  const {values, setFieldValue} = useFormikContext<any>();
  const [pickerVisible, setPickerVisible] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;

  const animatePicker = () => {
    if (pickerVisible) {
      Animated.timing(animatedHeight, {
        toValue: 0,
        duration: 320,
        useNativeDriver: false,
      }).start(() => setPickerVisible(false));
    } else {
      setPickerVisible(true);
      Animated.timing(animatedHeight, {
        toValue: 300,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

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
          value={dayjs(values[EAddLoanFields.DEADLINE]).format('DD MMM YYYY')}
          editable={false}
          pointerEvents="none"
        />
        <Pressable
          style={StyleSheet.absoluteFillObject}
          onPress={animatePicker}
        />
      </View>
      <Animated.View style={[styles.animatedPicker, {height: animatedHeight}]}>
        {pickerVisible && (
          <View style={styles.datePickerContainer}>
            <DatePicker
              date={values[EAddLoanFields.DEADLINE]}
              mode="date"
              onDateChange={selectedDate => {
                setFieldValue(EAddLoanFields.DEADLINE, selectedDate);
              }}
            />
            <Button onPress={animatePicker}>Done</Button>
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    position: 'relative',
  },
  animatedPicker: {
    overflow: 'hidden',
  },
  datePickerContainer: {
    backgroundColor: darkTheme.colors.surface,
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
});
