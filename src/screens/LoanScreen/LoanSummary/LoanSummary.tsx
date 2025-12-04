import {View, StyleSheet} from 'react-native';
import React from 'react';
import {Text} from 'react-native-paper';
import {GlassCard, ValueWithLabel} from '@trackingPortal/components';
import {getCurrencyAmount} from '@trackingPortal/utils/utils';
import {useStoreContext} from '@trackingPortal/contexts/StoreProvider';
import {colors} from '@trackingPortal/themes/colors';

interface ISummary {
  totalGiven: number;
  totalBorrowed: number;
}

const LoanSummary: React.FC<ISummary> = ({
  totalGiven = 0,
  totalBorrowed = 0,
}) => {
  const {currency} = useStoreContext();
  const netPosition = totalGiven - totalBorrowed;
  return (
    <View style={styles.mainContainer}>
      <GlassCard style={styles.summaryCard}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headingLabel}>Loan Snapshot</Text>
            <Text style={styles.headingValue}>Give & Borrow balance</Text>
          </View>
          <View
            style={[
              styles.netPill,
              netPosition >= 0 ? styles.netPositive : styles.netNegative,
            ]}>
            <Text style={styles.netPillText}>
              {netPosition >= 0 ? 'IN CREDIT' : 'OWED'}
            </Text>
          </View>
        </View>
        <View style={styles.metricsSection}>
          <ValueWithLabel
            label="Total Given"
            value={getCurrencyAmount(totalGiven, currency)}
          />
          <ValueWithLabel
            label="Total Borrowed"
            value={getCurrencyAmount(totalBorrowed, currency)}
          />
          <ValueWithLabel
            label="Net Position"
            value={getCurrencyAmount(Math.abs(netPosition), currency)}
            error={netPosition < 0}
          />
        </View>
        <Text style={styles.helperText}>
          {netPosition >= 0
            ? 'You are in a healthy spot. Keep tracking repayments to stay ahead.'
            : 'Time to nudge repayments or adjust upcoming budgets to settle dues.'}
        </Text>
      </GlassCard>
    </View>
  );
};

export default LoanSummary;

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 20,
    paddingTop: 28,
  },
  summaryCard: {
    marginTop: 12,
    marginHorizontal: 4,
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
  netPill: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  netPositive: {
    backgroundColor: colors.badgePositiveBg,
    borderColor: colors.badgePositiveBorder,
  },
  netNegative: {
    backgroundColor: colors.badgeNegativeBg,
    borderColor: colors.badgeNegativeBorder,
  },
  netPillText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
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
