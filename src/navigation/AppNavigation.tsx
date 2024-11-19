import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ExpenseScreen from '@trackingPortal/screens/ExpenseScreen';
import LoanScreen from '@trackingPortal/screens/LoanScreen';
import InvestScreen from '@trackingPortal/screens/InvestScreen';
import ProfileScreen from '@trackingPortal/screens/ProfileScreen';
import {darkTheme} from '@trackingPortal/themes/darkTheme';
import {useTheme} from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();
const SCREEN_WIDTH = Dimensions.get('window').width;
const TAB_WIDTH = SCREEN_WIDTH / 4; // Divide by 4 tabs

const AnimatedIcon = ({name, focused}: {name: string; focused: boolean}) => {
  const scale = useSharedValue(focused ? 1.2 : 1); // Default scale values

  React.useEffect(() => {
    scale.value = withTiming(focused ? 1.2 : 1, {duration: 300}); // Animate on focus change
  }, [focused, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Icon name={name} size={24} color={focused ? '#BB86FC' : 'gray'} />
    </Animated.View>
  );
};

const AnimatedTopBar = ({
  translateX,
}: {
  translateX: Animated.SharedValue<number>;
}) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateX: withTiming(translateX.value, {duration: 300})}],
  }));

  return <Animated.View style={[styles.animatedBar, animatedStyle]} />;
};

const ScreenWrapper = ({children}: {children: React.ReactNode}) => {
  const theme = useTheme();
  return (
    <SafeAreaView
      style={[
        styles.screenWrapper,
        {backgroundColor: theme.colors.background},
      ]}>
      {children}
    </SafeAreaView>
  );
};

export default function AppNavigation() {
  const translateX = useSharedValue(0);

  const onTabChange = (tabIndex: number) => {
    translateX.value = TAB_WIDTH * tabIndex;
  };

  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: '#FFFFFF',
          tabBarInactiveTintColor: 'gray',
          tabBarIcon: ({focused}) => {
            const iconMap: Record<string, string> = {
              Expense: 'currency-usd',
              Loan: 'hand-coin',
              Investment: 'chart-line',
              Profile: 'account-circle',
            };

            return (
              <AnimatedIcon name={iconMap[route.name]} focused={focused} />
            );
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: 'bold',
          },
        })}
        screenListeners={{
          state: e => {
            const tabIndex = e.data.state.index;
            onTabChange(tabIndex);
          },
        }}>
        <Tab.Screen name="Expense">
          {() => (
            <ScreenWrapper>
              <ExpenseScreen />
            </ScreenWrapper>
          )}
        </Tab.Screen>
        <Tab.Screen name="Loan">
          {() => (
            <ScreenWrapper>
              <LoanScreen />
            </ScreenWrapper>
          )}
        </Tab.Screen>
        <Tab.Screen name="Investment">
          {() => (
            <ScreenWrapper>
              <InvestScreen />
            </ScreenWrapper>
          )}
        </Tab.Screen>
        <Tab.Screen name="Profile">
          {() => (
            <ScreenWrapper>
              <ProfileScreen />
            </ScreenWrapper>
          )}
        </Tab.Screen>
      </Tab.Navigator>
      {/* Place Animated Bar on top of the bottom navigation */}
      <AnimatedTopBar translateX={translateX} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.colors.background, // Match the app background
  },
  tabBar: {
    backgroundColor: darkTheme.colors.surface,
    elevation: 0,
    borderTopWidth: 0,
    height: 70,
    position: 'relative',
  },
  screenWrapper: {
    flex: 1,
  },
  animatedBar: {
    position: 'absolute',
    bottom: 70,
    left: 0,
    height: 1.5,
    width: TAB_WIDTH,
    backgroundColor: '#BB86FC',
    borderRadius: 2,
  },
});
