import React, {useEffect} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {enableScreens} from 'react-native-screens';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import {useTheme} from 'react-native-paper';

import ExpenseScreen from '@trackingPortal/screens/ExpenseScreen';
import LoanScreen from '@trackingPortal/screens/LoanScreen';
import InvestScreen from '@trackingPortal/screens/InvestScreen';
import ProfileScreen from '@trackingPortal/screens/ProfileScreen';
import LoginScreen from '@trackingPortal/screens/LoginScreen';
import {darkTheme} from '@trackingPortal/themes/darkTheme';
import {SafeAreaView} from 'react-native-safe-area-context';
import {CustomAppBar, AnimatedLoader} from '@trackingPortal/components';
import {useAuth} from '@trackingPortal/auth/Auth0ProviderWithHistory';
import {ENavigationTab} from '@trackingPortal/navigation/ERoutes';

const SCREEN_WIDTH = Dimensions.get('window').width;
const TAB_WIDTH = SCREEN_WIDTH / 4;

enableScreens();

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const useTabAnimation = () => {
  const translateX = useSharedValue(0);

  const onTabChange = (tabIndex: number) => {
    translateX.value = withTiming(TAB_WIDTH * tabIndex, {
      duration: 150,
      easing: Easing.out(Easing.ease),
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}],
  }));

  return {animatedStyle, onTabChange};
};

const AnimatedIcon = React.memo(
  ({name, focused}: {name: string; focused: boolean}) => {
    const scale = useSharedValue(focused ? 1.2 : 1);

    useEffect(() => {
      scale.value = withTiming(focused ? 1.2 : 1, {duration: 150});
    }, [focused, scale]);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{scale: scale.value}],
    }));

    return (
      <Animated.View style={animatedStyle}>
        <Icon name={name} size={24} color={focused ? '#BB86FC' : 'gray'} />
      </Animated.View>
    );
  },
);

const AnimatedTopBar = React.memo(({animatedStyle}: {animatedStyle: any}) => {
  return <Animated.View style={[styles.animatedBar, animatedStyle]} />;
});

const ScreenWrapper = React.memo(({children}: {children: React.ReactNode}) => {
  const theme = useTheme();
  return (
    <SafeAreaView
      edges={['top']}
      style={{backgroundColor: darkTheme.colors.background, flex: 1}}>
      <CustomAppBar />
      <View
        style={[
          styles.screenWrapper,
          {backgroundColor: theme.colors.background},
        ]}>
        {children}
      </View>
    </SafeAreaView>
  );
});

function TabNavigator() {
  const {animatedStyle, onTabChange} = useTabAnimation();

  const iconMap: Record<string, string> = {
    Expense: 'currency-usd',
    Loan: 'hand-coin',
    Investment: 'chart-line',
    Profile: 'account-circle',
  };

  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: '#FFFFFF',
          tabBarInactiveTintColor: 'gray',
          tabBarIcon: ({focused}) => (
            <AnimatedIcon name={iconMap[route.name]} focused={focused} />
          ),
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
      <AnimatedTopBar animatedStyle={animatedStyle} />
    </View>
  );
}

export default function AppNavigation() {
  const {token, loading} = useAuth();

  if (loading) {
    return <AnimatedLoader />;
  }

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {token ? (
        <Stack.Screen name="Tabs" component={TabNavigator} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.colors.background,
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
