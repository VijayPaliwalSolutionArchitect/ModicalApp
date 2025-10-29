import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS, BORDER_RADIUS } from '../config/theme';

const Card = ({ children, style, onPress, ...props }) => {
  if (onPress) {
    return (
      <TouchableOpacity
        style={[styles.card, SHADOWS.sm, style]}
        onPress={onPress}
        activeOpacity={0.7}
        {...props}>
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.card, SHADOWS.sm, style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
  },
});

export default Card;