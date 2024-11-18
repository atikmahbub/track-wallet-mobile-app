import React from 'react';
import {View, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ExpenseScreen from '@trackingPortal/screens/ExpenseScreen';
import LoanScreen from '@trackingPortal/screens/LoanScreen';
import InvestScreen from '@trackingPortal/screens/InvestScreen';
import ProfileScreen from '@trackingPortal/screens/ProfileScreen';
import {darkTheme} from '@trackingPortal/themes/darkTheme';
import {useTheme} from 'react-native-paper';
import {ENavigationTab} from '@trackingPortal/navigation/ERoutes';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const Tab = createBottomTabNavigator();

const AnimatedIcon = ({name, focused}: {name: string; focused: boolean}) => {
  const scale = useSharedValue(focused ? 1.2 : 1);

  React.useEffect(() => {
    scale.value = withTiming(focused ? 1.2 : 1, {duration: 300});
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

const ScreenWrapper = ({children}: {children: React.ReactNode}) => {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.screenWrapper,
        {backgroundColor: theme.colors.background},
      ]}>
      {children}
    </View>
  );
};

export default function AppNavigation() {
  return (
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

          return <AnimatedIcon name={iconMap[route.name]} focused={focused} />;
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
      })}>
      <Tab.Screen name={ENavigationTab.Expense}>
        {() => (
          <ScreenWrapper>
            <ExpenseScreen />
          </ScreenWrapper>
        )}
      </Tab.Screen>

      <Tab.Screen name={ENavigationTab.Loan}>
        {() => (
          <ScreenWrapper>
            <LoanScreen />
          </ScreenWrapper>
        )}
      </Tab.Screen>

      <Tab.Screen name={ENavigationTab.Investment}>
        {() => (
          <ScreenWrapper>
            <InvestScreen />
          </ScreenWrapper>
        )}
      </Tab.Screen>

      <Tab.Screen name={ENavigationTab.Profile}>
        {() => (
          <ScreenWrapper>
            <ProfileScreen />
          </ScreenWrapper>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: darkTheme.colors.surface,
    flexDirection: 'row',
    position: 'absolute',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    bottom: 40,
    left: 20,
    right: 20,
    height: 60,
    flex: 1,
    elevation: 0,
    borderRadius: 25,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowOffset: {
      width: 10,
      height: 10,
    },
    borderTopWidth: 0,
  },
  screenWrapper: {
    flex: 1,
  },
});
