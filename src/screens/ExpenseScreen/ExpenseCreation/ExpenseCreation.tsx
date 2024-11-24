import {View, Animated} from 'react-native';
import React, {SetStateAction, useRef, useState} from 'react';
import FormModal from '@trackingPortal/components/FormModal';
import {Formik} from 'formik';

import {
  EAddExpenseFields,
  CreateExpenseSchema,
} from '@trackingPortal/screens/ExpenseScreen/ExpenseCreation/ExpenseCreation.constants';
import ExpenseForm from '@trackingPortal/screens/ExpenseScreen/ExpenseForm';

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
      {({resetForm, handleSubmit}) => {
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
              children={<ExpenseForm />}
            />
          </View>
        );
      }}
    </Formik>
  );
};

export default ExpenseCreation;
