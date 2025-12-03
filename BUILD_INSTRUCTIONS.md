# 📱 Инструкция по сборке и скачиванию IPA файла

## 🚀 Быстрый старт

### Автоматический способ (рекомендуется)

Используйте готовый скрипт для автоматической сборки и скачивания:

```bash
# Production билд
./build-and-download.sh production

# Preview билд
./build-and-download.sh preview

# Development билд
./build-and-download.sh development
```

Скрипт автоматически:
1. ✅ Проверит версию
2. 🔨 Запустит сборку
3. ⏳ Дождется завершения
4. 📥 Скачает IPA файл локально

---

## 📋 Ручной способ (пошаговая инструкция)

### Шаг 1: Проверка текущей версии

```bash
eas build:version:get --platform ios
```

Покажет текущую версию и build number.

### Шаг 2: Обновление build number (если нужно)

Если нужно изменить build number, отредактируйте:

1. **app.json**:
   ```json
   "ios": {
     "buildNumber": "4"
   }
   ```

2. **ios/Plesury/Info.plist**:
   ```xml
   <key>CFBundleVersion</key>
   <string>4</string>
   ```

3. **ios/Plesury.xcodeproj/project.pbxproj**:
   ```
   CURRENT_PROJECT_VERSION = 4;
   ```

### Шаг 3: Запуск сборки

```bash
# Production билд (для App Store)
eas build --platform ios --profile production

# Preview билд (для внутреннего тестирования)
eas build --platform ios --profile preview

# Development билд (с dev client)
eas build --platform ios --profile development
```

**Время сборки:** 10-20 минут

### Шаг 4: Отслеживание прогресса

Во время сборки можно отслеживать прогресс:

1. **Через терминал:**
   ```bash
   eas build:list --platform ios --limit 5
   ```

2. **Через веб-интерфейс:**
   - Откройте: https://expo.dev/accounts/wexis/projects/Plesury/builds
   - Найдите ваш билд по статусу "in progress"

### Шаг 5: Получение списка билдов

После завершения сборки получите список:

```bash
eas build:list --platform ios --limit 5
```

Вы увидите что-то вроде:
```
ID                       c5856612-5350-4125-bd38-d7d397d0c6ce
Platform                 iOS
Status                   finished
Profile                  production
Version                  1.0.0
Build number             4
Application Archive URL  https://expo.dev/artifacts/eas/...
```

### Шаг 6: Скачивание IPA файла

#### Способ 1: Через curl (рекомендуется)

Скопируйте `Application Archive URL` из списка билдов и выполните:

```bash
curl -L "https://expo.dev/artifacts/eas/..." -o "Plesury-build-4.ipa"
```

#### Способ 2: Через браузер

1. Откройте `Application Archive URL` в браузере
2. Файл начнет скачиваться автоматически

#### Способ 3: Через веб-интерфейс

1. Откройте: https://expo.dev/accounts/wexis/projects/Plesury/builds
2. Найдите нужный билд
3. Нажмите на ссылку "Application Archive URL"

---

## 📦 Что делать с IPA файлом

### Загрузка в App Store Connect

Если билд еще не был загружен:

```bash
eas submit --platform ios
```

Или загрузите вручную через **Transporter**:
1. Откройте Transporter
2. Перетащите IPA файл
3. Нажмите "Deliver"

### Установка на устройство

Для установки на тестовое устройство используйте:
- **Xcode** → Window → Devices and Simulators
- **Apple Configurator 2**
- **3uTools** или другие инструменты

---

## 🔧 Полезные команды

### Просмотр информации о билде

```bash
# Список последних 5 билдов
eas build:list --platform ios --limit 5

# Детальная информация о конкретном билде
eas build:view <BUILD_ID>

# Просмотр логов билда
eas build:view <BUILD_ID> --logs
```

### Управление версиями

```bash
# Получить текущую версию
eas build:version:get --platform ios

# Установить версию (только для remote версий)
# Примечание: у нас используется local версия из app.json
```

### Отмена билда

```bash
eas build:cancel <BUILD_ID>
```

---

## ⚙️ Конфигурация

### Профили билдов (eas.json)

- **production**: для App Store, автоматически увеличивает build number
- **preview**: для внутреннего тестирования
- **development**: с dev client для разработки

### Автоматическое увеличение build number

В `eas.json` для production профиля установлено:
```json
"production": {
  "autoIncrement": true
}
```

Это означает, что при каждом production билде build number будет автоматически увеличиваться.

---

## 🐛 Решение проблем

### Ошибка: "Redundant Binary Upload"

Это означает, что билд с таким build number уже был загружен. Решение:
1. Увеличьте build number (см. Шаг 2)
2. Соберите новый билд

### Ошибка: "Build failed"

1. Проверьте логи:
   ```bash
   eas build:view <BUILD_ID> --logs
   ```
2. Убедитесь, что все зависимости установлены
3. Проверьте конфигурацию в `app.json` и `eas.json`

### IPA файл не скачивается

1. Проверьте, что билд завершен (status: "finished")
2. Убедитесь, что URL правильный
3. Попробуйте скачать через браузер

---

## 📝 Чек-лист перед сборкой

- [ ] Версия и build number обновлены
- [ ] Все изменения закоммичены
- [ ] Конфигурация в `app.json` проверена
- [ ] Bundle identifier правильный (`app.plesury`)
- [ ] Google Services файлы обновлены (если нужно)
- [ ] EAS CLI установлен и авторизован

---

## 🔗 Полезные ссылки

- **EAS Build Dashboard**: https://expo.dev/accounts/wexis/projects/Plesury/builds
- **Документация EAS**: https://docs.expo.dev/build/introduction/
- **App Store Connect**: https://appstoreconnect.apple.com

---

## 💡 Советы

1. **Всегда проверяйте build number** перед сборкой
2. **Сохраняйте IPA файлы** для архива
3. **Используйте автоматический скрипт** для экономии времени
4. **Отслеживайте прогресс** через веб-интерфейс
5. **Проверяйте логи** при ошибках сборки

---

**Последнее обновление:** 24 ноября 2025


