import {View, StyleSheet, Pressable, Animated} from 'react-native';
import React, {SetStateAction, useRef, useState} from 'react';
import FormModal from '@trackingPortal/components/FormModal';
import {Formik} from 'formik';
import {TextInput, Button} from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import {darkTheme} from '@trackingPortal/themes/darkTheme';
import {FormikTextInput} from '@trackingPortal/components';
import {
  EAddExpenseFields,
  CreateExpenseSchema,
} from '@trackingPortal/screens/ExpenseScreen/ExpenseCreation/ExpenseCreation.constants';
import dayjs from 'dayjs';

interface IExpenseCreation {
  openCreationModal: boolean;
  setOpenCreationModal: React.Dispatch<SetStateAction<boolean>>;
}

const ExpenseCreation: React.FC<IExpenseCreation> = ({
  openCreationModal,
  setOpenCreationModal,
}) => {
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

  const handleAddExpense = (values: any) => {
    console.log('Expense Added:', values);
  };

  return (
    <Formik
      initialValues={{
        [EAddExpenseFields.DATE]: new Date(),
        [EAddExpenseFields.DESCRIPTION]: '',
        [EAddExpenseFields.AMOUNT]: '',
      }}
      onSubmit={handleAddExpense}
      validationSchema={CreateExpenseSchema}>
      {({resetForm, setFieldValue, values, validateForm, handleSubmit}) => {
        return (
          <View>
            <FormModal
              title="Add a new Expense"
              isVisible={openCreationModal}
              onClose={() => {
                setOpenCreationModal(false);
                resetForm();
              }}
              onSave={handleSubmit}
              children={
                <View style={{gap: 16}}>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      mode="outlined"
                      label="Select Date"
                      value={dayjs(values[EAddExpenseFields.DATE]).format(
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
                  <Animated.View
                    style={[styles.animatedPicker, {height: animatedHeight}]}>
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
                  <FormikTextInput
                    name={EAddExpenseFields.DESCRIPTION}
                    label="Purpose"
                  />
                  <FormikTextInput
                    name={EAddExpenseFields.AMOUNT}
                    label="Amount"
                    keyboardType="numeric"
                  />
                </View>
              }
            />
          </View>
        );
      }}
    </Formik>
  );
};

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

export default ExpenseCreation;
