# Полный список всех роутов для Deep Links

## Схема URL
Все deep links используют схему: `kptapp://`

---

## 1. Today (Главный экран)
**Роут:** `Today`  
**Deep Link:** `kptapp://today`  
**Параметры:** нет  
**Требует авторизации:** ✅ Да  
**Описание:** Главный экран приложения (Dashboard)

**Пример:**
```
kptapp://today
```

---

## 2. Activities (Активности)
**Роут:** `Activities`  
**Deep Link:** `kptapp://activities`  
**Параметры:** нет  
**Требует авторизации:** ✅ Да  
**Описание:** Экран со списком активностей

**Пример:**
```
kptapp://activities
```

---

## 3. Profile (Профиль)
**Роут:** `Profile`  
**Deep Link:** `kptapp://profile`  
**Параметры:** нет  
**Требует авторизации:** ✅ Да  
**Описание:** Экран профиля пользователя

**Пример:**
```
kptapp://profile
```

---

## 4. Personal Info (Личная информация)
**Роут:** `PersonalInfo`  
**Deep Link:** `kptapp://personal-info`  
**Параметры:** нет  
**Требует авторизации:** ✅ Да  
**Описание:** Экран редактирования личной информации

**Пример:**
```
kptapp://personal-info
```

---

## 5. Subscription Settings (Настройки подписки)
**Роут:** `SubscriptionSettings`  
**Deep Link:** `kptapp://subscription-settings`  
**Параметры:** нет  
**Требует авторизации:** ✅ Да  
**Описание:** Экран настроек подписки

**Пример:**
```
kptapp://subscription-settings
```

---

## 6. Article (Статья)
**Роут:** `Article`  
**Deep Link:** `kptapp://article?id={articleId}`  
**Параметры:** 
- `id` (обязательный, string) - ID статьи  
**Требует авторизации:** ✅ Да  
**Описание:** Экран просмотра статьи

**Примеры:**
```
kptapp://article?id=123
kptapp://article?id=456
```

---

## 7. Survey (Опрос)
**Роут:** `Survey`  
**Deep Link:** `kptapp://survey?id={surveyId}`  
**Параметры:** 
- `id` (обязательный, string) - ID опроса  
**Требует авторизации:** ✅ Да  
**Описание:** Экран просмотра опроса. С этой страницы пользователь может начать прохождение опроса.

**Примеры:**
```
kptapp://survey?id=456
kptapp://survey?id=789
```

**Примечание:** Прямых deep links на `SurveyQuestions` нет. Переход на страницу вопросов возможен только со страницы `Survey`.

---

## 8. Login (Вход)
**Роут:** `Login`  
**Deep Link:** `kptapp://login`  
**Параметры:** нет  
**Требует авторизации:** ❌ Нет  
**Описание:** Экран входа в приложение

**Пример:**
```
kptapp://login
```

---

## 9. Sign Up (Регистрация)
**Роут:** `SignUp`  
**Deep Link:** `kptapp://sign-up`  
**Параметры:** нет  
**Требует авторизации:** ❌ Нет  
**Описание:** Экран регистрации

**Пример:**
```
kptapp://sign-up
```

---

## 10. Reset Pass (Сброс пароля)
**Роут:** `ResetPass`  
**Deep Link:** `kptapp://reset-pass`  
**Параметры:** нет  
**Требует авторизации:** ❌ Нет  
**Описание:** Экран сброса пароля

**Пример:**
```
kptapp://reset-pass
```

---

## 11. Check Email (Проверка email)
**Роут:** `CheckEmail`  
**Deep Link:** `kptapp://check-email?email={userEmail}`  
**Параметры:** 
- `email` (обязательный, string) - Email пользователя  
**Требует авторизации:** ❌ Нет  
**Описание:** Экран проверки email

**Примеры:**
```
kptapp://check-email?email=user@example.com
kptapp://check-email?email=test%40example.com
```

