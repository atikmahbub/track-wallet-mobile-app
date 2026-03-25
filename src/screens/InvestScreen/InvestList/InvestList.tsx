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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
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
  const [expandedRowId, setExpandedRowId] = useState<InvestId | null>(null);
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
      <View style={styles.listCard}>
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
          {invests.map((invest, index) => {
            const isRowOpen = expandedRowId === invest.id;
            const ICONS = ['file-document-outline', 'chart-line-variant', 'domain'];
            const ICON_COLORS = ['#fca311', '#a0abff', '#b6f700'];
            const iconSelection = index % 3;
            
            return (
              <Fragment key={invest.id}>
                <TouchableOpacity 
                  activeOpacity={0.8}
                  onPress={() => setExpandedRowId(isRowOpen ? null : invest.id)}
                  style={styles.customRow}>
                  <View style={styles.rowLeft}>
                    <View style={styles.circleIcon}>
                      <MaterialCommunityIcons name={ICONS[iconSelection]} size={20} color={ICON_COLORS[iconSelection]} />
                    </View>
                    <View>
                      <Text style={styles.itemName}>{invest.name}</Text>
                      <Text style={styles.itemSub}>{dayjs(makeUnixTimestampToNumber(Number(invest.startDate))).format('MMM D, YYYY')}</Text>
                    </View>
                  </View>
                  <View style={styles.rowRight}>
                    <Text style={styles.itemAmount}>
                      {invest.amount < 0 ? '-' : ''}${Math.abs(invest.amount)}
                    </Text>
                    <Text style={[
                      styles.itemStatus, 
                      invest.status === EInvestStatus.Completed && styles.itemMatured
                    ]}>
                      {invest.status === EInvestStatus.Completed ? 'MATURED' : (index % 2 === 0 ? 'GROWTH' : 'STABLE')}
                    </Text>
                  </View>
                </TouchableOpacity>
                {isRowOpen && (
                  <View style={styles.expandedContent}>
                     {renderCollapsibleContent(invest)}
                  </View>
                )}
              </Fragment>
            );
          })}
        </View>
      </View>
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
    gap: 10,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
  cancelButtonText: {
    color: colors.subText,
    fontWeight: '600',
  },
  customRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#16191d',
    padding: 16,
    borderRadius: 24,
    marginBottom: 8,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  circleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  itemSub: {
    color: '#8a929a',
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  rowRight: {
    alignItems: 'flex-end',
  },
  itemAmount: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'Manrope',
    letterSpacing: -0.2,
  },
  itemStatus: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginTop: 4,
    textTransform: 'uppercase',
    color: '#8cafff',  // Growth purple
  },
  itemMatured: {
    color: '#b6f700',  // Matured green
  },
  expandedContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#16191d',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginTop: -20,
    paddingTop: 24,
    marginBottom: 8,
  },
});
