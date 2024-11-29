import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {
  FC,
  Fragment,
  SetStateAction,
  useCallback,
  useState,
} from 'react';
import {Button, Card} from 'react-native-paper';
import {darkTheme} from '@trackingPortal/themes/darkTheme';
import dayjs, {Dayjs} from 'dayjs';

import MonthPicker from 'react-native-month-year-picker';
import DataTable from '@trackingPortal/components/DataTable';
import {colors} from '@trackingPortal/themes/colors';
import {Formik} from 'formik';
import {
  CreateExpenseSchema,
  EAddExpenseFields,
} from '@trackingPortal/screens/ExpenseScreen/ExpenseCreation/ExpenseCreation.constants';
import ExpenseForm from '@trackingPortal/screens/ExpenseScreen/ExpenseForm';
import {ExpenseModel} from '@trackingPortal/api/models';
import {
  ExpenseId,
  makeUnixTimestampString,
  makeUnixTimestampToNumber,
} from '@trackingPortal/api/primitives';
import {useStoreContext} from '@trackingPortal/contexts/StoreProvider';
import {IUpdateExpenseParams} from '@trackingPortal/api/params';
import Toast from 'react-native-toast-message';
import {AnimatedLoader, LoadingButton} from '@trackingPortal/components';

interface IExpenseList {
  notifyRowOpen: (value: boolean) => void;
  setFilteredMonth: React.Dispatch<SetStateAction<Dayjs>>;
  filteredMonth: Dayjs;
  expenses: ExpenseModel[];
  getUserExpenses: () => void;
}

const headers = ['Date', 'Purpose', 'Amount'];

const ExpenseList: FC<IExpenseList> = ({
  notifyRowOpen,
  setFilteredMonth,
  filteredMonth,
  expenses,
  getUserExpenses,
}) => {
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
  const [openPicker, setOpenPicker] = useState<boolean>(false);
  const {currentUser: user, apiGateway} = useStoreContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const onValueChange = useCallback(
    (event: any, newDate: any) => {
      const selectedDate = newDate || filteredMonth;
      setOpenPicker(false);
      if (selectedDate) {
        setFilteredMonth(dayjs(selectedDate));
      }
    },
    [filteredMonth, setOpenPicker],
  );

  const onExpenseEdit = async (
    values: any,
    {resetForm}: any,
    id: ExpenseId,
  ) => {
    if (user.default) return;

    try {
      setLoading(true);
      const params: IUpdateExpenseParams = {
        id: id,
        amount: Number(values.amount),
        date: makeUnixTimestampString(Number(new Date(values.date))),
        description: values.description,
      };
      await apiGateway.expenseService.updateExpense(params);
      await getUserExpenses();
      Toast.show({
        type: 'success',
        text1: 'Expense updated successfully!',
      });
    } catch (error) {
      console.log('error', error);
      Toast.show({
        type: 'error',
        text1: 'Something went wrong!',
      });
    } finally {
      resetForm();
      setExpandedRowId(null);
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (rowId: any) => {
    if (!rowId) return;
    try {
      setDeleteLoading(true);
      await apiGateway.expenseService.deleteExpense(rowId);
      await getUserExpenses();
      Toast.show({
        type: 'success',
        text1: 'Deleted Successfully!',
      });
    } catch (error) {
      console.log('error', error);
      Toast.show({
        type: 'error',
        text1: 'Something went wrong!',
      });
    } finally {
      setDeleteLoading(false);
      setExpandedRowId(null);
    }
  };

  const renderCollapsibleContent = useCallback(
    (item: ExpenseModel) => {
      const selectedItem = expenses.find(expense => expense.id === item.id);
      if (!selectedItem) return null;
      const currentRowId = selectedItem.id;

      return (
        <Formik
          enableReinitialize
          initialValues={{
            id: selectedItem.id,
            [EAddExpenseFields.DATE]: new Date(
              Number(selectedItem.date) * 1000,
            ),
            [EAddExpenseFields.DESCRIPTION]: selectedItem.description || '',
            [EAddExpenseFields.AMOUNT]: selectedItem.amount.toString(),
          }}
          onSubmit={(values, formikHelpers) =>
            onExpenseEdit(values, formikHelpers, currentRowId)
          }
          validationSchema={CreateExpenseSchema}>
          {({handleSubmit}) => (
            <Fragment>
              <ExpenseForm />
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => !loading && setExpandedRowId(null)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <LoadingButton
                  label="Save"
                  loading={loading}
                  onPress={() => handleSubmit()}
                />
              </View>
            </Fragment>
          )}
        </Formik>
      );
    },
    [expenses, setExpandedRowId],
  );

  if (deleteLoading) {
    return <AnimatedLoader />;
  }

  return (
    <View style={styles.mainContainer}>
      <Card style={styles.listCard}>
        <Card.Title
          title="Expense's"
          titleStyle={{
            fontSize: 16,
            fontWeight: '700',
          }}
        />
        <Card.Actions style={styles.cardActions}>
          <Button mode="outlined" onPress={() => setOpenPicker(!openPicker)}>
            {dayjs(filteredMonth).format('MMMM YYYY')}
          </Button>
          {openPicker && (
            <MonthPicker
              onChange={onValueChange}
              value={filteredMonth.toDate()}
              locale="en"
              autoTheme={true}
            />
          )}
        </Card.Actions>
        <Card.Content>
          <DataTable
            headers={headers}
            data={expenses.map(item => {
              return {
                id: item.id,
                Date: dayjs(
                  makeUnixTimestampToNumber(Number(item.date)),
                ).format('MMM D, YYYY'),
                Purpose: item.description,
                Amount: item.amount,
              };
            })}
            onDelete={handleDeleteExpense}
            isAnyRowOpen={notifyRowOpen}
            expandedRowId={expandedRowId}
            setExpandedRowId={setExpandedRowId}
            renderCollapsibleContent={renderCollapsibleContent}
          />
        </Card.Content>
      </Card>
    </View>
  );
};

export default ExpenseList;

const styles = StyleSheet.create({
  mainContainer: {
    padding: 10,
  },
  listCard: {
    backgroundColor: darkTheme.colors.surface,
    marginTop: 20,
  },
  cardActions: {
    position: 'absolute',
    right: 0,
  },
  pickerContainer: {},
  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    paddingBottom: 20,
    gap: 10,
  },
  cancelButton: {
    backgroundColor: colors.disabled,
    padding: 10,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: colors.text,
    fontWeight: 'bold',
  },
});
