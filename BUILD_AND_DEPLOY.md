# 📱 Инструкция по сборке и загрузке iOS билда

Полная инструкция по сборке приложения и загрузке в TestFlight после работы над приложением.

---

## 🚀 Быстрый старт

После внесения изменений в приложение выполните следующие шаги:

---

## Шаг 1: Подготовка проекта

### 1.1. Очистка предыдущих билдов

```bash
cd /Users/danil/WORK/KptApp/ios
rm -rf build/
rm -rf ~/Library/Developer/Xcode/DerivedData/Plesury-*
```

### 1.2. Генерация Codegen файлов

React Native требует сгенерированные файлы для нативных компонентов:

```bash
cd /Users/danil/WORK/KptApp

# Генерация codegen файлов
node node_modules/react-native/scripts/generate-codegen-artifacts.js -p . -t ios -o ios/build/generated

# Исправление пути (codegen иногда генерирует в неправильную папку)
cd ios
if [ -d "build/generated/build/generated/ios" ]; then
    rm -rf build/generated/ios
    mv build/generated/build/generated/ios build/generated/
    rm -rf build/generated/build
    echo "✅ Codegen files moved to correct location"
fi
```

### 1.3. Проверка pods (опционально)

Если были изменения в зависимостях:

```bash
cd ios
export LANG=en_US.UTF-8
pod install
```

---

## Шаг 2: Сборка архива в Xcode

### 2.1. Открытие проекта

```bash
open /Users/danil/WORK/KptApp/ios/Plesury.xcworkspace
```

### 2.2. Настройка в Xcode

1. **Выберите схему:**
   - В верхней панели выберите схему: **Plesury**
   - Выберите устройство: **Any iOS Device** (НЕ симулятор!)

2. **Проверьте подпись:**
   - Выберите проект `Plesury` в навигаторе
   - Target: `Plesury`
   - Вкладка **"Signing & Capabilities"**
   - Убедитесь:
     - ✅ **"Automatically manage signing"** включено
     - ✅ Выбран правильный **Team** (с App Store Connect аккаунтом)
     - ✅ **Bundle Identifier**: `app.plesury`

### 2.3. Очистка билда

В Xcode:
- **Product → Clean Build Folder** (или `Cmd+Shift+K`)
- Дождитесь завершения

### 2.4. Создание архива

В Xcode:
- **Product → Archive**
- Дождитесь завершения (может занять 5-15 минут)

**Примечание:** Если появится запрос Keychain Access:
- Введите **пароль от вашей учетной записи macOS** (не Apple ID!)
- Рекомендуется нажать **"Разрешать всегда"** (Always Allow)

---

## Шаг 3: Экспорт IPA

После создания архива откроется окно **Organizer**.

### 3.1. Запуск экспорта

1. Выберите только что созданный архив
2. Нажмите **"Distribute App"**

### 3.2. Выбор метода распространения

**Вариант A: Прямая загрузка в App Store Connect (рекомендуется)**

1. Выберите **"App Store Connect"**
2. Нажмите **"Next"**
3. Выберите **"Upload"**
4. Нажмите **"Next"**
5. Выберите автоматическую подпись
6. Нажмите **"Next"**
7. Проверьте информацию
8. Нажмите **"Upload"**
9. Дождитесь завершения загрузки

**Результат:** Билд автоматически загрузится в App Store Connect и появится в TestFlight через несколько минут.

---

**Вариант B: Экспорт IPA локально (для Transporter)**

1. Выберите **"App Store Connect"**
2. Нажмите **"Next"**
3. Выберите **"Export"**
4. Нажмите **"Next"**
5. Выберите автоматическую подпись
6. Нажмите **"Next"**
7. Выберите папку для сохранения
8. Нажмите **"Export"**

**Результат:** IPA файл будет сохранен локально.

---

## Шаг 4: Загрузка через Transporter (если выбрали Export)

### 4.1. Открытие Transporter

1. Откройте приложение **Transporter** (из App Store)
2. Если нет - установите из App Store

### 4.2. Загрузка IPA

