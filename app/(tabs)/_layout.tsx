import React from 'react';
import type {ComponentProps} from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  NativeTabs,
  Icon,
  Label,
  VectorIcon,
} from 'expo-router/unstable-native-tabs';

import {colors} from '@trackingPortal/themes/colors';

type MaterialCommunityIconName = ComponentProps<
  typeof MaterialCommunityIcons
>['name'];

const TAB_ITEMS: Array<{
  name: 'expense' | 'loan' | 'investment' | 'profile';
  label: string;
  icon: MaterialCommunityIconName;
}> = [
  {
    name: 'expense',
    label: 'Expense',
    icon: 'currency-usd',
  },
  {
    name: 'loan',
    label: 'Loan',
    icon: 'hand-coin',
  },
  {
    name: 'investment',
    label: 'Invest',
    icon: 'chart-line',
  },
  {
    name: 'profile',
    label: 'Profile',
    icon: 'account-circle',
  },
] as const;

export default function TabsLayout() {
  return (
    <NativeTabs
      iconColor={colors.subText}
      tintColor={colors.primary}
      backgroundColor="rgba(8, 14, 32, 0.9)"
      blurEffect="systemUltraThinMaterialDark"
      shadowColor="rgba(94, 92, 230, 0.35)">
      {TAB_ITEMS.map(tab => (
        <NativeTabs.Trigger key={tab.name} name={tab.name}>
          <Icon
            selectedColor={colors.primary}
            src={<VectorIcon family={MaterialCommunityIcons} name={tab.icon} />}
          />
          <Label
            selectedStyle={{color: colors.text, fontWeight: '600'}}
            hidden={false}>
            {tab.label}
          </Label>
        </NativeTabs.Trigger>
      ))}
    </NativeTabs>
  );
}
