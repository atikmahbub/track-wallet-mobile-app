import {View, Pressable, StyleSheet} from 'react-native';
import React, {Fragment, useMemo, useState} from 'react';
import {useFormikContext} from 'formik';
import {EAddInvestFormFields} from '@trackingPortal/screens/InvestScreen';
import {TextInput} from 'react-native-paper';
import {FormikCheckboxField, FormikTextInput} from '@trackingPortal/components';
import DatePicker from 'react-native-date-picker';
import dayjs from 'dayjs';

interface IInvestForm {
  update?: boolean;
}

const InvestForm: React.FC<IInvestForm> = ({update}) => {
  const {values, setFieldValue} = useFormikContext<any>();
  const [startPickerVisible, setStartPickerVisible] = useState(false);
  const [endPickerVisible, setEndPickerVisible] = useState(false);
  const startDateValue = values[EAddInvestFormFields.START_DATE];
  const endDateValue = values[EAddInvestFormFields.END_DATE];

  const resolveDate = (value: any) => {
    if (value instanceof Date && !isNaN(value.getTime())) {
      return value;
    }
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  };

  const startDate = useMemo(
    () => resolveDate(startDateValue),
    [startDateValue],
  );

  const endDate = useMemo(
    () => resolveDate(endDateValue),
    [endDateValue],
  );

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
          value={dayjs(startDate).format('DD MMM YYYY')}
          editable={false}
          pointerEvents="none"
        />
        <Pressable
          style={StyleSheet.absoluteFillObject}
          onPress={() => setStartPickerVisible(true)}
        />
      </View>
      <DatePicker
        modal
        mode="date"
        open={startPickerVisible}
        date={startDate}
        theme="dark"
        onConfirm={selectedDate => {
          setFieldValue(EAddInvestFormFields.START_DATE, selectedDate);
          setStartPickerVisible(false);
        }}
        onCancel={() => setStartPickerVisible(false)}
      />

      {update && (
        <Fragment>
          <View style={styles.inputWrapper}>
            <TextInput
              mode="outlined"
              label="End Date"
              value={dayjs(endDate).format('DD MMM YYYY')}
              editable={false}
              pointerEvents="none"
            />
            <Pressable
              style={StyleSheet.absoluteFillObject}
              onPress={() => setEndPickerVisible(true)}
            />
          </View>
          <DatePicker
            modal
            mode="date"
            open={endPickerVisible}
            date={endDate}
            theme="dark"
            onConfirm={selectedDate => {
              setFieldValue(EAddInvestFormFields.END_DATE, selectedDate);
              setEndPickerVisible(false);
            }}
            onCancel={() => setEndPickerVisible(false)}
          />
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
});
