import {NavigatorScreenParams} from '@react-navigation/native';

export enum ENavigationTab {
  Expense = 'Expense',
  Loan = 'Loan',
  Investment = 'Investment',
  Profile = 'Profile',
}

export enum ENavigationStack {
  Login = 'Login',
}

export type RootTabParamList = {
  [ENavigationTab.Expense]: undefined;
  [ENavigationTab.Loan]: undefined;
  [ENavigationTab.Investment]: undefined;
  [ENavigationTab.Profile]: undefined;
};

export type RootStackParamList = {
  [ENavigationStack.Login]: undefined;
  Tabs: NavigatorScreenParams<RootTabParamList>;
};
