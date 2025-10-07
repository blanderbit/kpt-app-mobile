export interface SubscriptionOfferingStep {
  id: number;
  content: React.ReactNode;
  title?: string;
  infoText?: string;
}

export interface SubscriptionOfferingTemplateProps {
  navigation: any;
  onComplete?: () => void;
}

