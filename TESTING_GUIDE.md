# Руководство по тестированию на разных устройствах

## Минимальная поддерживаемая версия
- **iOS**: 15.1 (iPhone 7 и новее)

## Список устройств для тестирования

### iOS устройства (в порядке от старого к новому):

1. **iPhone 7** - iOS 15.1 (минимальная поддержка)
2. **iPhone 8** - iOS 15.1
3. **iPhone X** - iOS 15.1
4. **iPhone 11** - iOS 15.1+
5. **iPhone 12** - iOS 15.1+
6. **iPhone 13** - iOS 15.1+
7. **iPhone 14** - iOS 16.0+
8. **iPhone 15** - iOS 17.0+
9. **iPhone 15 Pro Max** - iOS 17.0+ (самое большое устройство)

### iPad (если поддерживается):
- **iPad (9th generation)** - iPadOS 15.1
- **iPad Pro 12.9"** - iPadOS 15.1+

## Как запустить на разных симуляторах

### Через Xcode:
1. Откройте `ios/Plesury.xcworkspace` в Xcode
2. В верхней панели выберите устройство из списка симуляторов
3. Нажмите Run (⌘R)

### Через командную строку:

#### Список доступных симуляторов:
```bash
xcrun simctl list devices available
```

#### Запуск на конкретном устройстве:
```bash
# iPhone 7 с iOS 15.1
npx expo run:ios --simulator="iPhone 7"

# iPhone 8
npx expo run:ios --simulator="iPhone 8"

# iPhone X
npx expo run:ios --simulator="iPhone X"

# iPhone 15 Pro Max
npx expo run:ios --simulator="iPhone 15 Pro Max"
```

#### Создание симулятора iPhone 7 с iOS 15.1 (если его нет):
```bash
# Сначала проверьте доступные runtime версии
xcrun simctl list runtimes

# Создайте устройство (пример)
xcrun simctl create "iPhone 7 iOS 15.1" "iPhone 7" "iOS15.1"
```

## Чек-лист для тестирования на каждом устройстве

### Основные функции:
- [ ] Запуск приложения
- [ ] Экран загрузки/сплэш
- [ ] Навигация между экранами
- [ ] Авторизация через Google
- [ ] Авторизация через Apple
- [ ] Регистрация нового пользователя
- [ ] Восстановление пароля

### UI/UX проверки:
- [ ] Все элементы отображаются корректно
- [ ] Шрифты загружаются и отображаются правильно
- [ ] Изображения и иконки загружаются
- [ ] Адаптация под размер экрана
- [ ] Безопасные зоны (Safe Area) работают правильно
- [ ] Статус бар отображается корректно
- [ ] Клавиатура не перекрывает поля ввода

### Производительность:
- [ ] Плавная анимация
- [ ] Нет лагов при навигации
- [ ] Быстрая загрузка экранов
- [ ] Нет утечек памяти (проверить через Instruments)

### Особые проверки для iPhone 7 (iOS 15.1):
- [ ] Приложение запускается без крашей
- [ ] Все функции работают
- [ ] Нет предупреждений о несовместимости API
- [ ] Производительность приемлемая

## Полезные команды

### Очистка кэша перед тестированием:
```bash
# Очистка Metro bundler кэша
npx expo start --clear

# Очистка iOS build
cd ios && xcodebuild clean && cd ..

# Переустановка pods
cd ios && pod deintegrate && pod install && cd ..
```

### Просмотр логов:
```bash
# Логи симулятора
xcrun simctl spawn booted log stream --level=debug

# Или через Xcode: Window → Devices and Simulators → выберите устройство → View Device Logs
```

## Известные проблемы и решения

### Проблема: Симулятор iPhone 7 не найден
**Решение**: Установите iOS 15.1 runtime через Xcode → Settings → Platforms → Download

### Проблема: Приложение не запускается на старых устройствах
**Решение**: 
1. Проверьте `IPHONEOS_DEPLOYMENT_TARGET` в Xcode (должно быть 15.1)
2. Проверьте `LSMinimumSystemVersion` в Info.plist (должно быть 15.1)
3. Пересоберите проект

### Проблема: Шрифты не загружаются
**Решение**: Проверьте, что все шрифты добавлены в `Info.plist` → `UIAppFonts`

## Автоматизация тестирования

### Скрипт для быстрого тестирования на нескольких устройствах:
```bash
#!/bin/bash
devices=("iPhone 7" "iPhone 8" "iPhone X" "iPhone 11" "iPhone 15 Pro Max")

for device in "${devices[@]}"; do
  echo "Testing on $device..."
  npx expo run:ios --simulator="$device"
  # Добавьте паузу для ручного тестирования
  read -p "Press Enter to continue to next device..."
done
```

Сохраните как `test-devices.sh`, сделайте исполняемым (`chmod +x test-devices.sh`) и запустите.

