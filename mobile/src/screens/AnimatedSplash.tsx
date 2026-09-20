import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import { theme } from '../theme';

const { width, height } = Dimensions.get('window');

interface Props {
  isAuthLoaded: boolean;
  onAnimationComplete: () => void;
}

export function AnimatedSplash({ isAuthLoaded, onAnimationComplete }: Props) {
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(20)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  const [sequenceDone, setSequenceDone] = useState(false);

  useEffect(() => {
    // 0.4 - 1.1s (700ms): Glow fade in
    Animated.sequence([
      Animated.delay(400),
      Animated.timing(glowOpacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
    ]).start();

    // 0.8 - 1.6s (800ms): Logo scale + fade
    Animated.sequence([
      Animated.delay(800),
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        })
      ])
    ]).start();

    // 1.4 - 2.0s (600ms): Title fade + slide
    Animated.sequence([
      Animated.delay(1400),
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(titleTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        })
      ])
    ]).start();

    // 1.8 - 2.4s (600ms): Tagline fade
    Animated.sequence([
      Animated.delay(1800),
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      })
    ]).start();

    // 2.8s: Signal sequence complete
    const timer = setTimeout(() => {
      setSequenceDone(true);
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  // Exit animation triggers only when both the 2.8s sequence is done AND auth is loaded
  useEffect(() => {
    if (sequenceDone && isAuthLoaded) {
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }).start(() => {
        onAnimationComplete();
      });
    }
  }, [sequenceDone, isAuthLoaded]);

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      {/* Background and glow */}
      <View style={styles.background} />

      {/* Abstract geometric shapes */}
      <View style={styles.gridContainer}>
        <View style={styles.abstractShape1} />
        <View style={styles.abstractShape2} />
      </View>

      <Animated.View style={[styles.glowContainer, { opacity: glowOpacity }]}>
        <View style={styles.glowCore} />
        <View style={styles.glowOuter} />
      </Animated.View>

      <View style={styles.content}>
        {/* Logo Symbol */}
        <Animated.View style={[
          styles.logoContainer, 
          { 
            opacity: logoOpacity,
            transform: [{ scale: logoScale }] 
          }
        ]}>
          <View style={styles.logoBox}>
            {/* Minimal glowing 'P' as the icon */}
            <Text style={styles.logoP}>P</Text>
            {/* Subtle neon green sweep/accent */}
            <View style={styles.accentLine} />
          </View>
        </Animated.View>

        {/* Brand Text */}
        <Animated.View style={[
          styles.titleContainer,
          {
            opacity: titleOpacity,
            transform: [{ translateY: titleTranslateY }]
          }
        ]}>
          <Text style={styles.title}>PCPlace</Text>
        </Animated.View>

        {/* Tagline */}
        <Animated.View style={{ opacity: taglineOpacity }}>
          <Text style={styles.tagline}>Find. Book. Play.</Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 9999, // Ensure it's always on top
    backgroundColor: theme.colors.background,
  },
  background: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: theme.colors.background, // #0a0a0f
  },
  gridContainer: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    overflow: 'hidden',
    opacity: 0.8,
  },
  abstractShape1: {
    position: 'absolute',
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: theme.colors.border, // #2a2a35
    top: -width * 0.5,
    left: -width * 0.25,
    opacity: 0.15,
  },
  abstractShape2: {
    position: 'absolute',
    width: width,
    height: width,
    borderRadius: 40,
    backgroundColor: theme.colors.surface, // #12121a
    bottom: -width * 0.3,
    right: -width * 0.2,
    opacity: 0.2,
    transform: [{ rotate: '45deg' }],
  },
  glowContainer: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowCore: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width,
    backgroundColor: theme.colors.primary, // #a855f7
    opacity: 0.08,
    transform: [{ scale: 1.2 }],
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 50,
    elevation: 20,
  },
  glowOuter: {
    position: 'absolute',
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: width,
    backgroundColor: '#7e22ce', // Primary Dark
    opacity: 0.05,
    transform: [{ scale: 1.5 }],
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoBox: {
    width: 86,
    height: 86,
    borderRadius: 24,
    backgroundColor: 'rgba(168,85,247,0.06)',
    borderWidth: 1.5,
    borderColor: 'rgba(168,85,247,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoP: {
    color: '#ffffff',
    fontSize: 48,
    fontWeight: '900',
    fontFamily: 'System',
    textShadowColor: 'rgba(168,85,247,0.7)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  accentLine: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: theme.colors.accent, // #00ff88
    borderTopLeftRadius: 8,
    opacity: 0.8,
  },
  titleContainer: {
    marginBottom: 8,
  },
  title: {
    color: theme.colors.text,
    fontSize: 34,
    fontWeight: '800',
    fontFamily: 'System',
    letterSpacing: 1.5,
  },
  tagline: {
    color: theme.colors.textMuted,
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'System',
    letterSpacing: 2.5,
  },
});
