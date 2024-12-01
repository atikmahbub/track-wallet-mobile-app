import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import React, {
  FC,
  Fragment,
  SetStateAction,
  useCallback,
  useState,
} from 'react';
import {Card} from 'react-native-paper';
import {darkTheme} from '@trackingPortal/themes/darkTheme';

import DataTable from '@trackingPortal/components/DataTable';
import {colors} from '@trackingPortal/themes/colors';

import {InvestModel} from '@trackingPortal/api/models';
import {useStoreContext} from '@trackingPortal/contexts/StoreProvider';
import {IUpdateInvestParams} from '@trackingPortal/api/params';
import Toast from 'react-native-toast-message';
import {
  AnimatedLoader,
  LoadingButton,
  TwMenu,
} from '@trackingPortal/components';
import dayjs from 'dayjs';
import {
  InvestId,
  makeUnixTimestampString,
  makeUnixTimestampToNumber,
} from '@trackingPortal/api/primitives';
import {
  EAddInvestFormFields,
  AddInvestSchema,
  filterInvestByStatusMenu,
} from '@trackingPortal/screens/InvestScreen';
import {Formik} from 'formik';
import InvestForm from '@trackingPortal/screens/InvestScreen/InvestForm';
import {EInvestStatus} from '@trackingPortal/api/enums';

interface IInvestList {
  notifyRowOpen: (value: boolean) => void;
  invests: InvestModel[];
  getUserInvestHistory: () => void;
  status: EInvestStatus;
  setStatus: React.Dispatch<SetStateAction<EInvestStatus>>;
}

const headers = ['Name', 'Date', 'Amount', 'Profit'];

const InvestList: FC<IInvestList> = ({
  notifyRowOpen,
  invests,
  getUserInvestHistory,
  status,
  setStatus,
}) => {
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
  const {currentUser: user, apiGateway} = useStoreContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const onInvestEdit = async (values: any, {resetForm}: any, id: InvestId) => {
    if (user.default) return;

    try {
      setLoading(true);
      const params: IUpdateInvestParams = {
        id: id,
        amount: Number(values.amount),
        startDate: makeUnixTimestampString(Number(new Date(values.start_date))),
        note: values.note,
        name: values.name,
        endDate: makeUnixTimestampString(Number(new Date(values.end_date))),
        status:
          values.status === true
            ? EInvestStatus.Completed
            : EInvestStatus.Active,
        earned: Number(values.earned),
      };

      await apiGateway.investService.updateInvest(params);
      await getUserInvestHistory();
      Toast.show({
        type: 'success',
        text1: 'Investment updated successfully!',
      });
    } catch (error) {
      console.log('error', error);
      Toast.show({
        type: 'error',
        text1: 'Something went wrong!',
      });
    } finally {
      resetForm();
      setExpandedRowId(null);
      setLoading(false);
    }
  };

  const handleDeleteLoan = async (rowId: any) => {
    if (!rowId) return;
    try {
      setDeleteLoading(true);
      await apiGateway.investService.deleteInvest(rowId);
      await getUserInvestHistory();
      Toast.show({
        type: 'success',
        text1: 'Deleted Successfully!',
      });
    } catch (error) {
      console.log('error', error);
      Toast.show({
        type: 'error',
        text1: 'Something went wrong!',
      });
    } finally {
      setDeleteLoading(false);
      setExpandedRowId(null);
    }
  };

  const renderCollapsibleContent = useCallback(
    (item: InvestModel) => {
      const selectedItem = invests.find(invest => invest.id === item.id);
      if (!selectedItem) return null;
      const currentRowId = selectedItem.id;

      return (
        <Formik
          enableReinitialize={true}
          initialValues={{
            id: selectedItem.id,
            [EAddInvestFormFields.START_DATE]: new Date(
              Number(selectedItem.startDate) * 1000,
            ),
            [EAddInvestFormFields.END_DATE]: selectedItem.endDate
              ? new Date(Number(selectedItem.endDate) * 1000)
              : new Date(),
            [EAddInvestFormFields.NOTE]: selectedItem.note || '',
            [EAddInvestFormFields.AMOUNT]: selectedItem.amount.toString(),
            [EAddInvestFormFields.NAME]: selectedItem.name,
            [EAddInvestFormFields.EARNED]: selectedItem.earned?.toString(),
            [EAddInvestFormFields.STATUS]:
              item.status === EInvestStatus.Active ? false : true,
          }}
          onSubmit={(values, formikHelpers) =>
            onInvestEdit(values, formikHelpers, currentRowId)
          }
          validationSchema={AddInvestSchema}>
          {({handleSubmit}) => {
            return (
              <Fragment>
                <InvestForm update />
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => !loading && setExpandedRowId(null)}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <LoadingButton
                    label="Save"
                    loading={loading}
                    onPress={() => handleSubmit()}
                  />
                </View>
              </Fragment>
            );
          }}
        </Formik>
      );
    },
    [invests, setExpandedRowId],
  );

  const getProfit = (capital: number, totalEarned: number | null) => {
    if (!totalEarned) return 'N/A';
    const profit = totalEarned - capital;
    const profitPercentage = (profit / capital) * 100;
    return `${profitPercentage.toFixed(2)}%`;
  };

  if (deleteLoading) {
    return <AnimatedLoader />;
  }

  return (
    <View style={styles.mainContainer}>
      <Card style={styles.listCard}>
        <Card.Title
          title="Investment History"
          titleStyle={{
            fontSize: 16,
            fontWeight: '700',
          }}
        />
        <Card.Actions style={styles.cardActions}>
          <TwMenu
            onSelect={value => {
              setStatus(value);
            }}
            buttonLabel={
              status === EInvestStatus.Active ? 'Active' : 'Completed'
            }
            options={filterInvestByStatusMenu}
          />
        </Card.Actions>

        <Card.Content>
          <DataTable
            headers={headers}
            data={invests.map(invest => ({
              id: invest.id,
              Name: invest.name,
              Date: dayjs(
                makeUnixTimestampToNumber(Number(invest.startDate)),
              ).format('MMM D, YYYY'),
              Amount: invest.amount,
              Profit: getProfit(invest.amount, invest.earned),
              status: invest.status,
            }))}
            onDelete={handleDeleteLoan}
            isAnyRowOpen={notifyRowOpen}
            expandedRowId={expandedRowId}
            setExpandedRowId={setExpandedRowId}
            renderCollapsibleContent={renderCollapsibleContent}
          />
        </Card.Content>
      </Card>
    </View>
  );
};

export default InvestList;

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
  cardActions: {
    position: 'absolute',
    right: 0,
  },
});
