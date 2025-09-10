# Модуль профиля пользователя

Полный набор компонентов и хуков для работы с профилем пользователя, включая просмотр, редактирование, смену пароля и email.

## Структура

```
src/features/profile/
├── hooks/
│   └── useProfile.ts          # Хуки для работы с профилем
├── components/
│   ├── ProfileCard/           # Карточка профиля
│   ├── EditProfileForm/       # Форма редактирования
│   ├── ChangePasswordForm/    # Форма смены пароля
│   └── ChangeEmailForm/       # Форма смены email
├── screens/
│   └── ProfileScreen.tsx      # Главный экран профиля
└── index.ts                   # Экспорты
```

## Хуки

### useProfile()
Получение данных профиля пользователя.

```tsx
import { useProfile } from '@features/profile';

function MyComponent() {
  const { data: profile, isLoading, error } = useProfile();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!profile) return <Text>Профиль не найден</Text>;

  return (
    <View>
      <Text>{profile.firstName} {profile.lastName}</Text>
      <Text>{profile.email}</Text>
    </View>
  );
}
```

### useUpdateProfile()
Обновление данных профиля.

```tsx
import { useUpdateProfile } from '@features/profile';

function EditProfile() {
  const updateProfile = useUpdateProfile();

  const handleUpdate = async () => {
    try {
      await updateProfile.mutateAsync({
        firstName: 'Новое имя',
        lastName: 'Новая фамилия',
        theme: 'dark',
      });
      Alert.alert('Успех', 'Профиль обновлен');
    } catch (error) {
      Alert.alert('Ошибка', error.message);
    }
  };

  return (
    <Button 
      title="Обновить" 
      onPress={handleUpdate}
      loading={updateProfile.isPending}
    />
  );
}
```

### useChangePassword()
Смена пароля пользователя.

```tsx
import { useChangePassword } from '@features/profile';

function ChangePassword() {
  const changePassword = useChangePassword();

  const handleChangePassword = async () => {
    try {
      await changePassword.mutateAsync({
        currentPassword: 'старый_пароль',
        newPassword: 'новый_пароль',
      });
      Alert.alert('Успех', 'Пароль изменен');
    } catch (error) {
      Alert.alert('Ошибка', error.message);
    }
  };

  return (
    <Button 
      title="Изменить пароль" 
      onPress={handleChangePassword}
      loading={changePassword.isPending}
    />
  );
}
```

### useChangeEmail()
Запрос на смену email.

```tsx
import { useChangeEmail } from '@features/profile';

function ChangeEmail() {
  const changeEmail = useChangeEmail();

  const handleChangeEmail = async () => {
    try {
      await changeEmail.mutateAsync({
        newEmail: 'new@example.com',
        password: 'текущий_пароль',
      });
      Alert.alert('Проверьте email', 'Код подтверждения отправлен');
    } catch (error) {
      Alert.alert('Ошибка', error.message);
    }
  };

  return (
    <Button 
      title="Сменить email" 
      onPress={handleChangeEmail}
      loading={changeEmail.isPending}
    />
  );
}
```

### useConfirmEmailChange()
Подтверждение смены email.

```tsx
import { useConfirmEmailChange } from '@features/profile';

function ConfirmEmailChange() {
  const confirmEmail = useConfirmEmailChange();

  const handleConfirm = async () => {
    try {
      await confirmEmail.mutateAsync({
        email: 'current@example.com',
        code: '123456',
      });
      Alert.alert('Успех', 'Email изменен');
    } catch (error) {
      Alert.alert('Ошибка', error.message);
    }
  };

  return (
    <Button 
      title="Подтвердить" 
      onPress={handleConfirm}
      loading={confirmEmail.isPending}
    />
  );
}
```

### useDeleteAccount()
Удаление аккаунта пользователя.

```tsx
import { useDeleteAccount } from '@features/profile';

function DeleteAccount() {
  const deleteAccount = useDeleteAccount();

  const handleDelete = async () => {
    try {
      await deleteAccount.mutateAsync({
        password: 'пароль',
        confirm: true,
      });
      // Пользователь будет автоматически перенаправлен на логин
    } catch (error) {
      Alert.alert('Ошибка', error.message);
    }
  };

  return (
    <Button 
      title="Удалить аккаунт" 
      onPress={handleDelete}
      loading={deleteAccount.isPending}
      themeName="destructive"
    />
  );
}
```

