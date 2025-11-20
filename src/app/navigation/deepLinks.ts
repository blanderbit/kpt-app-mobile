import { Routes } from './const';

/**
 * Конфигурация Deep Links для нотификаций
 * 
 * Формат deep link: kptapp://route?param1=value1&param2=value2
 * 
 * Примеры:
 * - kptapp://today
 * - kptapp://article?id=123
 * - kptapp://survey?id=456
 */

export const DEEP_LINK_SCHEME = 'kptapp';

/**
 * Типы параметров для каждого роута
 */
export interface DeepLinkParams {
  [Routes.TODAY]: {};
  [Routes.ACTIVITIES]: {};
  [Routes.PROFILE]: {};
  [Routes.PERSONAL_INFO]: {};
  [Routes.SUBSCRIPTION_SETTINGS]: {};
  [Routes.ARTICLE]: { id: string };
  [Routes.SURVEY]: { id: string };
  [Routes.SURVEY_QUESTIONS]: { surveyId: string }; // Используем surveyId вместо полного объекта
  [Routes.LOGIN]: {};
  [Routes.SIGN_UP]: {};
  [Routes.RESET_PASS]: {};
  [Routes.CHECK_EMAIL]: { email: string };
  [Routes.ONBOARDING]: {};
}

/**
 * Список всех доступных deep links с описанием
 */
export const DEEP_LINKS = {
  /**
   * Главный экран (Today/Dashboard)
   * Использование: для нотификаций общего характера, напоминаний
   * Пример: kptapp://today
   */
  TODAY: {
    route: Routes.TODAY,
    path: 'today',
    params: {},
    description: 'Главный экран приложения',
    requiresAuth: true,
  },

  /**
   * Экран активностей
   * Использование: для нотификаций о новых активностях, напоминаний об активностях
   * Пример: kptapp://activities
   */
  ACTIVITIES: {
    route: Routes.ACTIVITIES,
    path: 'activities',
    params: {},
    description: 'Экран со списком активностей',
    requiresAuth: true,
  },

  /**
   * Экран профиля
   * Использование: для нотификаций о настройках профиля, подписке
   * Пример: kptapp://profile
   */
  PROFILE: {
    route: Routes.PROFILE,
    path: 'profile',
    params: {},
    description: 'Экран профиля пользователя',
    requiresAuth: true,
  },

  /**
   * Экран личной информации
   * Использование: для нотификаций о необходимости обновить профиль
   * Пример: kptapp://personal-info
   */
  PERSONAL_INFO: {
    route: Routes.PERSONAL_INFO,
    path: 'personal-info',
    params: {},
    description: 'Экран редактирования личной информации',
    requiresAuth: true,
  },

  /**
   * Экран настроек подписки
   * Использование: для нотификаций о подписке, истечении подписки, промо-акциях
   * Пример: kptapp://subscription-settings
   */
  SUBSCRIPTION_SETTINGS: {
    route: Routes.SUBSCRIPTION_SETTINGS,
    path: 'subscription-settings',
    params: {},
    description: 'Экран настроек подписки',
    requiresAuth: true,
  },

  /**
   * Экран статьи
   * Использование: для нотификаций о новых статьях, рекомендуемых статьях
   * Пример: kptapp://article?id=123
   * 
   * @param id - ID статьи (обязательный параметр)
   */
  ARTICLE: {
    route: Routes.ARTICLE,
    path: 'article',
    params: { id: '' },
    description: 'Экран просмотра статьи',
    requiresAuth: true,
    buildUrl: (id: string) => `${DEEP_LINK_SCHEME}://article?id=${id}`,
  },

  /**
   * Экран опроса
   * Использование: для нотификаций о новых опросах, напоминаний об опросах
   * Пример: kptapp://survey?id=456
   * 
   * @param id - ID опроса (обязательный параметр)
   */
  SURVEY: {
    route: Routes.SURVEY,
    path: 'survey',
    params: { id: '' },
    description: 'Экран просмотра опроса',
    requiresAuth: true,
    buildUrl: (id: string) => `${DEEP_LINK_SCHEME}://survey?id=${id}`,
  },


  /**
   * Экран входа
   * Использование: для нотификаций, требующих авторизации (редко используется)
   * Пример: kptapp://login
   */
  LOGIN: {
    route: Routes.LOGIN,
    path: 'login',
    params: {},
    description: 'Экран входа в приложение',
    requiresAuth: false,
  },

  /**
   * Экран регистрации
   * Использование: для нотификаций о приглашении зарегистрироваться
   * Пример: kptapp://sign-up
   */
  SIGN_UP: {
    route: Routes.SIGN_UP,
    path: 'sign-up',
    params: {},
    description: 'Экран регистрации',
    requiresAuth: false,
  },

  /**
   * Экран сброса пароля
   * Использование: для нотификаций о сбросе пароля
   * Пример: kptapp://reset-pass
   */
  RESET_PASS: {
    route: Routes.RESET_PASS,
    path: 'reset-pass',
    params: {},
    description: 'Экран сброса пароля',
    requiresAuth: false,
  },

  /**
   * Экран проверки email
   * Использование: для нотификаций о подтверждении email
   * Пример: kptapp://check-email?email=user@example.com
   * 
   * @param email - Email пользователя (обязательный параметр)
   */
  CHECK_EMAIL: {
    route: Routes.CHECK_EMAIL,
    path: 'check-email',
    params: { email: '' },
    description: 'Экран проверки email',
    requiresAuth: false,
    buildUrl: (email: string) => `${DEEP_LINK_SCHEME}://check-email?email=${encodeURIComponent(email)}`,
  },

  /**
   * Экран онбординга
   * Использование: для нотификаций новым пользователям
   * Пример: kptapp://onboarding
   */
  ONBOARDING: {
    route: Routes.ONBOARDING,
    path: 'onboarding',
    params: {},
    description: 'Экран онбординга',
    requiresAuth: false,
  },
} as const;