**Примечание:** Email должен быть URL-encoded (например, `@` → `%40`)

---

## 12. Onboarding (Онбординг)
**Роут:** `Onboarding`  
**Deep Link:** `kptapp://onboarding`  
**Параметры:** нет  
**Требует авторизации:** ❌ Нет  
**Описание:** Экран онбординга

**Пример:**
```
kptapp://onboarding
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
| Today | `kptapp://today` | - | ✅ | ✅ Доступен |
| Activities | `kptapp://activities` | - | ✅ | ✅ Доступен |
| Profile | `kptapp://profile` | - | ✅ | ✅ Доступен |
| PersonalInfo | `kptapp://personal-info` | - | ✅ | ✅ Доступен |
| SubscriptionSettings | `kptapp://subscription-settings` | - | ✅ | ✅ Доступен |
| Article | `kptapp://article?id={id}` | `id` (string) | ✅ | ✅ Доступен |
| Survey | `kptapp://survey?id={id}` | `id` (string) | ✅ | ✅ Доступен |
| Login | `kptapp://login` | - | ❌ | ✅ Доступен |
| SignUp | `kptapp://sign-up` | - | ❌ | ✅ Доступен |
| ResetPass | `kptapp://reset-pass` | - | ❌ | ✅ Доступен |
| CheckEmail | `kptapp://check-email?email={email}` | `email` (string) | ❌ | ✅ Доступен |
| Onboarding | `kptapp://onboarding` | - | ❌ | ✅ Доступен |
| SurveyQuestions | - | - | ✅ | ❌ Нет deep link |
| Redirect | - | - | - | ❌ Нет deep link |

---

## Примеры использования в коде

```typescript
import { DeepLinkBuilder } from '@app/navigation/deepLinks';

// Без параметров
const todayLink = DeepLinkBuilder.route(Routes.TODAY);
// Результат: "kptapp://today"

// С параметрами
const articleLink = DeepLinkBuilder.article('123');
// Результат: "kptapp://article?id=123"

const surveyLink = DeepLinkBuilder.survey('456');
// Результат: "kptapp://survey?id=456"

const checkEmailLink = DeepLinkBuilder.checkEmail('user@example.com');
// Результат: "kptapp://check-email?email=user%40example.com"
```

---

## Примеры для нотификаций

### Нотификация о новой статье
```json
{
  "title": "Новая статья",
  "body": "Прочитайте нашу новую статью",
  "data": {
    "deepLink": "kptapp://article?id=123"
  }
}
```

### Нотификация о новом опросе
```json
{
  "title": "Новый опрос",
  "body": "Пройдите опрос",
  "data": {
    "deepLink": "kptapp://survey?id=456"
  }
}
```

### Нотификация-напоминание
```json
{
  "title": "Напоминание",
  "body": "Не забудьте выполнить активности",
  "data": {
    "deepLink": "kptapp://activities"
  }
}
```

### Нотификация о подписке
```json
{
  "title": "Подписка истекает",
  "body": "Обновите подписку",
  "data": {
    "deepLink": "kptapp://subscription-settings"
  }
}
```

---

## Тестирование

### iOS Simulator
```bash
xcrun simctl openurl booted "kptapp://activities"
```

### Android Emulator
```bash
adb shell am start -W -a android.intent.action.VIEW -d "kptapp://activities" com.siplify.kpt
```

### Через браузер
Откройте в адресной строке:
```
kptapp://activities
```

---

## Важные замечания

1. **Авторизация:** Роуты, требующие авторизации, автоматически перенаправят неавторизованных пользователей на экран входа
2. **Параметры:** Обязательные параметры должны быть указаны, иначе deep link не сработает
3. **URL Encoding:** Email и другие специальные символы должны быть URL-encoded
4. **SurveyQuestions:** Прямых deep links на эту страницу нет - используйте `survey` для перехода к опросу

