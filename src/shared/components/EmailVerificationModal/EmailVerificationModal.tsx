import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useCustomTheme } from '@app/theme/ThemeContext';
import { useAuth } from '@app/hooks/auth.hook';
import { useVerifyEmail, useSendVerificationEmail } from '@shared/services/api';
import BottomSheet from '@shared/components/BottomSheet/BottomSheet';
import { Input } from '@shared/components/Input/Input';
import CustomButton from '@shared/components/Button/Button';

interface EmailVerificationModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const { theme } = useCustomTheme();
  const { setEmailVerified, updateEmailVerifiedState } = useAuth();
  const verifyEmailMutation = useVerifyEmail();
  const sendVerificationEmailMutation = useSendVerificationEmail();
  
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [resendSecondsLeft, setResendSecondsLeft] = useState(0);

  // Countdown for resend button
  useEffect(() => {
    if (resendSecondsLeft <= 0) return;
    const timer = setInterval(() => {
      setResendSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendSecondsLeft]);

  // Отправляем код подтверждения при открытии модала
  useEffect(() => {
    if (visible) {
      console.log('EmailVerificationModal opened, sending verification email...');
      sendVerificationEmailMutation.mutate(undefined, {
        onSuccess: () => {
          console.log('Verification email sent successfully');
          setResendSecondsLeft(60);
        },
        onError: (error) => {
          console.error('Failed to send verification email:', error);
          Alert.alert(
            t('main.today.emailVerification.modal.errorTitle'),
            'Failed to send verification email. Please try again.'
          );
        },
      });
    }
  }, [visible]);

  const validateCode = (code: string): boolean => {
    // Проверяем, что код содержит ровно 6 цифр
    const codeRegex = /^\d{6}$/;
    return codeRegex.test(code);
  };

  const handleCodeChange = (text: string) => {
    // Ограничиваем ввод только цифрами и максимум 6 символов
    const numericText = text.replace(/[^0-9]/g, '').slice(0, 6);
    setCode(numericText);
    setError('');
  };

  const handleVerify = async () => {
    if (!code) {
      setError(t('main.today.emailVerification.modal.codeRequired'));
      return;
    }

    if (!validateCode(code)) {
      setError(t('main.today.emailVerification.modal.codeInvalid'));
      return;
    }

    try {
      await verifyEmailMutation.mutateAsync({ code });
      
      // Обновляем флаг emailVerified в локальном хранилище
      await setEmailVerified(true);
      
      // Обновляем состояние emailVerified
      updateEmailVerifiedState(true);
      
      Alert.alert(
        t('main.today.emailVerification.modal.successTitle'),
        t('main.today.emailVerification.modal.successMessage'),
        [
          {
            text: t('ok'),
            onPress: () => {
              onSuccess?.();
              onClose();
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Email verification error:', error);
      Alert.alert(
        t('main.today.emailVerification.modal.errorTitle'),
        t('main.today.emailVerification.modal.errorMessage')
      );
    }
  };

  const handleResendCode = () => {
    if (resendSecondsLeft > 0) return;
    console.log('Resending verification code...');
    sendVerificationEmailMutation.mutate(undefined, {
      onSuccess: () => {
        console.log('Verification code resent successfully');
        Alert.alert(
          'Code Sent',
          'A new verification code has been sent to your email'
        );
        setResendSecondsLeft(60);
      },
      onError: (error) => {
        console.error('Failed to resend verification code:', error);
        Alert.alert(
          t('main.today.emailVerification.modal.errorTitle'),
          'Failed to resend verification code. Please try again.'
        );
      },
    });
  };

  const handleClose = () => {
    setCode('');
    setError('');
    onClose();
  };

  const isButtonDisabled = !code || !validateCode(code) || verifyEmailMutation.isPending;

  return (
    <BottomSheet
      visible={visible}
      onClose={handleClose}
      title={t('main.today.emailVerification.modal.title')}
      button={
        <View style={styles.buttonContainer}>
          <CustomButton
            title={t('main.today.emailVerification.modal.verifyButton')}
            onPress={handleVerify}
            disabled={isButtonDisabled}
            themeName={isButtonDisabled ? 'primary_disabled' : 'primary'}
          />
          <CustomButton
            title={resendSecondsLeft > 0 ? `${t('main.today.emailVerification.modal.resendButton')} (${resendSecondsLeft}s)` : t('main.today.emailVerification.modal.resendButton')}
            onPress={handleResendCode}
            disabled={sendVerificationEmailMutation.isPending || resendSecondsLeft > 0}
            themeName={'secondary'}
            buttonStyle={styles.resendButton}
          />
        </View>
      }
    >
      <View style={styles.content}>
        <Text style={[styles.description, theme.fonts.regular]}>
          {t('main.today.emailVerification.modal.description')}
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
    marginBottom: 8,
  },
  buttonContainer: {
    gap: 12,
  },
  resendButton: {
    marginTop: 8,
  },
});
