import React, {Fragment, useEffect, useState} from 'react';
import ExpenseSummary from '@trackingPortal/screens/ExpenseScreen/ExpenseSummary';
import {AnimatedFAB} from 'react-native-paper';
import {ScrollView, StyleSheet, RefreshControl} from 'react-native';
import ExpenseList from '@trackingPortal/screens/ExpenseScreen/ExpenseList';
import ExpenseCreation from '@trackingPortal/screens/ExpenseScreen/ExpenseCreation';
import {useStoreContext} from '@trackingPortal/contexts/StoreProvider';
import {ExpenseModel, MonthlyLimitModel} from '@trackingPortal/api/models';
import dayjs from 'dayjs';
import {Month, UnixTimeStampString, Year} from '@trackingPortal/api/primitives';
import Toast from 'react-native-toast-message';
import {AnimatedLoader} from '@trackingPortal/components';

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
  const [loading, setLoading] = useState<boolean>(false);
  const [limitLoading, setLimitLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    if (user.userId && !user.default) {
      getMonthlyLimit();
      getExpenses();
    }
  }, [user, filterMonth]);

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

  const totalExpense = expenses.reduce((acc, crr): number => {
    acc += crr.amount;
    return acc;
  }, 0);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([getExpenses(), getMonthlyLimit()]);
    setRefreshing(false);
  };

  if (loading || limitLoading) {
    return <AnimatedLoader />;
  }

  return (
    <Fragment>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <ExpenseSummary
          totalExpense={totalExpense}
          filterMonth={filterMonth}
          monthLimit={monthLimit}
          getMonthlyLimit={getMonthlyLimit}
        />
        <ExpenseList
          notifyRowOpen={value => setHideFabIcon(value)}
          filteredMonth={filterMonth}
          setFilteredMonth={setFilterMonth}
          expenses={expenses}
          getUserExpenses={getExpenses}
        />
        <ExpenseCreation
          openCreationModal={openCreationForm}
          setOpenCreationModal={setOpenCreationModal}
          getUserExpenses={getExpenses}
        />
      </ScrollView>
      {!hideFabIcon && (
        <AnimatedFAB
          extended={false}
          icon={'plus'}
          animateFrom={'right'}
          iconMode={'static'}
          label="Add New"
          style={styles.fabStyle}
          onPress={() => {
            setOpenCreationModal(true);
          }}
        />
      )}
    </Fragment>
  );
}

const styles = StyleSheet.create({
  fabStyle: {
    bottom: 25,
    right: 25,
    position: 'absolute',
  },
});
