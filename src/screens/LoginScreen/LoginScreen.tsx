import {View, StyleSheet, Image} from 'react-native';
import React from 'react';
import {Button, Text} from 'react-native-paper';
import {useAuth} from '@trackingPortal/auth/Auth0ProviderWithHistory';
import {AnimatedLoader, GlassCard} from '@trackingPortal/components';
import {colors} from '@trackingPortal/themes/colors';

export default function LoginScreen() {
  const {login, loading} = useAuth();

  if (loading) {
    return <AnimatedLoader />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require('@trackingPortal/assets/logo1.png')}
            style={styles.logo}
          />
          <Text style={styles.appName}>TrackWallet</Text>
          <Text style={styles.motto}>Track smarter. Spend brighter.</Text>
        </View>
        <GlassCard style={styles.ctaCard} contentStyle={styles.ctaContent}>
          <Text style={styles.ctaTitle}>Upgrade your wallet flow</Text>
          <Text style={styles.ctaCopy}>
            Sync spending, stay under limits, and feel every interaction with
            gentle haptics and gradients.
          </Text>
          <Button
            mode="contained"
            onPress={login}
            style={styles.loginButton}
            contentStyle={styles.loginButtonContent}
            labelStyle={styles.loginLabel}
            buttonColor={colors.primary}
            textColor={colors.text}>
            Log in
          </Button>
        </GlassCard>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  content: {
    width: '100%',
    paddingHorizontal: 32,
    alignItems: 'center',
    gap: 28,
  },
  glowTop: {
    position: 'absolute',
    width: 360,
    height: 360,
    borderRadius: 360,
    backgroundColor: 'rgba(255, 140, 66, 0.32)',
    top: -120,
    right: -80,
    shadowColor: colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 120,
    shadowOffset: {width: 0, height: 0},
  },
  glowBottom: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 400,
    backgroundColor: 'rgba(255, 217, 160, 0.32)',
    bottom: -160,
    left: -120,
    shadowColor: colors.accent,
    shadowOpacity: 0.35,
    shadowRadius: 120,
    shadowOffset: {width: 0, height: 0},
  },
  logoContainer: {
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 160,
    height: 160,
  },
  appName: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  motto: {
    color: colors.subText,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.6,
  },
  tagline: {
    color: colors.subText,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
  },
  ctaCard: {
    width: '100%',
  },
  ctaContent: {
    gap: 16,
  },
  ctaTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
  },
  ctaCopy: {
    color: colors.subText,
    fontSize: 14,
    lineHeight: 20,
  },
  loginButton: {
    borderRadius: 999,
  },
  loginButtonContent: {
    paddingVertical: 12,
  },
  loginLabel: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.6,
  },
});
