import React, {useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {colors} from '@trackingPortal/themes/colors';

interface DataTableProps {
  headers: string[];
  data: Array<{[key: string]: any}>;
  onDelete: (id: string | number) => void;
  isAnyRowOpen: (value: boolean) => void;
  expandedRowId: number | null;
  setExpandedRowId: React.Dispatch<React.SetStateAction<number | null>>;
  renderCollapsibleContent: (item: any) => React.ReactNode;
}

const DataTable: React.FC<DataTableProps> = ({
  headers,
  data,
  onDelete,
  isAnyRowOpen,
  expandedRowId,
  setExpandedRowId,
  renderCollapsibleContent,
}) => {
  const swipeableRefs = useRef<{[key: string]: any}>({});

  const handleEditToggle = (id: number) => {
    swipeableRefs.current[id]?.close();
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  const handleDelete = (id: number) => {
    swipeableRefs.current[id]?.close();
    Alert.alert('Delete Row', 'Are you sure?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Delete', onPress: () => onDelete(id)},
    ]);
  };

  useEffect(() => {
    isAnyRowOpen(expandedRowId !== null);
  }, [isAnyRowOpen, expandedRowId]);

  const renderSwipeActions = (id: number) => (
    <View style={styles.swipeActions}>
      <TouchableOpacity
        style={styles.editAction}
        onPress={() => handleEditToggle(id)}>
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
    const isRowOpen = expandedRowId === item.id;

    return (
      <Swipeable
        ref={ref => (swipeableRefs.current[item.id] = ref)}
        renderRightActions={
          !isRowOpen ? () => renderSwipeActions(item.id) : undefined
        }
        enabled={!isRowOpen}>
        <View style={styles.row}>
          {headers.map(header => (
            <Text style={styles.cell} key={header}>
              {item[header]}
            </Text>
          ))}
        </View>
        <Collapsible collapsed={!isRowOpen}>
          <View style={styles.collapsibleContent}>
            {renderCollapsibleContent(item)}{' '}
            {/* Pass row data to renderCollapsibleContent */}
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
      />
    </View>
  );
};

export default DataTable;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.background,
    marginTop: 20,
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
});
