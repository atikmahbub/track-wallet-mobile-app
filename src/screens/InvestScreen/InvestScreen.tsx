import {FlatList, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {RefreshControl} from 'react-native-gesture-handler';
import InvestSummary from '@trackingPortal/screens/InvestScreen/InvestSummary';
import InvestList from '@trackingPortal/screens/InvestScreen/InvestList';
import {AnimatedFAB} from 'react-native-paper';
import {InvestModel, LoanModel} from '@trackingPortal/api/models';
import {useStoreContext} from '@trackingPortal/contexts/StoreProvider';
import Toast from 'react-native-toast-message';
import InvestCreation from '@trackingPortal/screens/InvestScreen/InvestCreation';
import {EInvestStatus} from '@trackingPortal/api/enums';
import {AnimatedLoader} from '@trackingPortal/components';
import {darkTheme} from '@trackingPortal/themes/darkTheme';

export default function InvestScreen() {
  const [openCreationModal, setOpenCreationModal] = useState<boolean>(false);
  const [hideFabIcon, setHideFabIcon] = useState<boolean>(false);
  const [invests, setInvests] = useState<InvestModel[]>([]);
  const {currentUser: user, apiGateway} = useStoreContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [status, setStatus] = React.useState<EInvestStatus>(
    EInvestStatus.Active,
  );

  useEffect(() => {
    if (!user.default) {
      getUserInvestHistory();
    }
  }, [user, status]);

  const getUserInvestHistory = async () => {
    try {
      setLoading(true);
      const response = await apiGateway.investService.getInvestByUserId({
        userId: user.userId,
        status: status,
      });
      setInvests(response);
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

  const handleRefresh = async () => {
    setRefreshing(true);
    await getUserInvestHistory();
    setRefreshing(false);
  };

  if (loading) {
    return <AnimatedLoader />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={invests}
        keyExtractor={(item, index) => `${item.id || index}`}
        ListHeaderComponent={
          <InvestSummary investList={invests} status={status} />
        }
        ListFooterComponent={
          <InvestList
            invests={invests}
            getUserInvestHistory={getUserInvestHistory}
            notifyRowOpen={value => setHideFabIcon(value)}
            status={status}
            setStatus={setStatus}
          />
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        renderItem={null}
        contentContainerStyle={styles.listContent}
      />
      <InvestCreation
        openCreationModal={openCreationModal}
        setOpenCreationModal={setOpenCreationModal}
        getUserInvestHistory={getUserInvestHistory}
      />
      {!hideFabIcon && (
        <AnimatedFAB
          extended={false}
          icon={'plus'}
          animateFrom={'right'}
          iconMode={'static'}
          label="Add New"
          style={styles.fabStyle}
          onPress={() => setOpenCreationModal(true)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.colors.background,
  },
  fabStyle: {
    bottom: 25,
    right: 25,
    position: 'absolute',
  },
  listContent: {
    paddingBottom: 80,
  },
});
