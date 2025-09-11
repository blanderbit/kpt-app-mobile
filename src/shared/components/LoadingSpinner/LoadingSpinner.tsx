import React from 'react';
import { View, ActivityIndicator, StyleSheet, Modal } from 'react-native';
import { useCustomTheme } from '@app/theme/ThemeContext';
import { BlurView } from 'expo-blur';

interface LoadingSpinnerProps {
  visible?: boolean;
  size?: 'small' | 'large';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  visible = true, 
  size = 'large' 
}) => {
  const { theme } = useCustomTheme();

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <BlurView intensity={20} style={styles.blurContainer}>
          <View style={[styles.spinnerContainer, { backgroundColor: theme.background }]}>
            <View style={styles.indicatorContainer}>
              <ActivityIndicator
                  size={size}
                  color={'#fff'}
              />
            </View>
          </View>
        </BlurView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  blurContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerContainer: {
    width: 70,
    height: 70,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  indicatorContainer: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 2,
    paddingTop: 3
  }
});
