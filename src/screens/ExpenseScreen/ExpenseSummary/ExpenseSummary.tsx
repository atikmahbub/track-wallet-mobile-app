import {View, StyleSheet, Animated, Easing} from 'react-native';
import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import {Button, Text} from 'react-native-paper';
import {
  CircularProgress,
  FormikTextInput,
  ValueWithLabel,
  GlassCard,
} from '@trackingPortal/components';
import dayjs, {Dayjs} from 'dayjs';
import {MonthlyLimitModel} from '@trackingPortal/api/models';
import {useStoreContext} from '@trackingPortal/contexts/StoreProvider';
import {getCurrencyAmount} from '@trackingPortal/utils/utils';
import {Formik} from 'formik';
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

const DEFAULT_LIMIT_FORM_HEIGHT = 220;

const ExpenseSummary: React.FC<ISummary> = ({
  totalExpense,
  filterMonth,
  monthLimit,
  getMonthlyLimit,
}) => {
  const [showLimitInput, setShowLimitInput] = useState<boolean>(false);
  const [isAnimatingLimit, setIsAnimatingLimit] = useState<boolean>(false);
  const [formHeight, setFormHeight] = useState<number>(0);
  const [shouldRenderLimit, setShouldRenderLimit] = useState<boolean>(false);
  const limitProgress = useRef(new Animated.Value(0)).current;
  const {apiGateway, currentUser: user} = useStoreContext();
  const [loading, setLoading] = useState<boolean>(false);
  const {currency} = useStoreContext();
  const limitFormExpandedHeight = Math.max(
    formHeight > 0 ? formHeight + 16 : 0,
    DEFAULT_LIMIT_FORM_HEIGHT,
  );
  const animatedHeight = useMemo(
    () =>
      limitProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, limitFormExpandedHeight],
      }),
    [limitProgress, limitFormExpandedHeight],
  );
  const animatedMarginTop = useMemo(
    () =>
      limitProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 20],
      }),
    [limitProgress],
  );
  const animatedTranslateY = useMemo(
    () =>
      limitProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [-12, 0],
      }),
    [limitProgress],
  );

  const animateLimit = useCallback(
    (toValue: number, onFinished?: () => void) => {
      setIsAnimatingLimit(true);
      Animated.timing(limitProgress, {
        toValue,
        duration: 260,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }).start(({finished}) => {
        if (finished) {
          onFinished?.();
        }
        setIsAnimatingLimit(false);
      });
    },
    [limitProgress],
  );

  const toggleLimitInput = () => {
    if (isAnimatingLimit) {
      return;
    }
    if (showLimitInput) {
      setShowLimitInput(false);
    } else {
      limitProgress.stopAnimation(() => {
        limitProgress.setValue(0);
      });
      setShouldRenderLimit(true);
      setShowLimitInput(true);
    }
  };

  useEffect(() => {
    if (!shouldRenderLimit) {
      return;
    }

    if (showLimitInput && formHeight === 0) {
      return;
    }

    animateLimit(showLimitInput ? 1 : 0, () => {
      if (!showLimitInput) {
        setShouldRenderLimit(false);
        limitProgress.setValue(0);
      }
    });
  }, [
    showLimitInput,
    shouldRenderLimit,
    formHeight,
    animateLimit,
    limitProgress,
  ]);

  useEffect(() => {
    if (showLimitInput && !shouldRenderLimit) {
      setShouldRenderLimit(true);
    }
  }, [showLimitInput, shouldRenderLimit]);

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
    return Math.max(limitValue - totalExpense, 0);
  }, [limitValue, totalExpense]);

  const handleSaveMonthlyLimit = async (values: any) => {
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
      toggleLimitInput();
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
              error={totalExpense > limitValue}
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
              withHaptic(toggleLimitInput);
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
          {({handleSubmit, values}) => {
            if (!shouldRenderLimit) {
              return null;
            }
            return (
              <Animated.View
                pointerEvents={showLimitInput ? 'auto' : 'none'}
                style={[
                  styles.animatedContainer,
                  {
                    opacity: limitProgress,
                    height: animatedHeight,
                    marginTop: animatedMarginTop,
                    transform: [{translateY: animatedTranslateY}],
                  },
                ]}>
                <View
                  style={styles.limitForm}
                  onLayout={event => {
                    const height = event.nativeEvent.layout.height;
                    if (height > 0) {
                      setFormHeight(previous =>
                        Math.abs(previous - height) < 1 ? previous : height,
                      );
                    }
                  }}>
                  <FormikTextInput
                    name={EMonthlyLimitFields.LIMIT}
                    mode="outlined"
                    label="Monthly limit"
                    keyboardType="numeric"
                    value={values[EMonthlyLimitFields.LIMIT] || ''}
                  />
                  <View style={styles.saveButtonContainer}>
                    <Button
                      mode="text"
                      textColor={colors.subText}
                      onPress={() => {
                        toggleLimitInput();
                      }}>
                      Cancel
                    </Button>
                    <Button
                      loading={loading}
                      mode="contained"
                      onPress={() => handleSubmit()}
                      style={styles.saveButton}
                      labelStyle={styles.saveButtonLabel}>
                      Save
                    </Button>
                  </View>
                </View>
              </Animated.View>
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
    backgroundColor: 'rgba(100, 210, 255, 0.15)',
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
  animatedContainer: {
    overflow: 'hidden',
    width: '100%',
  },
  limitForm: {
    gap: 12,
    paddingBottom: 12,
  },
  saveButtonContainer: {
    marginTop: 4,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
  },
  saveButton: {
    borderRadius: 999,
    paddingHorizontal: 16,
  },
  saveButtonLabel: {
    fontWeight: '600',
    letterSpacing: 0.6,
  },
});

export default ExpenseSummary;
