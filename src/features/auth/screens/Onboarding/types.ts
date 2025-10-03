export interface OnboardingStep {
  id: number;
  content: React.ReactNode;
  title?: string;
  infoText?: string;
  hasStyledNumber?: boolean;
}

export interface OnboardingTemplateProps {
  navigation: any;
  steps: OnboardingStep[];
  totalSteps?: number;
}
