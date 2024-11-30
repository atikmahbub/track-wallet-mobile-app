import {View, Text, StyleSheet} from 'react-native';
import React, {Fragment, useEffect, useState} from 'react';
import {darkTheme} from '@trackingPortal/themes/darkTheme';
import {ScrollView} from 'react-native-gesture-handler';
import LoanSummary from '@trackingPortal/screens/LoanScreen/LoanSummary';
import LoanList from '@trackingPortal/screens/LoanScreen/LoanList';
import {AnimatedFAB} from 'react-native-paper';
import {LoanModel} from '@trackingPortal/api/models';
import {useStoreContext} from '@trackingPortal/contexts/StoreProvider';
import Toast from 'react-native-toast-message';
import LoanCreation from '@trackingPortal/screens/LoanScreen/LoanCreation';

export default function LoanScreen() {
  const [openCreationModal, setOpenCreationModal] = useState<boolean>(false);
  const [hideFabIcon, setHideFabIcon] = useState<boolean>(false);
  const [loans, setLoans] = useState<LoanModel[]>([]);
  const {currentUser: user, apiGateway} = useStoreContext();

  useEffect(() => {
    if (!user.default) {
      getUserLoans();
    }
  }, [user]);

  const getUserLoans = async () => {
    try {
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
    }
  };

  return (
    <Fragment>
      <ScrollView>
        <LoanSummary totalGiven={12} totalBorrowed={23} />
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
