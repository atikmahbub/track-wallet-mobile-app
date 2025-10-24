import {View, StyleSheet, TouchableOpacity} from 'react-native';
import React, {
  FC,
  Fragment,
  SetStateAction,
  useCallback,
  useState,
} from 'react';
import {Text} from 'react-native-paper';

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
  GlassCard,
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
      <GlassCard style={styles.listCard}>
        <View style={styles.headerRow}>
          <View style={styles.headerTextBlock}>
            <Text style={styles.title}>Investment History</Text>
            <Text style={styles.subtitle}>
              Monitor allocations, returns, and close out wins.
            </Text>
          </View>
          <TwMenu
            containerStyle={styles.menuContainer}
            onSelect={value => {
              setStatus(value);
            }}
            buttonLabel={
              filterInvestByStatusMenu.find(item => item.value === status)
                ?.label || 'Status'
            }
            options={filterInvestByStatusMenu}
          />
        </View>

        <View style={styles.tableContainer}>
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
        </View>
      </GlassCard>
    </View>
  );
};

export default InvestList;

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  listCard: {
    marginTop: 12,
    marginHorizontal: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
  },
  headerTextBlock: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.subText,
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
    maxWidth: 240,
  },
  tableContainer: {
    marginTop: 12,
  },
  menuContainer: {
    alignSelf: 'flex-end',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    paddingBottom: 20,
    gap: 10,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  cancelButtonText: {
    color: colors.subText,
    fontWeight: '600',
  },
});
