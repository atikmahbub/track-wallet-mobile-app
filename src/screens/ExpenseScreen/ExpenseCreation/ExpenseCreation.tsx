import {View} from 'react-native';
import React, {SetStateAction, useState} from 'react';
import FormModal from '@trackingPortal/components/FormModal';
import {Formik} from 'formik';

import {
  EAddExpenseFields,
  CreateExpenseSchema,
} from '@trackingPortal/screens/ExpenseScreen/ExpenseCreation/ExpenseCreation.constants';
import ExpenseForm from '@trackingPortal/screens/ExpenseScreen/ExpenseForm';
import {INewExpense} from '@trackingPortal/screens/ExpenseScreen/ExpenseCreation/ExpenseCreation.interfaces';
import {useStoreContext} from '@trackingPortal/contexts/StoreProvider';
import {IAddExpenseParams} from '@trackingPortal/api/params';
import {useAuth} from '@trackingPortal/auth/Auth0ProviderWithHistory';
import {makeUnixTimestampString} from '@trackingPortal/api/primitives';
import Toast from 'react-native-toast-message';
import {ExpenseCategoryModel} from '@trackingPortal/api/models';

interface IExpenseCreation {
  openCreationModal: boolean;
  setOpenCreationModal: React.Dispatch<SetStateAction<boolean>>;
  getUserExpenses: () => void;
  getExceedExpenseNotification: () => void;
  categories: ExpenseCategoryModel[];
  categoriesLoading: boolean;
  categoryError?: string | null;
  refreshCategories: () => Promise<void> | void;
  refreshAnalytics: (options?: {force?: boolean}) => Promise<void> | void;
}

const ExpenseCreation: React.FC<IExpenseCreation> = ({
  openCreationModal,
  setOpenCreationModal,
  getUserExpenses,
  getExceedExpenseNotification,
  categories,
  categoriesLoading,
  categoryError,
  refreshCategories,
  refreshAnalytics,
}) => {
  const {apiGateway} = useStoreContext();
  const {user} = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

  const handleAddExpense = async (values: INewExpense, {resetForm}: any) => {
    try {
      setLoading(true);
      const params: IAddExpenseParams = {
        userId: user.sub,
        amount: Number(values.amount),
        date: makeUnixTimestampString(Number(new Date(values.date))),
        description: values.description,
        categoryId: values.categoryId,
      };
      await apiGateway.expenseService.addExpense(params);
      await resetForm();
      await getUserExpenses();
      await refreshAnalytics({force: true});
      Toast.show({
        type: 'success',
        text1: 'Expense added successfully',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong!',
      });
    } finally {
      setLoading(false);
      setOpenCreationModal(false);
      await getExceedExpenseNotification();
    }
  };

  return (
    <Formik
      initialValues={{
        [EAddExpenseFields.DATE]: new Date(),
        [EAddExpenseFields.DESCRIPTION]: '',
        [EAddExpenseFields.AMOUNT]: '',
        [EAddExpenseFields.CATEGORY_ID]: categories[0]?.id ?? '',
      }}
      onSubmit={handleAddExpense}
      validationSchema={CreateExpenseSchema}>
      {({resetForm, handleSubmit}) => {
        return (
          <View>
            <FormModal
              title="New Entry"
              isVisible={openCreationModal}
              onClose={() => {
                setOpenCreationModal(false);
                resetForm();
              }}
              onSave={handleSubmit}
              children={
                <ExpenseForm
                  categories={categories}
                  categoriesLoading={categoriesLoading}
                  categoryError={categoryError}
                  refreshCategories={refreshCategories}
                />
              }
              loading={loading}
            />
          </View>
        );
      }}
    </Formik>
  );
};

export default ExpenseCreation;
