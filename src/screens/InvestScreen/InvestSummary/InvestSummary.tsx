import {View, StyleSheet} from 'react-native';
import React from 'react';
import {Text} from 'react-native-paper';
import {GlassCard, ValueWithLabel} from '@trackingPortal/components';
import {getCurrencyAmount} from '@trackingPortal/utils/utils';
import {InvestModel} from '@trackingPortal/api/models';
import {EInvestStatus} from '@trackingPortal/api/enums';
import {useStoreContext} from '@trackingPortal/contexts/StoreProvider';
import {colors} from '@trackingPortal/themes/colors';

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
    ? investList.reduce((acc, crr) => {
        if (!crr.earned) {
          return acc;
        }
        return acc + ((crr.earned - crr.amount) / crr.amount) * 100;
      }, 0)
    : 0;

  const averageReturn =
    !isActive && totalItems > 0 ? totalProfit / totalItems : 0;

  return (
    <View style={styles.mainContainer}>
      <GlassCard style={styles.summaryCard}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headingLabel}>Investment Snapshot</Text>
            <Text style={styles.headingValue}>
              {isActive ? 'Active portfolio' : 'Closed positions'}
            </Text>
          </View>
          <View
            style={[
              styles.statusPill,
              isActive ? styles.statusActive : styles.statusCompleted,
            ]}>
            <Text style={styles.statusText}>
              {isActive ? 'Active' : 'Completed'}
            </Text>
          </View>
        </View>

        <View style={styles.metricsSection}>
          <ValueWithLabel
            label={`Total ${isActive ? 'Active' : 'Completed'} Investments`}
            value={isActive ? totalActiveItem : totalCompletedItem}
          />
          <ValueWithLabel
            label="Total Capital"
            value={getCurrencyAmount(
              isActive ? totalActiveAmount : totalCompletedAmount,
              currency,
            )}
          />
          {!isActive && (
            <>
              <ValueWithLabel
                label="Total Profit"
                value={`${totalProfit.toFixed(2)}%`}
              />
              <ValueWithLabel
                label="Average ROI"
                value={`${averageReturn.toFixed(2)}%`}
              />
            </>
          )}
        </View>
        <Text style={styles.helperText}>
          {isActive
            ? 'Great time to review upcoming maturities and reinvest with confidence.'
            : 'Celebrate the wins and use the insights to refine your next moves.'}
        </Text>
      </GlassCard>
    </View>
  );
};

export default InvestSummary;

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  summaryCard: {
    marginTop: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headingLabel: {
    color: colors.subText,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
  },
  headingValue: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
    marginTop: 4,
  },
  statusPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  statusActive: {
    backgroundColor: 'rgba(94, 92, 230, 0.2)',
    borderColor: 'rgba(94, 92, 230, 0.4)',
  },
  statusCompleted: {
    backgroundColor: 'rgba(47, 213, 157, 0.16)',
    borderColor: 'rgba(47, 213, 157, 0.45)',
  },
  statusText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  metricsSection: {
    marginTop: 20,
    gap: 12,
  },
  helperText: {
    marginTop: 20,
    color: colors.subText,
    fontSize: 13,
    lineHeight: 19,
  },
});
