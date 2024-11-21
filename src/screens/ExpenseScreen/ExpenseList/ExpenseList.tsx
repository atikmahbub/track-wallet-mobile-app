import {View, Text, StyleSheet, NativeSyntheticEvent} from 'react-native';
import React, {FC, useCallback, useState} from 'react';
import {Button, Card} from 'react-native-paper';
import {darkTheme} from '@trackingPortal/themes/darkTheme';
import dayjs from 'dayjs';

import MonthPicker, {EventTypes} from 'react-native-month-year-picker';
import DataTable from '@trackingPortal/components/DataTable';

interface IExpenseList {
  notifyRowOpen: (value: boolean) => void;
}

const headers = ['Date', 'Purpose', 'Amount'];
const data = [
  {id: 1, Date: 'John Doe', Purpose: 'john@.com', Amount: '30'},
  {id: 2, Date: 'Jane Smith', Purpose: 'jane@.com', Amount: '25'},
];

const ExpenseList: FC<IExpenseList> = ({notifyRowOpen}) => {
  const [date, setDate] = useState(new Date());
  const [openPicker, setOpenPicker] = useState<boolean>(false);

  const onValueChange = useCallback(
    (event: any, newDate: any) => {
      const selectedDate = newDate || date;
      setOpenPicker(false);
      setDate(selectedDate);
    },
    [date, setOpenPicker],
  );

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
            {dayjs(date).format('MMMM YYYY')}
          </Button>
          {openPicker && (
            <MonthPicker
              onChange={onValueChange}
              value={date}
              locale="en"
              autoTheme={true}
            />
          )}
        </Card.Actions>
        <Card.Content>
          <DataTable
            headers={headers}
            data={data}
            onDelete={() => {}}
            onEdit={() => {}}
            isAnyRowOpen={notifyRowOpen}
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
});
