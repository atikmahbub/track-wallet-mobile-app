import {View, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {darkTheme} from '@trackingPortal/themes/darkTheme';
import {Button, Card, TextInput} from 'react-native-paper';
import {ValueWithLabel} from '@trackingPortal/components';
import dayjs from 'dayjs';

export default function ExpenseSummary() {
  const [showLimitInput, setShowLimitInput] = useState<boolean>(false);
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
          <View style={styles.buttonContainer}>
            <Button
              mode="text"
              onPress={() => {
                setShowLimitInput(!showLimitInput);
              }}>
              Set Limit
            </Button>
          </View>

          {showLimitInput && (
            <View>
              <TextInput
                mode="outlined"
                label="Limit"
                onChangeText={text => {}}
              />
              <View style={styles.saveButtonContainer}>
                <Button
                  mode="text"
                  onPress={() => {
                    setShowLimitInput(false);
                  }}>
                  Cancel
                </Button>
                <Button mode="contained" textColor="white">
                  Save
                </Button>
              </View>
            </View>
          )}
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
});
