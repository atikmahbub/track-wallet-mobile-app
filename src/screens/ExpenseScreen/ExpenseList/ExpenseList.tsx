import {View, StyleSheet, TouchableOpacity} from 'react-native';
import React, {
  FC,
  Fragment,
  SetStateAction,
  useCallback,
  useState,
} from 'react';
import {Button, Text} from 'react-native-paper';
import dayjs, {Dayjs} from 'dayjs';

import DatePicker from 'react-native-date-picker';
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
import {
  AnimatedLoader,
  LoadingButton,
  GlassCard,
} from '@trackingPortal/components';

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

  const handleDateConfirm = useCallback(
    (selectedDate: Date) => {
      setOpenPicker(false);
      if (selectedDate) {
        setFilteredMonth(dayjs(selectedDate).startOf('month'));
      }
    },
    [setFilteredMonth],
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
      <GlassCard style={styles.listCard}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Expense History</Text>
            <Text style={styles.subtitle}>
              Swipe a row to edit details or remove an expense.
            </Text>
          </View>
          <Button
            mode="contained-tonal"
            icon="calendar-month"
            uppercase={false}
            style={styles.monthButton}
            contentStyle={styles.monthButtonContent}
            labelStyle={styles.monthButtonLabel}
            onPress={() => setOpenPicker(true)}>
            {dayjs(filteredMonth).format('MMM YYYY')}
          </Button>
        </View>
        <View style={styles.tableContainer}>
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
        </View>
      </GlassCard>
      <DatePicker
        modal
        mode="date"
        theme="dark"
        open={openPicker}
        date={filteredMonth.toDate()}
        onConfirm={handleDateConfirm}
        onCancel={() => setOpenPicker(false)}
      />
    </View>
  );
};

export default ExpenseList;

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    flex: 1,
  },
  listCard: {
    marginTop: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.subText,
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
    maxWidth: 220,
  },
  monthButton: {
    borderRadius: 999,
  },
  monthButtonContent: {
    paddingHorizontal: 12,
  },
  monthButtonLabel: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  tableContainer: {
    marginTop: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    paddingBottom: 20,
    gap: 10,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  cancelButtonText: {
    color: colors.subText,
    fontWeight: '600',
  },
});