/**
 * Тип для конфигурации deep link
 */
export type DeepLinkConfig = typeof DEEP_LINKS[keyof typeof DEEP_LINKS];

/**
 * Утилита для построения deep link URL
 */
export class DeepLinkBuilder {
  /**
   * Строит URL для статьи
   */
  static article(id: string): string {
    return `${DEEP_LINK_SCHEME}://article?id=${id}`;
  }

  /**
   * Строит URL для опроса
   */
  static survey(id: string): string {
    return `${DEEP_LINK_SCHEME}://survey?id=${id}`;
  }

  /**
   * Строит URL для прохождения опроса
   * ВАЖНО: Прямых deep links на SurveyQuestions нет, используйте survey() для перехода к опросу
   */
  static surveyQuestions(surveyId: string): string {
    // Перенаправляем на Survey, откуда пользователь может начать прохождение
    return this.survey(surveyId);
  }

  /**
   * Строит URL для проверки email
   */
  static checkEmail(email: string): string {
    return `${DEEP_LINK_SCHEME}://check-email?email=${encodeURIComponent(email)}`;
  }

  /**
   * Строит URL для любого роута без параметров
   */
  static route(route: Routes): string {
    const config = Object.values(DEEP_LINKS).find(link => link.route === route);
    if (!config) {
      throw new Error(`Deep link config not found for route: ${route}`);
    }
    return `${DEEP_LINK_SCHEME}://${config.path}`;
  }
}

/**
 * Парсит deep link URL и возвращает роут с параметрами
 * 
 * @param url - Deep link URL (например, "kptapp://article?id=123")
 * @returns Объект с роутом и параметрами или null если URL невалидный
 */
export function parseDeepLink(url: string): { route: Routes; params: any } | null {
  try {
    // Убираем схему и получаем путь с параметрами
    const urlWithoutScheme = url.replace(`${DEEP_LINK_SCHEME}://`, '');
    const [path, queryString] = urlWithoutScheme.split('?');

    // Находим конфигурацию по пути
    const config = Object.values(DEEP_LINKS).find(link => link.path === path);
    if (!config) {
      console.warn(`[DeepLink] Unknown path: ${path}`);
      return null;
    }

    // Парсим параметры из query string
    const params: any = { ...config.params };
    if (queryString) {
      const queryParams = new URLSearchParams(queryString);
      queryParams.forEach((value, key) => {
        params[key] = value;
      });
    }

    // Проверяем обязательные параметры
    if (config.route === Routes.ARTICLE && !params.id) {
      console.warn('[DeepLink] Missing required parameter "id" for ARTICLE route');
      return null;
    }
    if (config.route === Routes.SURVEY && !params.id) {
      console.warn('[DeepLink] Missing required parameter "id" for SURVEY route');
      return null;
    }
    if (config.route === Routes.CHECK_EMAIL && !params.email) {
      console.warn('[DeepLink] Missing required parameter "email" for CHECK_EMAIL route');
      return null;
    }

    return {
      route: config.route,
      params,
    };
  } catch (error) {
    console.error('[DeepLink] Error parsing deep link:', error);
    return null;
  }
}

/**
 * Примеры использования для документации:
 * 
 * 1. Открыть главный экран:
 *    kptapp://today
 * 
 * 2. Открыть статью с ID 123:
 *    kptapp://article?id=123
 * 
 * 3. Открыть опрос с ID 456:
 *    kptapp://survey?id=456
 * 
 * 4. Открыть опрос с ID 456 (затем пользователь может начать прохождение):
 *    kptapp://survey?id=456
 * 
 * 5. Открыть экран проверки email:
 *    kptapp://check-email?email=user@example.com
 * 
 * 6. Открыть экран активностей:
 *    kptapp://activities
 * 
 * 7. Открыть профиль:
 *    kptapp://profile
 * 
 * 8. Открыть настройки подписки:
 *    kptapp://subscription-settings
 */

