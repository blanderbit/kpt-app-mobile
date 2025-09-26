import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useCustomTheme } from '@app/theme/ThemeContext';
import { useConfirmEmailChange } from '@shared/services/api';
import BottomSheet from '@shared/components/BottomSheet/BottomSheet';
import { Input } from '@shared/components/Input/Input';
import CustomButton from '@shared/components/Button/Button';

interface EmailChangeConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  title?: string;
  description?: string;
}

export const EmailChangeConfirmationModal: React.FC<EmailChangeConfirmationModalProps> = ({
  visible,
  onClose,
  onSuccess,
  title,
  description,
}) => {
  const { t } = useTranslation();
  const { theme } = useCustomTheme();
  const confirmEmailChangeMutation = useConfirmEmailChange();
  
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [resendSecondsLeft, setResendSecondsLeft] = useState(0);

  // Countdown after successful change-email request? We only enable resend if parent wants to trigger it.
  useEffect(() => {
    if (resendSecondsLeft <= 0) return;
    const timer = setInterval(() => {
      setResendSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendSecondsLeft]);

  const validateCode = (code: string): boolean => {
    // Проверяем, что код содержит ровно 6 цифр
    const codeRegex = /^\d{6}$/;
    return codeRegex.test(code);
  };

  const handleCodeChange = (text: string) => {
    setCode(text);
    setError('');
  };

  const handleVerify = async () => {
    if (!validateCode(code)) {
      setError(t('main.today.emailVerification.modal.codeInvalid'));
      return;
    }

    try {
      console.log('📧 Подтверждаем изменение email с кодом:', code);
      
      await confirmEmailChangeMutation.mutateAsync({
        code: code,
      });
      
      console.log('✅ Email успешно подтвержден и изменен');
      
      Alert.alert(
        t('main.today.emailVerification.modal.successTitle'),
        t('main.today.emailVerification.modal.successMessage'),
        [
          {
            text: t('ok'),
            onPress: () => {
              onSuccess?.();
              handleClose();
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('❌ Ошибка подтверждения изменения email:', error);
      setError(error.message || t('main.today.emailVerification.modal.errorMessage'));
    }
  };

  const handleClose = () => {
    setCode('');
    setError('');
    onClose();
  };

  const isButtonDisabled = !code || !validateCode(code) || confirmEmailChangeMutation.isPending;

  return (
    <BottomSheet
      visible={visible}
      onClose={handleClose}
      title={title || t('main.profile.personalInfoScreen.confirmEmailChange')}
      button={
        <View style={styles.buttonContainer}>
          <CustomButton
            title={t('main.today.emailVerification.modal.verifyButton')}
            onPress={handleVerify}
            disabled={isButtonDisabled}
            themeName={isButtonDisabled ? 'primary_disabled' : 'primary'}
          />
          {/* Optional resend (disabled until we add dedicated API). Keep UI with countdown for parity */}
          <CustomButton
            title={resendSecondsLeft > 0 ? `${t('main.today.emailVerification.modal.resendButton')} (${resendSecondsLeft}s)` : t('main.today.emailVerification.modal.resendButton')}
            onPress={() => setResendSecondsLeft(60)}
            disabled={resendSecondsLeft > 0}
            themeName={'secondary'}
          />
        </View>
      }
    >
      <View style={styles.content}>
        <Text style={[styles.description, theme.fonts.regular]}>
          {description || t('main.profile.personalInfoScreen.confirmEmailChangeDescription')}
        </Text>
        
        <Input
          label={t('main.today.emailVerification.modal.codeLabel')}
          placeholder={t('main.today.emailVerification.modal.codePlaceholder')}
          value={code}
          onChangeText={handleCodeChange}
          error={error}
        />
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  content: {
    gap: 24,
  },
  description: {
    textAlign: 'center',
    color: '#666',
  },
  buttonContainer: {
    gap: 12,
  },
});
