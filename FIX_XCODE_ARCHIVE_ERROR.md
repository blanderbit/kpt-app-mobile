# Исправление ошибки "unable to initiate PIF transfer session"

## Ошибка:
```
error: Could not compute dependency graph: MsgHandlingError(message: "unable to initiate PIF transfer session (operation in progress?)")
```

## Решение:

### Шаг 1: Закройте Xcode полностью
1. Нажмите **Cmd+Q** чтобы полностью закрыть Xcode
2. Или через меню: **Xcode → Quit Xcode**

### Шаг 2: Очистите процессы (уже выполнено)
```bash
killall -9 xcodebuild
killall -9 com.apple.CoreSimulator.CoreSimulatorService
```

### Шаг 3: Очистите Derived Data (уже выполнено)
```bash
rm -rf ~/Library/Developer/Xcode/DerivedData/Plesury-*
```

### Шаг 4: Очистите кеш модулей
```bash
rm -rf ~/Library/Developer/Xcode/ModuleCache.noindex
```

### Шаг 5: Перезапустите Xcode
1. Откройте Xcode заново
2. Откройте проект: `ios/Plesury.xcworkspace`

### Шаг 6: Попробуйте снова
1. **Product → Clean Build Folder** (Cmd+Shift+K)
2. Подождите 10-15 секунд
3. **Product → Archive**

---

## Альтернативное решение:

Если проблема повторяется:

1. **Закройте все окна Xcode**
2. **Перезагрузите Mac** (если возможно)
3. **Откройте Xcode → Preferences → Locations**
4. **Измените путь к Derived Data** на другой, затем верните обратно
5. **Попробуйте собрать архив снова**

---

## Если ничего не помогает:

Попробуйте собрать через командную строку с очисткой:

```bash
cd ios
xcodebuild clean -workspace Plesury.xcworkspace -scheme Plesury
xcodebuild archive -workspace Plesury.xcworkspace -scheme Plesury -configuration Release -archivePath ./build/Plesury.xcarchive
```

Затем экспортируйте через Xcode Organizer.

