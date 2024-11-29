import {View, StyleSheet} from 'react-native';
import React, {FC, useCallback, useState} from 'react';
import {Card} from 'react-native-paper';
import {darkTheme} from '@trackingPortal/themes/darkTheme';

import DataTable from '@trackingPortal/components/DataTable';
import {colors} from '@trackingPortal/themes/colors';

import {LoanModel} from '@trackingPortal/api/models';
import {useStoreContext} from '@trackingPortal/contexts/StoreProvider';
import {IUpdateLoanParams} from '@trackingPortal/api/params';
import Toast from 'react-native-toast-message';
import {LoadingButton} from '@trackingPortal/components';

interface ILoanList {
  notifyRowOpen: (value: boolean) => void;
  loans: LoanModel[];
  getUserLoan: () => void;
}

const headers = ['Name', 'Type', 'Date', 'Amount'];

const LoanList: FC<ILoanList> = ({notifyRowOpen, loans, getUserLoan}) => {
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
  const [openPicker, setOpenPicker] = useState<boolean>(false);
  const {currentUser: user, apiGateway} = useStoreContext();
  const [loading, setLoading] = useState<boolean>(false);

  // const onLoanEdit = async (values: any, {resetForm}: any, id: LoanId) => {
  //   if (user.default) return;

  //   try {
  //     setLoading(true);
  //     const params: IUpdateLoanParams = {
  //       // id: id,
  //       // amount: Number(values.amount),
  //       // date: makeUnixTimestampString(Number(new Date(values.date))),
  //       // description: values.description,
  //     };
  //     await apiGateway.expenseService.updateExpense(params);
  //     await getUserLoan();
  //     Toast.show({
  //       type: 'success',
  //       text1: 'Expense updated successfully!',
  //     });
  //   } catch (error) {
  //     console.log('error', error);
  //     Toast.show({
  //       type: 'error',
  //       text1: 'Something went wrong!',
  //     });
  //   } finally {
  //     resetForm();
  //     setExpandedRowId(null);
  //     setLoading(false);
  //   }
  // };

  const renderCollapsibleContent = useCallback(
    (item: LoanModel) => {
      const selectedItem = loans.find(loan => loan.id === item.id);
      if (!selectedItem) return null;
      const currentRowId = selectedItem.id;

      return (
        <></>
        // <Formik
        //   enableReinitialize
        //   initialValues={{
        //     id: selectedItem.id,
        //     [EAddExpenseFields.DATE]: new Date(
        //       Number(selectedItem.date) * 1000,
        //     ),
        //     [EAddExpenseFields.DESCRIPTION]: selectedItem.description || '',
        //     [EAddExpenseFields.AMOUNT]: selectedItem.amount.toString(),
        //   }}
        //   onSubmit={(values, formikHelpers) =>
        //     onExpenseEdit(values, formikHelpers, currentRowId)
        //   }
        //   validationSchema={CreateExpenseSchema}>
        //   {({handleSubmit}) => (
        //     <Fragment>
        //       <ExpenseForm />
        //       <View style={styles.actionRow}>
        //         <TouchableOpacity
        //           style={styles.cancelButton}
        //           onPress={() => !loading && setExpandedRowId(null)}>
        //           <Text style={styles.cancelButtonText}>Cancel</Text>
        //         </TouchableOpacity>
        //         <LoadingButton
        //           label="Save"
        //           loading={loading}
        //           onPress={() => handleSubmit()}
        //         />
        //       </View>
        //     </Fragment>
        //   )}
        // </Formik>
      );
    },
    [loans, setExpandedRowId],
  );

  return (
    <View style={styles.mainContainer}>
      <Card style={styles.listCard}>
        <Card.Title
          title="Loan History"
          titleStyle={{
            fontSize: 16,
            fontWeight: '700',
          }}
        />
        <Card.Content>
          {/* <DataTable
            headers={headers}
            data={[]}
            onDelete={() => {}}
            isAnyRowOpen={notifyRowOpen}
            expandedRowId={expandedRowId}
            setExpandedRowId={setExpandedRowId}
            renderCollapsibleContent={renderCollapsibleContent}
          /> */}
        </Card.Content>
      </Card>
    </View>
  );
};

export default LoanList;

const styles = StyleSheet.create({
  mainContainer: {
    padding: 10,
  },
  listCard: {
    backgroundColor: darkTheme.colors.surface,
    marginTop: 20,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    paddingBottom: 20,
    gap: 10,
  },
  cancelButton: {
    backgroundColor: colors.disabled,
    padding: 10,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: colors.text,
    fontWeight: 'bold',
  },
});
