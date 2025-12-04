import {View, StyleSheet} from 'react-native';
import React, {useState, useMemo} from 'react';
import {Button, Text} from 'react-native-paper';
import {
  CircularProgress,
  FormikTextInput,
  ValueWithLabel,
  GlassCard,
} from '@trackingPortal/components';
import FormModal from '@trackingPortal/components/FormModal';
import dayjs, {Dayjs} from 'dayjs';
import {MonthlyLimitModel} from '@trackingPortal/api/models';
import {useStoreContext} from '@trackingPortal/contexts/StoreProvider';
import {getCurrencyAmount} from '@trackingPortal/utils/utils';
import {Formik, FormikHelpers} from 'formik';
import {EMonthlyLimitFields} from '@trackingPortal/screens/ExpenseScreen/ExpenseCreation/ExpenseCreation.constants';
import Toast from 'react-native-toast-message';
import {Month, Year} from '@trackingPortal/api/primitives';
import {withHaptic} from '@trackingPortal/utils/haptic';
import {colors} from '@trackingPortal/themes/colors';

interface ISummary {
  totalExpense: number;
  filterMonth: Dayjs;
  monthLimit: MonthlyLimitModel;
  getMonthlyLimit: () => void;
}

const ExpenseSummary: React.FC<ISummary> = ({
  totalExpense,
  filterMonth,
  monthLimit,
  getMonthlyLimit,
}) => {
  const [isLimitModalVisible, setIsLimitModalVisible] =
    useState<boolean>(false);
  const {apiGateway, currentUser: user} = useStoreContext();
  const [loading, setLoading] = useState<boolean>(false);
  const {currency} = useStoreContext();

  const limitValue = monthLimit?.limit ?? 0;

  const expensePercentage = useMemo(() => {
    if (!limitValue) {
      return 0;
    }
    return Math.min((totalExpense * 100) / limitValue, 999);
  }, [limitValue, totalExpense]);

  const displayPercentage = useMemo(
    () => Math.min(expensePercentage, 999),
    [expensePercentage],
  );

  const remainingBalance = useMemo(() => {
    if (!limitValue) {
      return null;
    }
    return limitValue - totalExpense;
  }, [limitValue, totalExpense]);

  const closeLimitModal = () => {
    setIsLimitModalVisible(false);
  };

  const handleSaveMonthlyLimit = async (
    values: any,
    {resetForm}: FormikHelpers<any>,
  ) => {
    try {
      setLoading(true);
      const numericLimit = Number(values.limit);

      if (!numericLimit || Number.isNaN(numericLimit) || numericLimit <= 0) {
        Toast.show({
          type: 'error',
          text1: 'Enter a valid monthly limit',
        });
        setLoading(false);
        return;
      }

      if (monthLimit?.id) {
        await apiGateway.monthlyLimitService.updateMonthlyLimit({
          id: monthLimit.id,
          limit: numericLimit,
        });
        Toast.show({
          type: 'success',
          text1: 'Limit updated successfully',
        });
      } else {
        await apiGateway.monthlyLimitService.addMonthlyLimit({
          userId: user.userId,
          limit: numericLimit,
          month: (filterMonth.month() + 1) as Month,
          year: filterMonth.year() as Year,
        });
        Toast.show({
          type: 'success',
          text1: 'Limit added successfully',
        });
      }
      await getMonthlyLimit();
      closeLimitModal();
      resetForm();
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <GlassCard style={styles.summaryCard}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headingLabel}>Monthly Overview</Text>
            <Text style={styles.headingValue}>
              {dayjs(filterMonth).format('MMMM, YYYY')}
            </Text>
          </View>
          <View style={styles.progressBadge}>
            {limitValue ? (
              <CircularProgress
                progress={Math.min(totalExpense / limitValue, 1)}
                size={60}
                strokeWidth={5}
                progressColor={
                  expensePercentage >= 100 ? colors.error : colors.accent
                }
                label={`${displayPercentage.toFixed(0)}%`}
              />
            ) : (
              <View style={styles.setLimitBadge}>
                <Text style={styles.setLimitLabel}>Set{'\n'}Limit</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.metricsSection}>
          <ValueWithLabel
            label="Total Spend"
            value={getCurrencyAmount(totalExpense, currency)}
          />
          <ValueWithLabel
            label="Monthly Limit"
            value={
              limitValue
                ? getCurrencyAmount(Number(limitValue.toFixed(2)), currency)
                : 'Not set'
            }
          />
          {remainingBalance !== null && (
            <ValueWithLabel
              label="Remaining"
              value={getCurrencyAmount(
                Number(remainingBalance.toFixed(2)),
                currency,
              )}
              error={remainingBalance < 0}
            />
          )}
        </View>

        {!limitValue && (
          <Text style={styles.helperText}>
            Set a monthly spending limit to stay ahead of unexpected expenses.
          </Text>
        )}

        <View style={styles.actionRow}>
          <Button
            mode="outlined"
            textColor={colors.text}
            style={styles.actionButton}
            onPress={() => {
              withHaptic(() => {
                setIsLimitModalVisible(true);
              });
            }}>
            {limitValue ? 'Adjust limit' : 'Set limit'}
          </Button>
        </View>

        <Formik
          enableReinitialize={true}
          initialValues={{
            [EMonthlyLimitFields.LIMIT]: limitValue
              ? String(Number(limitValue.toFixed(2)))
              : '',
          }}
          onSubmit={handleSaveMonthlyLimit}>
          {({handleSubmit, values, resetForm}) => {
            return (
              <FormModal
                isVisible={isLimitModalVisible}
                title={limitValue ? 'Adjust Monthly Limit' : 'Set Monthly Limit'}
                onClose={() => {
                  closeLimitModal();
                  resetForm();
                }}
                onSave={handleSubmit}
                loading={loading}>
                <View style={styles.limitForm}>
                  <FormikTextInput
                    name={EMonthlyLimitFields.LIMIT}
                    mode="outlined"
                    label="Monthly limit"
                    keyboardType="numeric"
                    value={values[EMonthlyLimitFields.LIMIT] || ''}
                  />
                </View>
              </FormModal>
            );
          }}
        </Formik>
      </GlassCard>
    </View>
  );
};

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
    gap: 12,
  },
  headingLabel: {
    color: colors.subText,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.6,
  },
  headingValue: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
    marginTop: 4,
  },
  progressBadge: {
    alignItems: 'flex-end',
  },
  setLimitBadge: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.badgePositiveBg,
  },
  setLimitLabel: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 16,
    letterSpacing: 0.4,
  },
  metricsSection: {
    marginTop: 20,
    gap: 12,
  },
  helperText: {
    marginTop: 24,
    color: colors.subText,
    fontSize: 13,
    lineHeight: 20,
  },
  actionRow: {
    marginTop: 24,
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  actionButton: {
    borderRadius: 999,
    borderColor: colors.glassBorder,
    paddingHorizontal: 12,
  },
  limitForm: {
    gap: 12,
  },
});

export default ExpenseSummary;
