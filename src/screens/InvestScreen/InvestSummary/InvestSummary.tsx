import {View, StyleSheet} from 'react-native';
import React from 'react';
import {darkTheme} from '@trackingPortal/themes/darkTheme';
import {Card} from 'react-native-paper';
import {ValueWithLabel} from '@trackingPortal/components';
import {getCurrencyAmount} from '@trackingPortal/utils/utils';
import {InvestModel} from '@trackingPortal/api/models';
import {EInvestStatus} from '@trackingPortal/api/enums';
import {useStoreContext} from '@trackingPortal/contexts/StoreProvider';

interface ISummary {
  investList: InvestModel[];
  status: EInvestStatus;
}

const InvestSummary: React.FC<ISummary> = ({investList, status}) => {
  const isActive = status === EInvestStatus.Active;
  const {currency} = useStoreContext();

  const totalItems = investList.length;
  const totalAmountInvested = investList.reduce(
    (acc, crr) => acc + crr.amount,
    0,
  );

  const totalActiveItem = isActive ? totalItems : 0;
  const totalActiveAmount = isActive ? totalAmountInvested : 0;

  const totalCompletedItem = !isActive ? totalItems : 0;
  const totalCompletedAmount = !isActive ? totalAmountInvested : 0;

  const totalProfit = !isActive
    ? investList.reduce(
        (acc, crr) => acc + ((crr.earned! - crr.amount) / crr.amount) * 100,
        0,
      )
    : 0;

  return (
    <View style={styles.mainContainer}>
      <Card style={styles.summaryCard} mode="elevated">
        <Card.Title
          title="Summary"
          titleStyle={{
            fontSize: 16,
            fontWeight: '700',
          }}>
          Invest Summary
        </Card.Title>
        <Card.Content>
          <ValueWithLabel
            label={`Total ${isActive ? 'Active' : 'Completed'} Investment`}
            value={isActive ? totalActiveItem : totalCompletedItem}
          />
          <ValueWithLabel
            label="Total Amount Invested"
            value={getCurrencyAmount(
              isActive ? totalActiveAmount : totalCompletedAmount,
              currency,
            )}
          />
          {!isActive && (
            <ValueWithLabel
              label="Total Profit (%)"
              value={totalProfit.toFixed(2) + '%'}
            />
          )}
        </Card.Content>
      </Card>
    </View>
  );
};

export default InvestSummary;

const styles = StyleSheet.create({
  mainContainer: {
    padding: 10,
  },
  summaryCard: {
    backgroundColor: darkTheme.colors.surface,
    marginTop: 20,
  },
});
