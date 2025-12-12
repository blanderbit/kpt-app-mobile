# Инструкция по экспорту IPA для TestFlight

## Способ 1: Через Xcode Organizer (рекомендуется)

1. **Откройте архив:**
   - Архив уже открыт автоматически, или откройте вручную:
   - Xcode → Window → Organizer (или Cmd+Shift+O)
   - Найдите архив `Plesury` в списке

2. **Экспортируйте IPA:**
   - Выберите архив `Plesury`
   - Нажмите кнопку **"Distribute App"**
   - Выберите **"App Store Connect"**
   - Нажмите **"Next"**
   - Выберите **"Upload"** (для загрузки в TestFlight)
   - Нажмите **"Next"**
   - Выберите автоматическую подпись (или вручную, если нужно)
   - Нажмите **"Next"** и дождитесь экспорта
   - Нажмите **"Upload"** для загрузки в App Store Connect

3. **Результат:**
   - IPA файл будет сохранен в выбранную папку
   - Или будет автоматически загружен в App Store Connect

---

## Способ 2: Через Transporter

После экспорта IPA через Xcode:

1. **Откройте Transporter:**
   - Приложение Transporter (из App Store)

2. **Загрузите IPA:**
   - Перетащите `.ipa` файл в Transporter
   - Или нажмите "+" и выберите файл
   - Нажмите **"Deliver"**

---

## Способ 3: Через командную строку (если есть правильные профили)

Если у вас настроены provisioning profiles, можно использовать:

```bash
cd ios
xcodebuild -exportArchive \
  -archivePath ./build/Plesury.xcarchive \
  -exportPath ./build \
  -exportOptionsPlist ./ExportOptions.plist
```

Но для этого нужны правильные App Store provisioning profiles.

---

## Альтернатива: Использовать EAS Submit

Если у вас есть доступ к EAS:

```bash
eas submit --platform ios
```

Это автоматически загрузит последний билд в App Store Connect.

---

## Где найти IPA после экспорта

После экспорта через Xcode Organizer, IPA обычно сохраняется в:
- `~/Desktop/Plesury.ipa`
- Или в папку, которую вы выберете при экспорте

---

**Примечание:** Для TestFlight нужен именно метод "App Store Connect" с правильной подписью. Xcode Organizer автоматически подберет нужные профили.

