import React, {useCallback} from 'react';
import {ActivityIndicator, FlatList, StyleSheet, Text, View} from 'react-native';
import CategoryChip from '@trackingPortal/screens/ExpenseScreen/components/CategoryChip';
import {ExpenseCategoryModel} from '@trackingPortal/api/models';
import {colors} from '@trackingPortal/themes/colors';

interface CategorySelectorProps {
  categories: ExpenseCategoryModel[];
  selectedCategoryId?: string;
  onSelect: (categoryId: string) => void;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategoryId,
  onSelect,
  loading,
  error,
  onRetry,
}) => {
  const renderItem = useCallback(
    ({item}: {item: ExpenseCategoryModel}) => (
      <CategoryChip
        label={item.name}
        color={item.color}
        icon={item.icon}
        active={item.id === selectedCategoryId}
        onPress={() => onSelect(item.id)}
      />
    ),
    [onSelect, selectedCategoryId],
  );

  if (loading && !categories.length) {
    return (
      <View style={styles.fallbackContainer}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!loading && !categories.length) {
    return (
      <View style={styles.fallbackContainer}>
        <Text style={styles.placeholder}>No categories yet</Text>
        {error ? (
          <Text style={styles.helper}>Pull to refresh or tap retry.</Text>
        ) : null}
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      {error ? (
        <Text style={styles.errorText} onPress={onRetry}>
          {onRetry ? 'Could not update categories. Tap to retry.' : error}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: 4,
    paddingRight: 12,
  },
  separator: {
    width: 12,
  },
  fallbackContainer: {
    minHeight: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  placeholder: {
    color: colors.subText,
    fontSize: 13,
  },
  helper: {
    color: colors.subText,
    fontSize: 12,
    marginTop: 4,
  },
  errorText: {
    color: colors.warning,
    fontSize: 12,
    marginTop: 6,
  },
});

export default CategorySelector;
