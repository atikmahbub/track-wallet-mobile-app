import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/MaterialIcons';

const colors = {
  background: '#2A0845',
  surface: '#3E206D',
  text: '#E1BEE7',
  primary: '#BB86FC',
  accent: '#9C27B0',
  disabled: '#7B1FA2',
  placeholder: '#CE93D8',
  error: '#CF6679',
};

interface DataTableProps {
  headers: string[];
  data: Array<{[key: string]: any}>;
  onEdit: (id: string | number, updatedData: any) => void;
  onDelete: (id: string | number) => void;
  isAnyRowOpen: (value: boolean) => void;
}

const DataTable: React.FC<DataTableProps> = ({
  headers,
  data,
  onEdit,
  onDelete,
  isAnyRowOpen,
}) => {
  const [openRow, setOpenRow] = useState<number | null>(null);
  const [editedRow, setEditedRow] = useState<any>(null);
  const swipeableRefs = useRef<{[key: string]: any}>({});

  const handleEdit = (id: number) => {
    swipeableRefs.current[id]?.close();
    setOpenRow(openRow === id ? null : id);
    setEditedRow(data.find(row => row.id === id));
  };

  const handleDelete = (id: number) => {
    swipeableRefs.current[id]?.close();
    Alert.alert('Delete Row', 'Are you sure?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Delete', onPress: () => onDelete(id)},
    ]);
  };

  const handleSave = (id: number) => {
    if (editedRow) {
      onEdit(id, editedRow);
      setOpenRow(null); // Close collapse
    }
  };

  useEffect(() => {
    isAnyRowOpen(openRow !== null);
  }, [isAnyRowOpen, openRow]);

  const renderSwipeActions = (id: number) => (
    <View style={styles.swipeActions}>
      <TouchableOpacity
        style={styles.editAction}
        onPress={() => handleEdit(id)}>
        <Icon name="edit" size={24} color="#FFF" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={() => handleDelete(id)}>
        <Icon name="delete" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );

  const renderRow = ({item}: {item: any}) => {
    const isRowOpen = openRow === item.id;

    return (
      <Swipeable
        ref={ref => (swipeableRefs.current[item.id] = ref)}
        renderRightActions={
          !isRowOpen ? () => renderSwipeActions(item.id) : undefined
        } // Hide swipe actions if row is open
        enabled={!isRowOpen}>
        <View style={styles.row}>
          {headers.map(header => (
            <Text style={styles.cell} key={header}>
              {item[header]}
            </Text>
          ))}
        </View>
        <Collapsible collapsed={openRow !== item.id}>
          <View style={styles.collapsibleContent}>
            {headers.map(header => (
              <View key={header} style={styles.editField}>
                <Text style={styles.label}>{header}</Text>
                <TextInput
                  style={styles.input}
                  value={editedRow?.[header] || ''}
                  onChangeText={text =>
                    setEditedRow((prev: any) => ({...prev, [header]: text}))
                  }
                  placeholderTextColor={colors.placeholder}
                />
              </View>
            ))}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginTop: 5,
              }}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setOpenRow(null)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => handleSave(item.id)}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Collapsible>
      </Swipeable>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        {headers.map(header => (
          <Text style={styles.headerCell} key={header}>
            {header.toUpperCase()}
          </Text>
        ))}
      </View>
      <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        renderItem={renderRow}
        contentContainerStyle={styles.table}
        scrollEnabled={false}
      />
    </View>
  );
};

export default DataTable;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.background,
    marginTop: 20, // Only marginTop applied
  },
  header: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    padding: 10,
  },
  headerCell: {
    flex: 1,
    color: colors.text,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  table: {
    backgroundColor: colors.background,
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.disabled,
  },
  cell: {
    flex: 1,
    color: colors.text,
    textAlign: 'center',
    fontSize: 16,
  },
  swipeActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editAction: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
    height: '100%',
  },
  deleteAction: {
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
    height: '100%',
  },
  collapsibleContent: {
    backgroundColor: colors.surface,
    padding: 10,
  },
  editField: {
    marginBottom: 10,
  },
  label: {
    color: colors.text,
    marginBottom: 5,
  },
  input: {
    backgroundColor: colors.background,
    color: colors.text,
    padding: 10,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: colors.accent,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: colors.text,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  cancelButtonText: {
    color: colors.text,
    fontWeight: 'bold',
  },
});
