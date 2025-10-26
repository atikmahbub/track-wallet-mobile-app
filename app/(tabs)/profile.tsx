import React from 'react';

import ProfileScreen from '@trackingPortal/screens/ProfileScreen';
import {TabScreenContainer} from '@trackingPortal/components';

export default function ProfileRoute() {
  return (
    <TabScreenContainer>
      <ProfileScreen />
    </TabScreenContainer>
  );
}
