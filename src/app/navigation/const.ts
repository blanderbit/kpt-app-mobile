export enum Routes {
    LOGIN = 'Login',
    SIGN_UP = 'SignUp',
    RESET_PASS = 'ResetPass',
    CHECK_EMAIL = 'CheckEmail',
    TODAY = 'Today',
    ACTIVITIES = 'Activities',
    PROFILE = 'Profile',
    PERSONAL_INFO = 'PersonalInfo',
    SUBSCRIPTION_SETTINGS = 'SubscriptionSettings',
    ARTICLE = 'Article',
    SURVEY = 'Survey',
    SURVEY_QUESTIONS = 'SurveyQuestions',
    REDIRECT = 'Redirect',
    ONBOARDING = 'Onboarding',
}

export enum TooltipPage {
    DASHBOARD = 'dashboard',
    PROFILE = 'profile',
    SETTINGS = 'settings',
    ACTIVITIES = 'activities',
    MOOD_TRACKER = 'mood-tracker',
    ANALYTICS = 'analytics',
    HELP = 'help',
    ONBOARDING = 'onboarding',
    TUTORIAL = 'tutorial',
    WELCOME = 'welcome'
}

export const TooltipPagesConfig = {
    [Routes.TODAY]: TooltipPage.DASHBOARD,
    [Routes.ACTIVITIES]: TooltipPage.ACTIVITIES,
    [Routes.PROFILE]: TooltipPage.SETTINGS,
    [Routes.PERSONAL_INFO]: TooltipPage.PROFILE,
    [Routes.ONBOARDING]: TooltipPage.ONBOARDING,
    [Routes.LOGIN]: TooltipPage.WELCOME,
}
