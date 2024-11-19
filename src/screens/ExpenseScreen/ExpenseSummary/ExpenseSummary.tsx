import {View, StyleSheet} from 'react-native';
import React from 'react';
import {darkTheme} from '@trackingPortal/themes/darkTheme';
import {Card} from 'react-native-paper';
import {ValueWithLabel} from '@trackingPortal/components';
import dayjs from 'dayjs';

export default function ExpenseSummary() {
  return (
    <View style={styles.mainContainer}>
      <Card style={styles.summaryCard} mode="elevated">
        <Card.Title
          title="Summary"
          titleStyle={{
            fontSize: 16,
            fontWeight: 700,
          }}>
          Expense
        </Card.Title>
        <Card.Content>
          <ValueWithLabel
            label="Month"
            value={dayjs(new Date()).format('MMMM, YYYY')}
          />
          <ValueWithLabel label="Total Spend" value="23K" />
          <ValueWithLabel label="Limit" value="80K" />
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    padding: 10,
  },
  summaryCard: {
    backgroundColor: darkTheme.colors.surface,
    marginTop: 20,
  },
});
