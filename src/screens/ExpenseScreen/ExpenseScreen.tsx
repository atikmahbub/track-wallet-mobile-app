import React, {Fragment} from 'react';

import ExpenseSummary from '@trackingPortal/screens/ExpenseScreen/ExpenseSummary';
import {AnimatedFAB} from 'react-native-paper';
import {ScrollView, StyleSheet} from 'react-native';
import {darkTheme} from '@trackingPortal/themes/darkTheme';
import ExpenseList from './ExpenseList';

export default function ExpenseScreen() {
  return (
    <Fragment>
      <ScrollView>
        <ExpenseSummary />
        <ExpenseList />
      </ScrollView>
      <AnimatedFAB
        extended={false}
        icon={'plus'}
        animateFrom={'right'}
        iconMode={'static'}
        label="Add New"
        style={styles.fabStyle}
        onPress={() => {
          console.log('Pressed');
        }}
      />
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
