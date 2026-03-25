import {View, StyleSheet, TouchableOpacity, ScrollView, Image} from 'react-native';
import React from 'react';
import {Text} from 'react-native-paper';
import {useAuth} from '@trackingPortal/auth/Auth0ProviderWithHistory';
import {AnimatedLoader} from '@trackingPortal/components';
import {useStoreContext} from '@trackingPortal/contexts/StoreProvider';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '@trackingPortal/themes/colors';

export default function ProfileScreen() {
  const {logout, loading} = useAuth();
  const {currentUser: user} = useStoreContext();
  const firstName = user?.name?.split(' ')?.[0] || 'there';

  if (loading) {
    return <AnimatedLoader />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatarSection}>
        <View style={styles.avatarGlow} />
        <View style={styles.avatarWrapper}>
          <Image
            source={{uri: user?.profilePicture ?? 'https://api.dicebear.com/7.x/avataaars/png?seed=Julian&backgroundColor=transparent'}}
            style={styles.avatarImg}
          />
        </View>
        <Text style={styles.greeting}>Hey, {firstName} 👋</Text>
        <Text style={styles.caption}>
          Welcome back to your financial sanctuary.
        </Text>
      </View>

      <Text style={styles.sectionHeader}>ACCOUNT DETAILS</Text>

      <View style={styles.cardContainer}>
        {/* Name Row */}
        <View style={styles.detailRow}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="account-outline" size={20} color={colors.text} />
          </View>
          <View style={styles.detailTextCol}>
            <Text style={styles.detailLabel}>FULL NAME</Text>
            <Text style={styles.detailValue}>{user?.name || 'Julian Aether Sterling'}</Text>
          </View>
        </View>

        {/* Space */}
        <View style={{height: 24}} />

        {/* Email Row */}
        <View style={styles.detailRow}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="email-outline" size={20} color={colors.text} />
          </View>
          <View style={styles.detailTextCol}>
            <Text style={styles.detailLabel}>EMAIL ADDRESS</Text>
            <Text style={styles.detailValue}>{user?.email || 'j.sterling@aether.finance'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.badgesRow}>
        <View style={styles.smallCard}>
          <MaterialCommunityIcons name="shield-check-outline" size={20} color="#b6f700" style={styles.badgeIcon} />
          <Text style={styles.badgeTitle}>Tier One</Text>
          <Text style={styles.badgeSub}>Verified Member</Text>
        </View>
        <View style={styles.smallCard}>
          <MaterialCommunityIcons name="shield-lock-outline" size={20} color="#fca311" style={styles.badgeIcon} />
          <Text style={styles.badgeTitle}>Privacy</Text>
          <Text style={styles.badgeSub}>Biometrics Active</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        activeOpacity={0.8}
        onPress={() => logout()}>
        <View style={styles.logoutLeft}>
          <View style={styles.logoutIconWrapper}>
            <MaterialCommunityIcons name="logout" size={20} color="#ff8e8b" />
          </View>
          <View>
            <Text style={styles.logoutLabel}>Log out</Text>
            <Text style={styles.logoutHint}>See you soon</Text>
          </View>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color="#4f555c" />
      </TouchableOpacity>

      <Text style={styles.footerText}>TW V4.2.0 • BUILD 991</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 60,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(140, 175, 255, 0.15)', // Neon blue glow from photo
    top: -20,
    shadowColor: '#8cafff',
    shadowOpacity: 0.5,
    shadowRadius: 50,
    shadowOffset: {width: 0, height: 0},
    zIndex: 0,
  },
  avatarWrapper: {
    backgroundColor: '#fff', // White inner background per avatar
    borderRadius: 55,
    padding: 4,
    width: 110,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  avatarImg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f3f4f6', // Inner light shade
  },
  greeting: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    fontFamily: 'Manrope',
    marginTop: 24,
    letterSpacing: -0.5,
  },
  caption: {
    color: '#8a929a',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
    fontWeight: '500',
  },
  sectionHeader: {
    color: '#a0aab5',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  cardContainer: {
    backgroundColor: '#16191d',
    borderRadius: 32,
    padding: 24,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailTextCol: {
    flex: 1,
  },
  detailLabel: {
    color: '#8a929a',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  detailValue: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  smallCard: {
    flex: 1,
    backgroundColor: '#16191d',
    borderRadius: 28,
    padding: 20,
  },
  badgeIcon: {
    marginBottom: 16,
  },
  badgeTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  badgeSub: {
    color: '#8a929a',
    fontSize: 12,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#16191d',
    borderRadius: 36,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 48,
  },
  logoutLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  logoutIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 142, 139, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 142, 139, 0.2)',
  },
  logoutLabel: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  logoutHint: {
    color: '#8a929a',
    fontSize: 13,
    marginTop: 2,
    fontWeight: '500',
  },
  footerText: {
    textAlign: 'center',
    color: '#4f555c',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 3,
    textTransform: 'uppercase',
    paddingBottom: 20,
  },
});
