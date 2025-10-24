import React, {useEffect, useState} from 'react';
import ExpenseSummary from '@trackingPortal/screens/ExpenseScreen/ExpenseSummary';
import {AnimatedFAB} from 'react-native-paper';
import {FlatList, StyleSheet, RefreshControl, View} from 'react-native';
import ExpenseList from '@trackingPortal/screens/ExpenseScreen/ExpenseList';
import ExpenseCreation from '@trackingPortal/screens/ExpenseScreen/ExpenseCreation';
import {useStoreContext} from '@trackingPortal/contexts/StoreProvider';
import {ExpenseModel, MonthlyLimitModel} from '@trackingPortal/api/models';
import dayjs from 'dayjs';
import {Month, UnixTimeStampString, Year} from '@trackingPortal/api/primitives';
import Toast from 'react-native-toast-message';
import {AnimatedLoader} from '@trackingPortal/components';
import notifee from '@notifee/react-native';

import HapticFeedback from 'react-native-haptic-feedback';
import {withHaptic} from '@trackingPortal/utils/haptic';
import {colors} from '@trackingPortal/themes/colors';

export default function ExpenseScreen() {
  const {currentUser: user} = useStoreContext();
  const [hideFabIcon, setHideFabIcon] = useState<boolean>(false);
  const [openCreationForm, setOpenCreationModal] = useState<boolean>(false);
  const {apiGateway} = useStoreContext();
  const [expenses, setExpenses] = useState<ExpenseModel[]>([]);
  const [filterMonth, setFilterMonth] = useState(dayjs(new Date()));
  const [monthLimit, setMonthLimit] = useState<MonthlyLimitModel>(
    {} as MonthlyLimitModel,
  );
  const [combinedLoading, setCombinedLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [limitLoading, setLimitLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user.userId && !user.default) {
      loadData();
    }
  }, [user, filterMonth]);

  const loadData = async () => {
    try {
      await Promise.all([getExpenses(), getMonthlyLimit()]);
    } catch (error) {
      console.error('Error loading data', error);
    } finally {
      setCombinedLoading(false);
    }
  };

  const getExpenses = async () => {
    try {
      setLoading(true);
      const response = await apiGateway.expenseService.getExpenseByUser({
        userId: user.userId,
        date: dayjs(filterMonth).unix() as unknown as UnixTimeStampString,
      });
      setExpenses(response);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
      });
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  const getMonthlyLimit = async () => {
    try {
      setLimitLoading(true);
      const monthlyLimit =
        await apiGateway.monthlyLimitService.getMonthlyLimitByUserId({
          userId: user.userId,
          month: (filterMonth.month() + 1) as Month,
          year: filterMonth.year() as Year,
        });
      setMonthLimit(monthlyLimit);
    } catch (error) {
      console.log(error);
    } finally {
      setLimitLoading(false);
    }
  };

  const getExceedExpenseNotification = async () => {
    if (!user.userId) return;
    try {
      const response =
        await apiGateway.expenseService.exceedExpenseNotification(user.userId);
      if (response) {
        await notifee.displayNotification({
          title: 'Expense Alert',
          body: 'You have exceeded your monthly expense limit!.',
          android: {
            channelId: 'default',
          },
        });
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const totalExpense = expenses.reduce((acc, crr): number => {
    acc += crr.amount;
    return acc;
  }, 0);

  const onRefresh = async () => {
    setRefreshing(true);
    setCombinedLoading(true);
    await loadData();
    setRefreshing(false);
  };

  if (combinedLoading || loading || limitLoading) {
    return <AnimatedLoader />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={expenses}
        keyExtractor={(item, index) => `${item.id || index}`}
        ListHeaderComponent={
          <View>
            <ExpenseSummary
              totalExpense={totalExpense}
              filterMonth={filterMonth}
              monthLimit={monthLimit}
              getMonthlyLimit={getMonthlyLimit}
            />
          </View>
        }
        ListFooterComponent={
          <ExpenseList
            notifyRowOpen={value => setHideFabIcon(value)}
            filteredMonth={filterMonth}
            setFilteredMonth={setFilterMonth}
            expenses={expenses}
            getUserExpenses={getExpenses}
          />
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={null}
        contentContainerStyle={styles.listContent}
      />
      <ExpenseCreation
        openCreationModal={openCreationForm}
        setOpenCreationModal={setOpenCreationModal}
        getUserExpenses={getExpenses}
        getExceedExpenseNotification={getExceedExpenseNotification}
      />
      {!hideFabIcon && (
        <AnimatedFAB
          extended={false}
          icon={'plus'}
          animateFrom={'right'}
          iconMode={'static'}
          label="Add New"
          color={colors.text}
          style={styles.fabStyle}
          onPress={() =>
            withHaptic(() => {
              setOpenCreationModal(true);
            })
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  fabStyle: {
    bottom: 3,
    right: 24,
    position: 'absolute',
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: {width: 0, height: 12},
    elevation: 10,
  },
  listContent: {
    paddingBottom: 180,
    paddingTop: 8,
  },
});
