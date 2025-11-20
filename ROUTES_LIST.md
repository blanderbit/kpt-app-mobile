# Полный список всех роутов для Deep Links

## Схема URL
Все deep links используют схему: `plesury://`

---

## 1. Today (Главный экран)
**Роут:** `Today`  
**Deep Link:** `plesury://today`  
**Параметры:** нет  
**Требует авторизации:** ✅ Да  
**Описание:** Главный экран приложения (Dashboard)

**Пример:**
```
plesury://today
```

---

## 2. Activities (Активности)
**Роут:** `Activities`  
**Deep Link:** `plesury://activities`  
**Параметры:** нет  
**Требует авторизации:** ✅ Да  
**Описание:** Экран со списком активностей

**Пример:**
```
plesury://activities
```

---

## 3. Profile (Профиль)
**Роут:** `Profile`  
**Deep Link:** `plesury://profile`  
**Параметры:** нет  
**Требует авторизации:** ✅ Да  
**Описание:** Экран профиля пользователя

**Пример:**
```
plesury://profile
```

---

## 4. Personal Info (Личная информация)
**Роут:** `PersonalInfo`  
**Deep Link:** `plesury://personal-info`  
**Параметры:** нет  
**Требует авторизации:** ✅ Да  
**Описание:** Экран редактирования личной информации

**Пример:**
```
plesury://personal-info
```

---

## 5. Subscription Settings (Настройки подписки)
**Роут:** `SubscriptionSettings`  
**Deep Link:** `plesury://subscription-settings`  
**Параметры:** нет  
**Требует авторизации:** ✅ Да  
**Описание:** Экран настроек подписки

**Пример:**
```
plesury://subscription-settings
```

---

## 6. Article (Статья)
**Роут:** `Article`  
**Deep Link:** `plesury://article?id={articleId}`  
**Параметры:** 
- `id` (обязательный, string) - ID статьи  
**Требует авторизации:** ✅ Да  
**Описание:** Экран просмотра статьи

**Примеры:**
```
plesury://article?id=123
plesury://article?id=456
```

---

## 7. Survey (Опрос)
**Роут:** `Survey`  
**Deep Link:** `plesury://survey?id={surveyId}`  
**Параметры:** 
- `id` (обязательный, string) - ID опроса  
**Требует авторизации:** ✅ Да  
**Описание:** Экран просмотра опроса. С этой страницы пользователь может начать прохождение опроса.

**Примеры:**
```
plesury://survey?id=456
plesury://survey?id=789
```

**Примечание:** Прямых deep links на `SurveyQuestions` нет. Переход на страницу вопросов возможен только со страницы `Survey`.

---

## 8. Login (Вход)
**Роут:** `Login`  
**Deep Link:** `plesury://login`  
**Параметры:** нет  
**Требует авторизации:** ❌ Нет  
**Описание:** Экран входа в приложение

**Пример:**
```
plesury://login
```

---

## 9. Sign Up (Регистрация)
**Роут:** `SignUp`  
**Deep Link:** `plesury://sign-up`  
**Параметры:** нет  
**Требует авторизации:** ❌ Нет  
**Описание:** Экран регистрации

**Пример:**
```
plesury://sign-up
```

---

## 10. Reset Pass (Сброс пароля)
**Роут:** `ResetPass`  
**Deep Link:** `plesury://reset-pass`  
**Параметры:** нет  
**Требует авторизации:** ❌ Нет  
**Описание:** Экран сброса пароля

**Пример:**
```
plesury://reset-pass
```

---

## 11. Check Email (Проверка email)
**Роут:** `CheckEmail`  
**Deep Link:** `plesury://check-email?email={userEmail}`  
**Параметры:** 
- `email` (обязательный, string) - Email пользователя  
**Требует авторизации:** ❌ Нет  
**Описание:** Экран проверки email

**Примеры:**
```
plesury://check-email?email=user@example.com
plesury://check-email?email=test%40example.com
```

**Примечание:** Email должен быть URL-encoded (например, `@` → `%40`)

---

## 12. Onboarding (Онбординг)
**Роут:** `Onboarding`  
**Deep Link:** `plesury://onboarding`  
**Параметры:** нет  
**Требует авторизации:** ❌ Нет  
**Описание:** Экран онбординга

