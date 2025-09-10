import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useCustomTheme } from '@app/theme/ThemeContext';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Загрузка...', 
  size = 'large' 
}) => {
  const { theme } = useCustomTheme();

  return (
    <View style={[styles.container, theme.flexBlocks.justifyCenter, theme.flexBlocks.alignCenter]}>
      <ActivityIndicator size={size} color={theme.background} />
      {message && (
        <Text style={[styles.text, theme.fonts.regular, { color: '#fff' }]}>
          {message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  text: {
    marginTop: 12,
    fontSize: 16,
  },
});
