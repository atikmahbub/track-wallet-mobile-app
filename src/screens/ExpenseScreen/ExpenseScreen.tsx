import React, {Fragment, useEffect, useState} from 'react';

import ExpenseSummary from '@trackingPortal/screens/ExpenseScreen/ExpenseSummary';
import {AnimatedFAB} from 'react-native-paper';
import {ScrollView, StyleSheet} from 'react-native';
import {darkTheme} from '@trackingPortal/themes/darkTheme';
import ExpenseList from '@trackingPortal/screens/ExpenseScreen/ExpenseList';
import ExpenseCreation from '@trackingPortal/screens/ExpenseScreen/ExpenseCreation';
import {useStoreContext} from '@trackingPortal/contexts/StoreProvider';

export default function ExpenseScreen() {
  const [hideFabIcon, setHideFabIcon] = useState<boolean>(false);
  const [openCreationForm, setOpenCreationModal] = useState<boolean>(false);
  const {apiGateway} = useStoreContext();

  // useEffect(() => {
  //   getExpenses();
  // }, []);

  // const getExpenses = async () => {
  //   try {
  //     const response = apiGateway.expenseService.getExpenseByUser();
  //   } catch (error) {}
  // };

  return (
    <Fragment>
      <ScrollView>
        <ExpenseSummary />
        <ExpenseList notifyRowOpen={value => setHideFabIcon(value)} />
        <ExpenseCreation
          openCreationModal={openCreationForm}
          setOpenCreationModal={setOpenCreationModal}
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
