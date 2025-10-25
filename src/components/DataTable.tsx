import React, {useRef, useEffect, useCallback} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, Alert} from 'react-native';
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
        <View style={styles.swipeActionsBackdrop} />
        <View style={styles.swipeActionsContent}>
          <TouchableOpacity
            style={[styles.swipeActionButton, styles.editAction]}
            activeOpacity={0.9}
          onPress={() => {
            close();
            handleEditToggle(id);
          }}>
          <View style={[styles.actionIconBadge, styles.editBadge]}>
            <Icon name="edit" size={18} color="#10192e" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.swipeActionButton, styles.deleteAction]}
          activeOpacity={0.9}
          onPress={() => {
            close();
            handleDelete(id);
          }}>
          <View style={[styles.actionIconBadge, styles.deleteBadge]}>
            <Icon name="delete" size={18} color="#280c12" />
          </View>
        </TouchableOpacity>
      </View>
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
        <View style={styles.rowWrapper}>
          <View style={[styles.row, isRowOpen && styles.rowActive]}>
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
        </View>
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
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    marginHorizontal: 4,
  },
  headerCell: {
    flex: 1,
    color: colors.subText,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 1.2,
    fontSize: 12,
  },
  table: {
    paddingVertical: 12,
  },
  rowWrapper: {
    marginHorizontal: 4,
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 8,
  },
  rowActive: {
    backgroundColor: 'rgba(94, 92, 230, 0.18)',
  },
  cell: {
    flex: 1,
    color: colors.text,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '500',
  },
  swipeActions: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'flex-end',
    height: '100%',
    paddingHorizontal: 12,
  },
  swipeActionsBackdrop: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 22,
    backgroundColor: 'rgba(5, 11, 26, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(94, 92, 230, 0.22)',
  },
  swipeActionsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  swipeActionButton: {
    width: 72,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 10},
    elevation: 6,
  },
  editAction: {
    backgroundColor: 'rgba(94, 92, 230, 0.35)',
  },
  deleteAction: {
    backgroundColor: 'rgba(255, 69, 94, 0.32)',
  },
  actionIconBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBadge: {
    backgroundColor: 'rgba(231, 233, 255, 0.9)',
  },
  deleteBadge: {
    backgroundColor: 'rgba(255, 214, 222, 0.88)',
  },
  collapsibleContent: {
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: colors.glassBorder,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    marginTop: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
  },
  emptyText: {
    color: colors.subText,
    fontSize: 16,
    textAlign: 'center',
  },
});
