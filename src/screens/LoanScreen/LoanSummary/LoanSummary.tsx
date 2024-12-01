import {View, StyleSheet} from 'react-native';
import React from 'react';
import {darkTheme} from '@trackingPortal/themes/darkTheme';
import {Card} from 'react-native-paper';
import {ValueWithLabel} from '@trackingPortal/components';
import {convertToKilo} from '@trackingPortal/utils/utils';

interface ISummary {
  totalGiven: number;
  totalBorrowed: number;
}

const LoanSummary: React.FC<ISummary> = ({
  totalGiven = 0,
  totalBorrowed = 0,
}) => {
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
            value={convertToKilo(totalGiven) + ' ' + 'BDT'}
          />
          <ValueWithLabel
            label="Total Borrowed"
            value={convertToKilo(totalBorrowed) + ' ' + 'BDT'}
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