1. Перетащите `.ipa` файл в окно Transporter
2. Или нажмите **"+"** и выберите файл
3. Нажмите **"Deliver"**
4. Дождитесь завершения загрузки

---

## 🔧 Решение проблем

### Проблема: "unable to initiate PIF transfer session"

**Решение:**
```bash
# Закройте Xcode полностью (Cmd+Q)
killall -9 xcodebuild
rm -rf ~/Library/Developer/Xcode/DerivedData/Plesury-*
rm -rf ~/Library/Developer/Xcode/ModuleCache.noindex
# Перезапустите Xcode
```

### Проблема: Отсутствуют ComponentDescriptors.h файлы

**Решение:**
```bash
cd /Users/danil/WORK/KptApp
node node_modules/react-native/scripts/generate-codegen-artifacts.js -p . -t ios -o ios/build/generated
cd ios
rm -rf build/generated/ios
mv build/generated/build/generated/ios build/generated/ 2>/dev/null
rm -rf build/generated/build
```

### Проблема: Конфликты подписи pods

**Решение:**
- Убедитесь, что в Xcode включено **"Automatically manage signing"**
- Не указывайте `CODE_SIGN_IDENTITY` вручную при сборке через командную строку
- Используйте Xcode GUI для сборки архива

### Проблема: Keychain Access запрашивает пароль

**Решение:**
- Введите **пароль от учетной записи macOS** (не Apple ID)
- Нажмите **"Разрешать всегда"** чтобы не вводить каждый раз

---

## 📋 Чек-лист перед сборкой

- [ ] Все изменения закоммичены
- [ ] Версия и build number обновлены (если нужно)
- [ ] Codegen файлы сгенерированы
- [ ] Pods установлены и актуальны
- [ ] Xcode настроен с правильным Team
- [ ] Выбрано устройство "Any iOS Device" (не симулятор)

---

## 🎯 Полный скрипт (одной командой)

Можно создать скрипт для автоматизации подготовки:

```bash
#!/bin/bash
# prepare-build.sh

cd /Users/danil/WORK/KptApp

echo "🧹 Cleaning..."
cd ios
rm -rf build/
rm -rf ~/Library/Developer/Xcode/DerivedData/Plesury-*

echo "📦 Generating codegen..."
cd ..
node node_modules/react-native/scripts/generate-codegen-artifacts.js -p . -t ios -o ios/build/generated

echo "🔧 Fixing codegen paths..."
cd ios
if [ -d "build/generated/build/generated/ios" ]; then
    rm -rf build/generated/ios
    mv build/generated/build/generated/ios build/generated/
    rm -rf build/generated/build
fi

echo "✅ Ready! Now open Xcode and create archive:"
echo "   open ios/Plesury.xcworkspace"
```

Сохраните как `prepare-build.sh`, сделайте исполняемым:
```bash
chmod +x prepare-build.sh
./prepare-build.sh
```

---

## 📝 Полезные команды

### Проверка версии и build number

```bash
cd /Users/danil/WORK/KptApp
grep -A 2 '"ios"' app.json
```

### Просмотр последних билдов в App Store Connect

Откройте: https://appstoreconnect.apple.com → Apps → Plesury → TestFlight

### Проверка статуса загрузки

После загрузки через Xcode или Transporter, проверьте статус в App Store Connect:
- Обычно билд обрабатывается 5-15 минут
- После обработки появится в TestFlight

---

## 🔗 Полезные ссылки

- **App Store Connect**: https://appstoreconnect.apple.com
- **TestFlight**: https://appstoreconnect.apple.com/apps → Plesury → TestFlight
- **EAS Build Dashboard**: https://expo.dev/accounts/wexis/projects/Plesury/builds

---

## 💡 Советы

1. **Всегда используйте Xcode GUI** для создания архива - это самый надежный способ
2. **Генерируйте codegen файлы** перед каждой сборкой, если были изменения в нативных модулях
3. **Используйте "Upload"** вместо "Export" для автоматической загрузки в TestFlight
4. **Проверяйте билд в TestFlight** перед отправкой на ревью в App Store

---

**Последнее обновление:** 10 декабря 2025

