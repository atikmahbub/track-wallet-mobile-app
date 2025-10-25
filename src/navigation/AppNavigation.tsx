import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Platform, TouchableOpacity} from 'react-native';
import {
  createBottomTabNavigator,
  type BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {enableScreens} from 'react-native-screens';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {useTheme} from 'react-native-paper';
import {BlurView} from '@react-native-community/blur';
import {SafeAreaView} from 'react-native-safe-area-context';

import ExpenseScreen from '@trackingPortal/screens/ExpenseScreen';
import LoanScreen from '@trackingPortal/screens/LoanScreen';
import InvestScreen from '@trackingPortal/screens/InvestScreen';
import ProfileScreen from '@trackingPortal/screens/ProfileScreen';
import LoginScreen from '@trackingPortal/screens/LoginScreen';
import {darkTheme} from '@trackingPortal/themes/darkTheme';
import {CustomAppBar, AnimatedLoader} from '@trackingPortal/components';
import {useAuth} from '@trackingPortal/auth/Auth0ProviderWithHistory';
import {ENavigationTab} from '@trackingPortal/navigation/ERoutes';
import {colors} from '@trackingPortal/themes/colors';

enableScreens();

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TAB_CONTENT_BOTTOM_PADDING = 96; // keep content above the glass bar

const AnimatedIcon = React.memo(
  ({name, focused}: {name: string; focused: boolean}) => {
    const scale = useSharedValue(focused ? 1.1 : 1);
    const glow = useSharedValue(focused ? 1 : 0);

    useEffect(() => {
      scale.value = withTiming(focused ? 1.1 : 1, {duration: 220});
      glow.value = withTiming(focused ? 1 : 0, {duration: 220});
    }, [focused, scale, glow]);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{scale: scale.value}],
    }));

    const glowStyle = useAnimatedStyle(() => ({
      opacity: glow.value,
      transform: [{scale: 0.65 + glow.value * 0.45}],
    }));

    return (
      <View style={styles.iconSlot}>
        <Animated.View style={[styles.iconGlow, glowStyle]} />
        <Animated.View style={animatedStyle}>
          <Icon
            name={name}
            size={26}
            color={focused ? colors.text : colors.subText}
          />
        </Animated.View>
      </View>
    );
  },
);

const GlassTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const bottomSpacing = 0; // ⬅️ keep the bar flush with the bottom

  return (
    <View
      pointerEvents="box-none"
      style={[styles.tabBarWrapper, {paddingBottom: bottomSpacing}]}>
      <View style={styles.tabBarContainer}>
        {Platform.OS === 'ios' && (
          <BlurView
            blurType="ultraThinMaterialDark"
            blurAmount={32}
            style={StyleSheet.absoluteFillObject}
            reducedTransparencyFallbackColor={colors.surfaceAlt}
          />
        )}
        <View style={styles.tabBarGlassTint} />
        <View style={styles.tabRow}>
          {state.routes.map((route, index) => {
            const focused = state.index === index;
            const {options} = descriptors[route.key];
            const label =
              typeof options.tabBarLabel === 'string'
                ? options.tabBarLabel
                : options.title ?? route.name;

            const icon =
              options.tabBarIcon?.({
                focused,
                color: focused ? colors.text : colors.subText,
                size: 26,
              }) ?? null;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={focused ? {selected: true} : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={styles.tabTouchable}>
                <View
                  style={[
                    styles.tabPill,
                    focused ? styles.tabPillActive : styles.tabPillInactive,
                  ]}>
                  <View style={styles.tabIconWrapper}>{icon}</View>
                  <Text
                    style={[
                      styles.tabLabel,
                      focused ? styles.tabLabelActive : styles.tabLabelInactive,
                    ]}>
                    {label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const ScreenWrapper = React.memo(({children}: {children: React.ReactNode}) => {
  const theme = useTheme();
  return (
    <SafeAreaView
      edges={['top']} // ⬅️ only top safe area
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
  const iconMap: Record<string, string> = {
    Expense: 'currency-usd',
    Loan: 'hand-coin',
    Investment: 'chart-line',
    Profile: 'account-circle',
  };

  return (
    <View style={styles.container}>
      <Tab.Navigator
        tabBar={props => <GlassTabBar {...props} />}
        sceneContainerStyle={styles.sceneContainer}
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarHideOnKeyboard: true,
          // ⬇️ prevent any implicit bottom safe-area padding
          safeAreaInsets: {bottom: 0},
          tabBarStyle: {paddingBottom: 0, height: undefined},
          tabBarIcon: ({focused}) => (
            <AnimatedIcon name={iconMap[route.name]} focused={focused} />
          ),
        })}>
        <Tab.Screen
          name={ENavigationTab.Expense}
          options={{tabBarLabel: 'Expense'}}>
          {() => (
            <ScreenWrapper>
              <ExpenseScreen />
            </ScreenWrapper>
          )}
        </Tab.Screen>
        <Tab.Screen name={ENavigationTab.Loan} options={{tabBarLabel: 'Loan'}}>
          {() => (
            <ScreenWrapper>
              <LoanScreen />
            </ScreenWrapper>
          )}
        </Tab.Screen>
        <Tab.Screen
          name={ENavigationTab.Investment}
          options={{tabBarLabel: 'Invest'}}>
          {() => (
            <ScreenWrapper>
              <InvestScreen />
            </ScreenWrapper>
          )}
        </Tab.Screen>
        <Tab.Screen
          name={ENavigationTab.Profile}
          options={{tabBarLabel: 'Profile'}}>
          {() => (
            <ScreenWrapper>
              <ProfileScreen />
            </ScreenWrapper>
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
}

export default function AppNavigation() {
  const {token, loading} = useAuth();

  if (loading) return <AnimatedLoader />;

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
    backgroundColor: colors.background,
  },
  sceneContainer: {
    backgroundColor: 'transparent',
  },
  screenWrapper: {
    flex: 1,
    paddingBottom: TAB_CONTENT_BOTTOM_PADDING, // keep content above the tab bar
  },

  // ---- Custom Glass Tab Bar ----
  tabBarWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0, // ⬅️ flush with screen edge
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
  },
  tabBarContainer: {
    marginHorizontal: 16,
    marginBottom: 4, // small visual buffer above home indicator
    borderRadius: 36,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    shadowColor: colors.primary,
    shadowOpacity: 0.22,
    shadowRadius: 32,
    shadowOffset: {width: 0, height: 18},
    elevation: 12,
  },
  tabBarGlassTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 14, 32, 0.88)',
    borderRadius: 36,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  tabTouchable: {
    flex: 1,
    alignItems: 'center',
  },
  tabPill: {
    minWidth: 82,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 4,
  },
  tabPillInactive: {
    backgroundColor: 'transparent',
  },
  tabPillActive: {
    backgroundColor: 'rgba(94, 92, 230, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(94, 92, 230, 0.45)',
  },
  tabIconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
    textAlign: 'center',
    lineHeight: 13,
  },
  tabLabelInactive: {
    color: colors.subText,
  },
  tabLabelActive: {
    color: colors.text,
  },

  iconSlot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  iconGlow: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(94, 92, 230, 0.25)',
    shadowColor: colors.primary,
    shadowOpacity: 0.5,
    shadowRadius: 18,
    shadowOffset: {width: 0, height: 8},
  },
});
