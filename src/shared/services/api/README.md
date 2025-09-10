# API Services

Этот модуль предоставляет удобные сервисы и хуки для работы с KPT API.

## Структура

- `config.ts` - Конфигурация API клиента (axios, интерцепторы, базовый URL)
- `types.ts` - TypeScript типы для всех API методов
- `client.ts` - Сервисы для работы с API (классы с методами)
- `hooks.ts` - React Query хуки для удобной работы с API в компонентах
- `index.ts` - Экспорт всех модулей

## Основные сервисы

### AuthService
- `login()` - Вход в систему
- `register()` - Регистрация
- `firebaseAuth()` - Аутентификация через Firebase
- `forgotPassword()` - Запрос восстановления пароля
- `resetPassword()` - Сброс пароля
- `verifyEmail()` - Подтверждение email
- `refreshToken()` - Обновление токенов
- `logout()` - Выход из системы
- `getCurrentUser()` - Получение текущего пользователя

### ProfileService
- `getProfile()` - Получение профиля
- `updateProfile()` - Обновление профиля
- `changeEmail()` - Запрос смены email
- `confirmEmailChange()` - Подтверждение смены email
- `changePassword()` - Смена пароля
- `deleteAccount()` - Удаление аккаунта

### MoodTrackerService
- `setMoodForDay()` - Установка настроения за день
- `getCurrentMood()` - Получение текущего настроения
- `getMoodForLast7Days()` - Настроение за последние 7 дней
- `getMoodForDate()` - Настроение за конкретную дату
- `updateMoodForDate()` - Обновление настроения за дату
- `deleteMoodForDate()` - Удаление настроения за дату
- `getMoodForPeriod()` - Настроение за период
- `getAllMoodTrackers()` - Все записи настроения

### ActivityService
- `getMyActivities()` - Получение активностей пользователя
- `createActivity()` - Создание активности
- `getActivityById()` - Получение активности по ID
- `updateActivity()` - Обновление активности
- `deleteActivity()` - Удаление активности
- `closeActivity()` - Закрытие активности с оценкой
- `getAllActivityTypes()` - Все типы активностей
- `getRecommendedTypes()` - Рекомендуемые типы
- `getActivityTypesByCategory()` - Типы по категории
- `searchActivityTypes()` - Поиск типов активностей

### SuggestedActivityService
- `getSuggestedActivities()` - Получение предложенных активностей
- `addSuggestedActivityToActivities()` - Добавление предложенной активности
- `deleteSuggestedActivity()` - Удаление предложенной активности
- `refreshSuggestedActivities()` - Обновление предложенных активностей

### AnalyticsService
- `getCompletedTasksDays()` - Количество дней с выполненными задачами
- `getCompletedTasksCount()` - Количество выполненных задач
- `getRateActivityAverages()` - Средние показатели оценок
- `getAnalyticsOverview()` - Общий обзор аналитики

## Использование хуков

### Пример аутентификации

```tsx
import { useLogin, useCurrentUser, useLogout } from '@/shared/services/api';

function LoginComponent() {
  const { data: user, isLoading } = useCurrentUser();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  const handleLogin = async (credentials) => {
    try {
      await loginMutation.mutateAsync(credentials);
      // Пользователь автоматически загрузится
    } catch (error) {
      console.error('Ошибка входа:', error);
    }
  };

  if (isLoading) return <div>Загрузка...</div>;
  if (user) return <div>Добро пожаловать, {user.firstName}!</div>;

  return (
    <form onSubmit={handleLogin}>
      {/* Форма входа */}
    </form>
  );
}
```

### Пример работы с активностями

```tsx
import { useMyActivities, useCreateActivity, useDeleteActivity } from '@/shared/services/api';

function ActivitiesComponent() {
  const { data: activities, isLoading } = useMyActivities({ page: 1, limit: 10 });
  const createMutation = useCreateActivity();
  const deleteMutation = useDeleteActivity();

  const handleCreateActivity = async (activityData) => {
    try {
      await createMutation.mutateAsync(activityData);
      // Список активностей автоматически обновится
    } catch (error) {
      console.error('Ошибка создания активности:', error);
    }
  };

  const handleDeleteActivity = async (id) => {
    try {
      await deleteMutation.mutateAsync(id);
      // Список активностей автоматически обновится
    } catch (error) {
      console.error('Ошибка удаления активности:', error);
    }
  };

  if (isLoading) return <div>Загрузка активностей...</div>;

  return (
    <div>
      {activities?.data.map(activity => (
        <div key={activity.id}>
          <h3>{activity.activityName}</h3>
          <button onClick={() => handleDeleteActivity(activity.id)}>
            Удалить
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Пример работы с настроением

```tsx
import { useCurrentMood, useSetMoodForDay, useMoodForLast7Days } from '@/shared/services/api';

function MoodTrackerComponent() {
  const { data: currentMood } = useCurrentMood();
  const { data: last7Days } = useMoodForLast7Days();
  const setMoodMutation = useSetMoodForDay();

  const handleSetMood = async (moodType, notes) => {
    try {
      await setMoodMutation.mutateAsync({ moodType, notes });
      // Данные настроения автоматически обновятся
    } catch (error) {
      console.error('Ошибка установки настроения:', error);
    }
  };

  return (
    <div>
      <h2>Трекер настроения</h2>
      {currentMood ? (
        <div>Сегодня настроение: {currentMood.moodTypeDetails?.name}</div>
      ) : (
        <button onClick={() => handleSetMood('good', 'Хороший день')}>
          Установить настроение
        </button>
      )}
      
      <h3>Последние 7 дней:</h3>
      {last7Days?.map(mood => (
        <div key={mood.id}>
          {mood.moodDate}: {mood.moodTypeDetails?.name}
        </div>
      ))}
    </div>
  );
}
```

## Особенности

1. **Автоматическое кеширование** - React Query автоматически кеширует данные
2. **Автоматическое обновление** - При мутациях связанные данные обновляются автоматически
3. **Обработка ошибок** - Все ошибки обрабатываются централизованно
4. **Типизация** - Полная типизация TypeScript для всех методов
5. **Оптимизация** - Запросы выполняются только при необходимости

## Настройка

Убедитесь, что в вашем приложении настроен QueryClient:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { QueryProvider } from '@/shared/services/query/QueryProvider';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <QueryProvider>
        {/* Ваше приложение */}
      </QueryProvider>
    </QueryClientProvider>
  );
}
```
