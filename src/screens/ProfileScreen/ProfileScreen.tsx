import {View, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {Avatar, Text} from 'react-native-paper';
import {useAuth} from '@trackingPortal/auth/Auth0ProviderWithHistory';
import {AnimatedLoader, ValueWithLabel, GlassCard} from '@trackingPortal/components';
import {useStoreContext} from '@trackingPortal/contexts/StoreProvider';
import {ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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
        <Avatar.Image
          size={110}
          source={{
            uri: user?.profilePicture ?? '',
          }}
          style={styles.avatar}
        />
        <Text style={styles.greeting}>Hey, {firstName} 👋</Text>
        <Text style={styles.caption}>
          {"Here's a quick peek at your identity inside TrackWallet."}
        </Text>
      </View>
      <GlassCard
        style={styles.profileCard}
        contentStyle={styles.profileCardContent}>
        <Text style={styles.cardTitle}>Account Details</Text>
        <View style={styles.cardDivider} />
        <ValueWithLabel label="Full Name" value={user?.name || 'N/A'} />
        <ValueWithLabel label="Email Address" value={user?.email || 'N/A'} />
      </GlassCard>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          logout();
        }}>
        <View style={styles.logoutIconWrapper}>
          <Icon name="logout" size={22} color={colors.error} />
        </View>
        <View>
          <Text style={styles.logoutLabel}>Log out</Text>
          <Text style={styles.logoutHint}>See you soon</Text>
        </View>
      </TouchableOpacity>
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
    marginBottom: 32,
  },
  avatarGlow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 180,
    backgroundColor: 'rgba(255, 140, 66, 0.28)',
    top: -4,
    shadowColor: colors.primary,
    shadowOpacity: 0.45,
    shadowRadius: 60,
    shadowOffset: {width: 0, height: 0},
  },
  avatar: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  greeting: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '700',
    marginTop: 20,
  },
  caption: {
    color: colors.subText,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
    maxWidth: 280,
  },
  profileCard: {
    marginTop: 8,
  },
  profileCardContent: {
    gap: 12,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  cardDivider: {
    height: 1,
    backgroundColor: colors.glassBorder,
    opacity: 0.5,
    marginBottom: 12,
  },
  logoutButton: {
    marginTop: 28,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.surface,
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  logoutIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.badgeNegativeBorder,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.badgeNegativeBg,
  },
  logoutLabel: {
    color: colors.error,
    fontSize: 17,
    fontWeight: '700',
  },
  logoutHint: {
    color: colors.subText,
    fontSize: 13,
    marginTop: 2,
  },
});