## Компоненты

### ProfileCard
Карточка для отображения информации о профиле.

```tsx
import { ProfileCard } from '@features/profile';

function MyProfile() {
  const { data: profile } = useProfile();

  if (!profile) return null;

  return (
    <ProfileCard
      profile={profile}
      onEdit={() => console.log('Редактировать')}
      onSettings={() => console.log('Настройки')}
    />
  );
}
```

### EditProfileForm
Форма для редактирования профиля.

```tsx
import { EditProfileForm } from '@features/profile';

function EditProfile() {
  const { data: profile } = useProfile();

  if (!profile) return null;

  return (
    <EditProfileForm
      profile={profile}
      onSuccess={() => console.log('Успешно обновлено')}
      onCancel={() => console.log('Отмена')}
    />
  );
}
```

### ChangePasswordForm
Форма для смены пароля.

```tsx
import { ChangePasswordForm } from '@features/profile';

function ChangePassword() {
  return (
    <ChangePasswordForm
      onSuccess={() => console.log('Пароль изменен')}
      onCancel={() => console.log('Отмена')}
    />
  );
}
```

### ChangeEmailForm
Форма для смены email с двухэтапным подтверждением.

```tsx
import { ChangeEmailForm } from '@features/profile';

function ChangeEmail() {
  const { data: profile } = useProfile();

  if (!profile) return null;

  return (
    <ChangeEmailForm
      currentEmail={profile.email}
      onSuccess={() => console.log('Email изменен')}
      onCancel={() => console.log('Отмена')}
    />
  );
}
```

## Полный экран профиля

### ProfileScreen
Готовый экран со всеми функциями профиля.

```tsx
import { ProfileScreen } from '@features/profile';

// В навигации
<Stack.Screen 
  name="Profile" 
  component={ProfileScreen} 
  options={{ title: 'Профиль' }}
/>
```

## API интеграция

Все хуки автоматически интегрированы с KPT API:

- **GET /profile** - Получение профиля
- **PUT /profile** - Обновление профиля
- **POST /profile/change-email** - Запрос смены email
- **POST /profile/confirm-email-change** - Подтверждение смены email
- **POST /profile/change-password** - Смена пароля
- **DELETE /profile/account** - Удаление аккаунта

## Особенности

### Автоматическое кеширование
- Данные профиля кешируются на 5 минут
- При обновлении профиля кеш автоматически обновляется
- Связанные запросы инвалидируются

### Обработка ошибок
- Все ошибки API обрабатываются централизованно
- Показываются пользователю через Alert или ErrorMessage
- Подробное логирование для отладки

### Валидация форм
- Валидация с помощью Yup
- Проверка email, паролей, обязательных полей
- Подтверждение паролей

### Безопасность
- Текущий пароль требуется для смены email/пароля
- Подтверждение для удаления аккаунта
- Двухэтапная смена email с кодом подтверждения

## Примеры использования

### Простое отображение профиля
```tsx
import { useProfile } from '@features/profile';

function SimpleProfile() {
  const { data: profile, isLoading } = useProfile();

  if (isLoading) return <Text>Загрузка...</Text>;
  if (!profile) return <Text>Профиль не найден</Text>;

  return (
    <View>
      <Text>Имя: {profile.firstName}</Text>
      <Text>Email: {profile.email}</Text>
    </View>
  );
}
```

### Кастомная форма редактирования
```tsx
import { useProfile, useUpdateProfile } from '@features/profile';

function CustomEditForm() {
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();
  const [name, setName] = useState(profile?.firstName || '');

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync({ firstName: name });
      Alert.alert('Успех', 'Имя обновлено');
    } catch (error) {
      Alert.alert('Ошибка', error.message);
    }
  };

  return (
    <View>
      <TextInput 
        value={name}
        onChangeText={setName}
        placeholder="Введите имя"
      />
      <Button title="Сохранить" onPress={handleSave} />
    </View>
  );
}
```

### Интеграция с навигацией
```tsx
import { ProfileScreen } from '@features/profile';

function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
```
