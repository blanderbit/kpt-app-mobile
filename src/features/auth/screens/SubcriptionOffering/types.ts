export interface SubscriptionOfferingStep {
  id: number;
  content: React.ReactNode;
  title?: string;
  infoText?: string;
}

export type SubscriptionOfferingVariant = 'onboarding' | 'settings';

export interface SubscriptionOfferingTemplateProps {
  navigation: any;
  onComplete?: () => void;
  variant?: SubscriptionOfferingVariant;
}

