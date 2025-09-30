export interface OnboardingStep {
  id: number;
  content: React.ReactNode;
}

export interface OnboardingTemplateProps {
  navigation: any;
  steps: OnboardingStep[];
  totalSteps?: number;
}
