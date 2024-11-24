import {
  View,
  Text,
  StyleSheet,
  NativeSyntheticEvent,
  TouchableOpacity,
} from 'react-native';
import React, {FC, useCallback, useState} from 'react';
import {Button, Card, TextInput} from 'react-native-paper';
import {darkTheme} from '@trackingPortal/themes/darkTheme';
import dayjs from 'dayjs';

import MonthPicker, {EventTypes} from 'react-native-month-year-picker';
import DataTable from '@trackingPortal/components/DataTable';
import {colors} from '@trackingPortal/themes/colors';

interface IExpenseList {
  notifyRowOpen: (value: boolean) => void;
}

const headers = ['Date', 'Purpose', 'Amount'];
const data = [
  {id: 1, Date: 'John Doe', Purpose: 'john@.com', Amount: '30'},
  {id: 2, Date: 'Jane Smith', Purpose: 'jane@.com', Amount: '25'},
];

const ExpenseList: FC<IExpenseList> = ({notifyRowOpen}) => {
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
  const [date, setDate] = useState(new Date());
  const [openPicker, setOpenPicker] = useState<boolean>(false);
  const [editedRow, setEditedRow] = useState<any>(null);

  const onValueChange = useCallback(
    (event: any, newDate: any) => {
      const selectedDate = newDate || date;
      setOpenPicker(false);
      setDate(selectedDate);
    },
    [date, setOpenPicker],
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
      <View>
        <TextInput
          style={styles.input}
          value={editedRow?.name || item.name}
          onChangeText={text => setEditedRow({...item, name: text})}
          placeholder="Edit Name"
          placeholderTextColor={colors.placeholder}
        />
        {/* <TextInput
          style={styles.input}
          value={editedRow?.age?.toString() || item.age.toString()}
          onChangeText={text => setEditedRow({...item, age: Number(text)})}
          placeholder="Edit Age"
          placeholderTextColor={colors.placeholder}
          keyboardType="numeric"
        /> */}
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
        <TextInput
          style={styles.input}
          value={editedRow?.name || item.name}
          onChangeText={text => setEditedRow({...item, name: text})}
          placeholder="Edit Name"
          placeholderTextColor={colors.placeholder}
        />
      </View>
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
