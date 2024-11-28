import {View, Text, StyleSheet, TouchableOpacity, Animated} from 'react-native';
import React, {
  FC,
  Fragment,
  SetStateAction,
  useCallback,
  useRef,
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
import {makeUnixTimestampToNumber} from '@trackingPortal/api/primitives';

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
  const [editedRow, setEditedRow] = useState<any>(null);
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

  const handleEditSave = (id: number) => {
    // setData(prevData =>
    //   prevData.map(row => (row.id === id ? {...row, ...editedRow} : row)),
    // );
    setExpandedRowId(null);
    setEditedRow(null);
  };

  const renderCollapsibleContent = (item: any) => {
    return (
      <Formik
        initialValues={{
          [EAddExpenseFields.DATE]: new Date(),
          [EAddExpenseFields.DESCRIPTION]: '',
          [EAddExpenseFields.AMOUNT]: '',
        }}
        onSubmit={() => {}}
        validationSchema={CreateExpenseSchema}>
        {() => {
          return (
            <Fragment>
              <ExpenseForm />
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setExpandedRowId(null)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => handleEditSave(item.id)}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </Fragment>
          );
        }}
      </Formik>
    );
  };

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
            onDelete={() => {}}
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
  },
  saveButton: {
    backgroundColor: colors.accent,
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  saveButtonText: {
    color: colors.text,
    fontWeight: 'bold',
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
