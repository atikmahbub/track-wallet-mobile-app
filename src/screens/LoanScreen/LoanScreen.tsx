import {StyleSheet} from 'react-native';
import React, {Fragment, useEffect, useState} from 'react';
import {RefreshControl, ScrollView} from 'react-native-gesture-handler';
import LoanSummary from '@trackingPortal/screens/LoanScreen/LoanSummary';
import LoanList from '@trackingPortal/screens/LoanScreen/LoanList';
import {AnimatedFAB} from 'react-native-paper';
import {LoanModel} from '@trackingPortal/api/models';
import {useStoreContext} from '@trackingPortal/contexts/StoreProvider';
import Toast from 'react-native-toast-message';
import LoanCreation from '@trackingPortal/screens/LoanScreen/LoanCreation';
import {LoanType} from '@trackingPortal/api/enums';
import {AnimatedLoader} from '@trackingPortal/components';

export default function LoanScreen() {
  const [openCreationModal, setOpenCreationModal] = useState<boolean>(false);
  const [hideFabIcon, setHideFabIcon] = useState<boolean>(false);
  const [loans, setLoans] = useState<LoanModel[]>([]);
  const {currentUser: user, apiGateway} = useStoreContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    if (!user.default) {
      getUserLoans();
    }
  }, [user]);

  const getUserLoans = async () => {
    try {
      setLoading(true);
      const response = await apiGateway.loanServices.getLoanByUserId(
        user.userId,
      );
      setLoans(response);
    } catch (error) {
      console.log('error', error);
      Toast.show({
        type: 'error',
        text1: 'Something went wrong!',
      });
    } finally {
      setLoading(false);
    }
  };

  const totalGiven = loans?.reduce((acc, crr): number => {
    if (crr.loanType === LoanType.GIVEN) {
      acc += crr.amount;
    }
    return acc;
  }, 0);

  const totalBorrowed = loans?.reduce((acc, crr): number => {
    if (crr.loanType === LoanType.TAKEN) {
      acc += crr.amount;
    }
    return acc;
  }, 0);

  const handleRefresh = async () => {
    setRefreshing(true);
    await getUserLoans();
    setRefreshing(false);
  };

  if (loading) {
    return <AnimatedLoader />;
  }

  return (
    <Fragment>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }>
        <LoanSummary totalGiven={totalGiven} totalBorrowed={totalBorrowed} />
        <LoanList
          notifyRowOpen={value => setHideFabIcon(value)}
          loans={loans}
          getUserLoan={getUserLoans}
        />
        <LoanCreation
          getUserLoans={getUserLoans}
          openCreationModal={openCreationModal}
          setOpenCreationModal={setOpenCreationModal}
        />
      </ScrollView>
      {!hideFabIcon && (
        <AnimatedFAB
          extended={false}
          icon={'plus'}
          animateFrom={'right'}
          iconMode={'static'}
          label="Add New"
          style={styles.fabStyle}
          onPress={() => {
            setOpenCreationModal(true);
          }}
        />
      )}
    </Fragment>
  );
}

const styles = StyleSheet.create({
  fabStyle: {
    bottom: 25,
    right: 25,
    position: 'absolute',
  },
});
