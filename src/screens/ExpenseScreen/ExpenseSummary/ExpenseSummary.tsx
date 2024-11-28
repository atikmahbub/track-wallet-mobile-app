import {View, StyleSheet, Animated} from 'react-native';
import React, {useState, useRef, useMemo} from 'react';
import {darkTheme} from '@trackingPortal/themes/darkTheme';
import {Button, Card} from 'react-native-paper';
import {FormikTextInput, ValueWithLabel} from '@trackingPortal/components';
import dayjs, {Dayjs} from 'dayjs';
import {MonthlyLimitModel} from '@trackingPortal/api/models';
import {useStoreContext} from '@trackingPortal/contexts/StoreProvider';
import {convertToKilo} from '@trackingPortal/utils/utils';
import {Formik} from 'formik';
import {EMonthlyLimitFields} from '@trackingPortal/screens/ExpenseScreen/ExpenseCreation/ExpenseCreation.constants';
import Toast from 'react-native-toast-message';
import {Month, Year} from '@trackingPortal/api/primitives';

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
  const [showLimitInput, setShowLimitInput] = useState<boolean>(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const {apiGateway, currentUser: user} = useStoreContext();
  const [loading, setLoading] = useState<boolean>(false);

  const toggleLimitInput = () => {
    if (showLimitInput) {
      Animated.timing(animatedHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setShowLimitInput(false));
    } else {
      setShowLimitInput(true);
      Animated.timing(animatedHeight, {
        toValue: 140,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const expensePercentage = useMemo(
    () => (totalExpense * 100) / (monthLimit?.limit ?? 0),
    [monthLimit, totalExpense],
  );

  const handleSaveMonthlyLimit = async (values: any) => {
    try {
      setLoading(true);
      if (monthLimit?.id) {
        await apiGateway.monthlyLimitService.updateMonthlyLimit({
          id: monthLimit.id,
          limit: values.limit,
        });
        Toast.show({
          type: 'success',
          text1: 'Limit updated successfully',
        });
      } else {
        await apiGateway.monthlyLimitService.addMonthlyLimit({
          userId: user.userId,
          limit: values.limit,
          month: (filterMonth.month() + 1) as Month,
          year: filterMonth.year() as Year,
        });
        Toast.show({
          type: 'success',
          text1: 'Limit added successfully',
        });
      }
      await getMonthlyLimit();
      setShowLimitInput(false);
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
      <Card style={styles.summaryCard} mode="elevated">
        <Card.Title
          title="Summary"
          titleStyle={{
            fontSize: 16,
            fontWeight: '700',
          }}>
          Expense
        </Card.Title>
        <Card.Content>
          <ValueWithLabel
            label="Month"
            value={dayjs(new Date()).format('MMMM, YYYY')}
          />
          <ValueWithLabel
            label="Total Spend"
            value={
              monthLimit?.limit
                ? `${totalExpense} BDT (${expensePercentage.toFixed(2)}%)`
                : '0'
            }
          />
          <ValueWithLabel
            label="Limit"
            value={convertToKilo(monthLimit?.limit || 0) ?? 'N/A'}
          />
          <View style={styles.buttonContainer}>
            <Button
              mode="text"
              onPress={() => {
                toggleLimitInput();
              }}>
              Set Limit
            </Button>
          </View>

          {showLimitInput && (
            <Formik
              enableReinitialize={true}
              initialValues={{
                [EMonthlyLimitFields.LIMIT]:
                  monthLimit?.limit?.toString() || '',
              }}
              onSubmit={handleSaveMonthlyLimit}>
              {({handleSubmit, values}) => {
                return (
                  <Animated.View
                    style={[
                      styles.animatedContainer,
                      {height: animatedHeight},
                    ]}>
                    <FormikTextInput
                      name={EMonthlyLimitFields.LIMIT}
                      mode="outlined"
                      label="Limit"
                      value={values[EMonthlyLimitFields.LIMIT].toString()}
                    />
                    <View style={styles.saveButtonContainer}>
                      <Button
                        mode="text"
                        onPress={() => {
                          toggleLimitInput();
                        }}>
                        Cancel
                      </Button>
                      <Button
                        loading={loading}
                        mode="contained"
                        textColor="white"
                        onPress={() => handleSubmit()}>
                        Save
                      </Button>
                    </View>
                  </Animated.View>
                );
              }}
            </Formik>
          )}
        </Card.Content>
      </Card>
    </View>
  );
};

export default ExpenseSummary;

const styles = StyleSheet.create({
  mainContainer: {
    padding: 10,
  },
  summaryCard: {
    backgroundColor: darkTheme.colors.surface,
    marginTop: 20,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  saveButtonContainer: {
    marginTop: 15,
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'flex-end',
  },
  animatedContainer: {
    overflow: 'hidden',
  },
});