**Пример:**
```
plesury://onboarding
```

---

## Роуты БЕЗ Deep Links

Следующие роуты существуют в приложении, но не имеют deep links (используются только для внутренней навигации):

### SurveyQuestions
**Роут:** `SurveyQuestions`  
**Deep Link:** ❌ Нет  
**Причина:** Переход на эту страницу возможен только со страницы `Survey`. Прямых deep links нет.

### Redirect
**Роут:** `Redirect`  
**Deep Link:** ❌ Нет  
**Причина:** Внутренний роут для редиректов.

---

## Сводная таблица

| Роут | Deep Link | Параметры | Авторизация | Статус |
|------|-----------|-----------|-------------|--------|
| Today | `plesury://today` | - | ✅ | ✅ Доступен |
| Activities | `plesury://activities` | - | ✅ | ✅ Доступен |
| Profile | `plesury://profile` | - | ✅ | ✅ Доступен |
| PersonalInfo | `plesury://personal-info` | - | ✅ | ✅ Доступен |
| SubscriptionSettings | `plesury://subscription-settings` | - | ✅ | ✅ Доступен |
| Article | `plesury://article?id={id}` | `id` (string) | ✅ | ✅ Доступен |
| Survey | `plesury://survey?id={id}` | `id` (string) | ✅ | ✅ Доступен |
| Login | `plesury://login` | - | ❌ | ✅ Доступен |
| SignUp | `plesury://sign-up` | - | ❌ | ✅ Доступен |
| ResetPass | `plesury://reset-pass` | - | ❌ | ✅ Доступен |
| CheckEmail | `plesury://check-email?email={email}` | `email` (string) | ❌ | ✅ Доступен |
| Onboarding | `plesury://onboarding` | - | ❌ | ✅ Доступен |
| SurveyQuestions | - | - | ✅ | ❌ Нет deep link |
| Redirect | - | - | - | ❌ Нет deep link |

---

## Примеры использования в коде

```typescript
import { DeepLinkBuilder } from '@app/navigation/deepLinks';

// Без параметров
const todayLink = DeepLinkBuilder.route(Routes.TODAY);
// Результат: "plesury://today"

// С параметрами
const articleLink = DeepLinkBuilder.article('123');
// Результат: "plesury://article?id=123"

const surveyLink = DeepLinkBuilder.survey('456');
// Результат: "plesury://survey?id=456"

const checkEmailLink = DeepLinkBuilder.checkEmail('user@example.com');
// Результат: "plesury://check-email?email=user%40example.com"
```

---

## Примеры для нотификаций

### Нотификация о новой статье
```json
{
  "title": "Новая статья",
  "body": "Прочитайте нашу новую статью",
  "data": {
    "deepLink": "plesury://article?id=123"
  }
}
```

### Нотификация о новом опросе
```json
{
  "title": "Новый опрос",
  "body": "Пройдите опрос",
  "data": {
    "deepLink": "plesury://survey?id=456"
  }
}
```

### Нотификация-напоминание
```json
{
  "title": "Напоминание",
  "body": "Не забудьте выполнить активности",
  "data": {
    "deepLink": "plesury://activities"
  }
}
```

### Нотификация о подписке
```json
{
  "title": "Подписка истекает",
  "body": "Обновите подписку",
  "data": {
    "deepLink": "plesury://subscription-settings"
  }
}
```

---

## Тестирование

### iOS Simulator
```bash
xcrun simctl openurl booted "plesury://activities"
```

### Android Emulator
```bash
adb shell am start -W -a android.intent.action.VIEW -d "plesury://activities" com.simplify.plesury
```

### Через браузер
Откройте в адресной строке:
```
plesury://activities
```

---

## Важные замечания

1. **Авторизация:** Роуты, требующие авторизации, автоматически перенаправят неавторизованных пользователей на экран входа
2. **Параметры:** Обязательные параметры должны быть указаны, иначе deep link не сработает
3. **URL Encoding:** Email и другие специальные символы должны быть URL-encoded
4. **SurveyQuestions:** Прямых deep links на эту страницу нет - используйте `survey` для перехода к опросу

