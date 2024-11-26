import {View, StyleSheet, Animated} from 'react-native';
import React, {useState, useRef, useMemo} from 'react';
import {darkTheme} from '@trackingPortal/themes/darkTheme';
import {Button, Card, TextInput} from 'react-native-paper';
import {ValueWithLabel} from '@trackingPortal/components';
import dayjs, {Dayjs} from 'dayjs';
import {MonthlyLimitModel} from '@trackingPortal/api/models';
import {useStoreContext} from '@trackingPortal/contexts/StoreProvider';
import {convertToKilo} from '@trackingPortal/utils/utils';

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
        toValue: 110,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const expensePercentage = useMemo(
    () => (totalExpense * 100) / (monthLimit?.limit ?? 0),
    [monthLimit, totalExpense],
  );

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
                : ''
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
            <Animated.View
              style={[styles.animatedContainer, {height: animatedHeight}]}>
              <TextInput
                mode="outlined"
                label="Limit"
                value={monthLimit.limit.toString()}
                onChangeText={text => {}}
              />
              <View style={styles.saveButtonContainer}>
                <Button
                  mode="text"
                  onPress={() => {
                    toggleLimitInput();
                  }}>
                  Cancel
                </Button>
                <Button mode="contained" textColor="white">
                  Save
                </Button>
              </View>
            </Animated.View>
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
