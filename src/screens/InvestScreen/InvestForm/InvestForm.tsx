import {View, Pressable, Animated, StyleSheet} from 'react-native';
import React, {Fragment, useRef, useState} from 'react';
import {useFormikContext} from 'formik';
import {EAddInvestFormFields} from '@trackingPortal/screens/InvestScreen';
import {Button, TextInput} from 'react-native-paper';
import {FormikCheckboxField, FormikTextInput} from '@trackingPortal/components';
import DatePicker from 'react-native-date-picker';
import dayjs from 'dayjs';
import {darkTheme} from '@trackingPortal/themes/darkTheme';

interface IInvestForm {
  update?: boolean;
}

const InvestForm: React.FC<IInvestForm> = ({update}) => {
  const {values, setFieldValue} = useFormikContext<any>();
  const [pickerVisible, setPickerVisible] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;

  const [pickerVisible1, setPickerVisible1] = useState(false);
  const animatedHeight1 = useRef(new Animated.Value(0)).current;

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

  const animatePicker1 = () => {
    if (pickerVisible1) {
      Animated.timing(animatedHeight1, {
        toValue: 0,
        duration: 320,
        useNativeDriver: false,
      }).start(() => setPickerVisible1(false));
    } else {
      setPickerVisible1(true);
      Animated.timing(animatedHeight1, {
        toValue: 300,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  return (
    <View style={{gap: 16}}>
      <FormikTextInput name={EAddInvestFormFields.NAME} label="Name" />
      <FormikTextInput
        name={EAddInvestFormFields.AMOUNT}
        label="Amount"
        keyboardType="numeric"
      />
      <FormikTextInput
        name={EAddInvestFormFields.NOTE}
        label="Note"
        multiline
        minRows={3}
      />
      <View style={styles.inputWrapper}>
        <TextInput
          mode="outlined"
          label="Start Date"
          value={dayjs(values[EAddInvestFormFields.START_DATE]).format(
            'DD MMM YYYY',
          )}
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
              date={values[EAddInvestFormFields.START_DATE]}
              mode="date"
              onDateChange={selectedDate => {
                setFieldValue(EAddInvestFormFields.START_DATE, selectedDate);
              }}
            />
            <Button onPress={animatePicker}>Done</Button>
          </View>
        )}
      </Animated.View>

      {update && (
        <Fragment>
          <View style={styles.inputWrapper}>
            <TextInput
              mode="outlined"
              label="End Date"
              value={dayjs(values[EAddInvestFormFields.END_DATE]).format(
                'DD MMM YYYY',
              )}
              editable={false}
              pointerEvents="none"
            />
            <Pressable
              style={StyleSheet.absoluteFillObject}
              onPress={animatePicker1}
            />
          </View>
          <Animated.View
            style={[styles.animatedPicker, {height: animatedHeight1}]}>
            {pickerVisible1 && (
              <View style={styles.datePickerContainer}>
                <DatePicker
                  date={values[EAddInvestFormFields.END_DATE]}
                  mode="date"
                  onDateChange={selectedDate => {
                    setFieldValue(EAddInvestFormFields.END_DATE, selectedDate);
                  }}
                />
                <Button onPress={animatePicker1}>Done</Button>
              </View>
            )}
          </Animated.View>
          <FormikTextInput
            name={EAddInvestFormFields.EARNED}
            label="Profit (with capital)"
            keyboardType="numeric"
          />
          <FormikCheckboxField
            label="Mark as completed"
            name={EAddInvestFormFields.STATUS}
          />
        </Fragment>
      )}
    </View>
  );
};

export default InvestForm;

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
