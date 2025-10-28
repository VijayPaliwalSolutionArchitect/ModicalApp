import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS, BORDER_RADIUS } from '../config/theme';

const Button = ({
  children,
  onPress,
  variant = 'solid',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  ...props
}) => {
  const renderContent = () => (
    <View style={[styles.container, fullWidth && styles.fullWidth]}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'solid' ? COLORS.surface : COLORS.primary}
        />
      ) : (
        <Text
          style={[
            styles.text,
            styles[`text_${variant}`],
            styles[`text_${size}`],
            disabled && styles.textDisabled,
            textStyle,
          ]}>
          {children}
        </Text>
      )}
    </View>
  );

  if (variant === 'solid') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[fullWidth && { width: '100%' }]}
        {...props}>
        <LinearGradient
          colors={COLORS.gradientPrimary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.button,
            styles[`button_${size}`],
            styles.buttonSolid,
            disabled && styles.buttonDisabled,
            fullWidth && styles.fullWidth,
            style,
          ]}>
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.button,
        styles[`button_${size}`],
        styles[`button_${variant}`],
        disabled && styles.buttonDisabled,
        fullWidth && styles.fullWidth,
        style,
      ]}
      {...props}>
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  button_small: {
    height: 40,
    paddingHorizontal: SPACING.lg,
  },
  button_medium: {
    height: 56,
    paddingHorizontal: SPACING.xl,
  },
  button_large: {
    height: 64,
    paddingHorizontal: SPACING['2xl'],
  },
  buttonSolid: {
    backgroundColor: COLORS.primary,
  },
  button_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  button_ghost: {
    backgroundColor: 'transparent',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  fullWidth: {
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    fontSize: TYPOGRAPHY.fontSize.base,
  },
  text_solid: {
    color: COLORS.surface,
  },
  text_outline: {
    color: COLORS.primary,
  },
  text_ghost: {
    color: COLORS.primary,
  },
  text_small: {
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
  text_medium: {
    fontSize: TYPOGRAPHY.fontSize.base,
  },
  text_large: {
    fontSize: TYPOGRAPHY.fontSize.lg,
  },
  textDisabled: {
    opacity: 0.6,
  },
});

export default Button;