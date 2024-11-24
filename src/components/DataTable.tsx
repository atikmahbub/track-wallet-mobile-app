import React, {useRef, useEffect, useCallback} from 'react';
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
  renderSwipeActions?: (id: number, close: () => void) => React.ReactNode;
}

const DataTable: React.FC<DataTableProps> = ({
  headers,
  data,
  onDelete,
  isAnyRowOpen,
  expandedRowId,
  setExpandedRowId,
  renderCollapsibleContent,
  renderSwipeActions,
}) => {
  const swipeableRefs = useRef<{[key: string]: any}>({});

  const handleEditToggle = useCallback(
    (id: number) => {
      swipeableRefs.current[id]?.close();
      setExpandedRowId(expandedRowId === id ? null : id);
    },
    [expandedRowId, setExpandedRowId],
  );

  const handleDelete = useCallback(
    (id: number) => {
      swipeableRefs.current[id]?.close();
      Alert.alert('Delete Row', 'Are you sure?', [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Delete', onPress: () => onDelete(id)},
      ]);
    },
    [onDelete],
  );

  useEffect(() => {
    isAnyRowOpen(expandedRowId !== null);
  }, [isAnyRowOpen, expandedRowId]);

  const defaultSwipeActions = useCallback(
    (id: number, close: () => void) => (
      <View style={styles.swipeActions}>
        <TouchableOpacity
          style={styles.editAction}
          onPress={() => {
            close();
            handleEditToggle(id);
          }}>
          <Icon name="edit" size={24} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteAction}
          onPress={() => {
            close();
            handleDelete(id);
          }}>
          <Icon name="delete" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    ),
    [handleEditToggle, handleDelete],
  );

  const renderRow = ({item}: {item: any}) => {
    const isRowOpen = expandedRowId === item.id;
    return (
      <Swipeable
        ref={ref => (swipeableRefs.current[item.id] = ref)}
        renderRightActions={
          !isRowOpen
            ? () =>
                renderSwipeActions
                  ? renderSwipeActions(item.id, () =>
                      swipeableRefs.current[item.id]?.close(),
                    )
                  : defaultSwipeActions(item.id, () =>
                      swipeableRefs.current[item.id]?.close(),
                    )
            : undefined
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
            {renderCollapsibleContent(item)}
          </View>
        </Collapsible>
      </Swipeable>
    );
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No data available</Text>
    </View>
  );

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
        nestedScrollEnabled={true}
        ListEmptyComponent={renderEmptyComponent}
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
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  emptyText: {
    color: colors.text,
    fontSize: 16,
    textAlign: 'center',
  },
});
