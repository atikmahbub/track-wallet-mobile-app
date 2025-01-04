import {View, StyleSheet} from 'react-native';
import React from 'react';
import {darkTheme} from '@trackingPortal/themes/darkTheme';
import {Card} from 'react-native-paper';
import {ValueWithLabel} from '@trackingPortal/components';
import {convertToKilo, getCurrencyAmount} from '@trackingPortal/utils/utils';
import {useStoreContext} from '@trackingPortal/contexts/StoreProvider';

interface ISummary {
  totalGiven: number;
  totalBorrowed: number;
}

const LoanSummary: React.FC<ISummary> = ({
  totalGiven = 0,
  totalBorrowed = 0,
}) => {
  const {currency} = useStoreContext();
  return (
    <View style={styles.mainContainer}>
      <Card style={styles.summaryCard} mode="elevated">
        <Card.Title
          title="Summary"
          titleStyle={{
            fontSize: 16,
            fontWeight: '700',
          }}>
          Loan Summary
        </Card.Title>
        <Card.Content>
          <ValueWithLabel
            label="Total Given"
            value={getCurrencyAmount(totalGiven, currency)}
          />
          <ValueWithLabel
            label="Total Borrowed"
            value={getCurrencyAmount(totalBorrowed, currency)}
          />
        </Card.Content>
      </Card>
    </View>
  );
};

export default LoanSummary;

const styles = StyleSheet.create({
  mainContainer: {
    padding: 10,
  },
  summaryCard: {
    backgroundColor: darkTheme.colors.surface,
    marginTop: 20,
  },
});
