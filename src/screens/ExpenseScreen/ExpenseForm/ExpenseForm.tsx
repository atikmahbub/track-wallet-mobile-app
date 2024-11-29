import {View, Pressable, Animated, StyleSheet} from 'react-native';
import React, {useRef, useState} from 'react';
import {useFormikContext} from 'formik';
import {EAddExpenseFields} from '@trackingPortal/screens/ExpenseScreen/ExpenseCreation/ExpenseCreation.constants';
import {Button, TextInput} from 'react-native-paper';
import {FormikTextInput} from '@trackingPortal/components';
import DatePicker from 'react-native-date-picker';
import dayjs from 'dayjs';
import {darkTheme} from '@trackingPortal/themes/darkTheme';

export default function ExpenseForm() {
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
      <View style={styles.inputWrapper}>
        <TextInput
          mode="outlined"
          label="Select Date"
          value={dayjs(values[EAddExpenseFields.DATE]).format('DD MMM YYYY')}
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
              date={values[EAddExpenseFields.DATE]}
              mode="date"
              onDateChange={selectedDate => {
                setFieldValue(EAddExpenseFields.DATE, selectedDate);
              }}
            />
            <Button onPress={animatePicker}>Done</Button>
          </View>
        )}
      </Animated.View>
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
