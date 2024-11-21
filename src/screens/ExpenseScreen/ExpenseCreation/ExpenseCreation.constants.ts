import {INewExpense} from '@trackingPortal/screens/ExpenseScreen/ExpenseCreation/ExpenseCreation.interfaces';
import * as Yup from 'yup';

export enum EAddExpenseFields {
  AMOUNT = 'amount',
  DESCRIPTION = 'description',
  DATE = 'date',
  EXPENSE_LIST = 'expense_list',
}

export const defaultQuestion: INewExpense = {
  [EAddExpenseFields.AMOUNT]: '',
  [EAddExpenseFields.DESCRIPTION]: '',
  [EAddExpenseFields.DATE]: new Date(),
};

export const CreateExpenseSchema = Yup.object().shape({
  [EAddExpenseFields.DATE]: Yup.date().required('Date is required'),
  [EAddExpenseFields.DESCRIPTION]: Yup.string().required('Purpose is required'),
  [EAddExpenseFields.AMOUNT]: Yup.number()
    .required('Amount is required')
    .positive('Amount must be positive'),
});
