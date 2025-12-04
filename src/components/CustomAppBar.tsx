import {useAuth} from '@trackingPortal/auth/Auth0ProviderWithHistory';
import {getGreeting} from '@trackingPortal/utils/utils';
import dayjs from 'dayjs';
import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Avatar} from 'react-native-paper';
import {colors} from '@trackingPortal/themes/colors';

const AVATAR_SIZE = 54;

const CustomAppBar: React.FC = () => {
  const {user} = useAuth();

  const greeting = React.useMemo(() => getGreeting(), []);
  const userName = React.useMemo(
    () => user?.name?.split(' ')[0] ?? 'Admin',
    [user],
  );
  const userPicture = React.useMemo(() => user?.picture ?? '', [user]);
  const userInitials = React.useMemo(() => {
    if (userName) {
      return userName.charAt(0).toUpperCase();
    }
    return 'A';
  }, [userName]);
  const todayLabel = React.useMemo(() => dayjs().format('dddd, MMM D'), []);

  return (
    <View style={styles.container}>
      <View style={styles.profileRow}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarGlow} />
          {userPicture ? (
            <Avatar.Image
              size={AVATAR_SIZE}
              style={styles.avatarImage}
              source={{
                uri: userPicture,
              }}
            />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarInitial}>{userInitials}</Text>
            </View>
          )}
        </View>
        <View style={styles.textBlock}>
          <Text style={styles.greetingText}>
            {greeting}, {userName}
          </Text>
        </View>
      </View>
      <View style={styles.datePill}>
        <Text style={styles.dateLabel}>{todayLabel}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 14,
  },
  textBlock: {
    flex: 1,
  },
  greetingText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  avatarWrapper: {
    position: 'relative',
    width: AVATAR_SIZE + 12,
    height: AVATAR_SIZE + 12,
    borderRadius: (AVATAR_SIZE + 12) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    borderWidth: 1.5,
    borderColor: colors.glassBorder,
    backgroundColor: colors.surface,
    shadowColor: colors.overlay,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 4},
    elevation: 4,
  },
  avatarGlow: {
    position: 'absolute',
    top: -6,
    bottom: -6,
    left: -6,
    right: -6,
    borderRadius: (AVATAR_SIZE + 12) / 2,
    backgroundColor: colors.surfaceAlt,
    opacity: 0.6,
    pointerEvents: 'none',
  },
  avatarImage: {
    zIndex: 1,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  dateLabel: {
    color: colors.text,
    fontSize: 11,
    opacity: 0.6,
    letterSpacing: 0.4,
  },
  datePill: {
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.surface,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarFallback: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  avatarInitial: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
});

export default React.memo(CustomAppBar);
