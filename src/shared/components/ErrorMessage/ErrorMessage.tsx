import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@app/theme';

interface ErrorMessageProps {
  message: string;
  visible?: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, visible = true }) => {
  if (!visible || !message) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.error + '20',
    borderColor: COLORS.error,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },
  text: {
    color: COLORS.error,
    fontSize: 14,
    fontFamily: 'Inter',
    textAlign: 'center',
  },
});
