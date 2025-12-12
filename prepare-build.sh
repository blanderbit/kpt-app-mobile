#!/bin/bash
# Скрипт подготовки к сборке iOS билда

set -e

PROJECT_ROOT="/Users/danil/WORK/KptApp"
IOS_DIR="$PROJECT_ROOT/ios"

echo "🚀 Подготовка к сборке iOS билда..."
echo ""

# Переход в корень проекта
cd "$PROJECT_ROOT"

# Очистка
echo "🧹 Очистка предыдущих билдов..."
cd "$IOS_DIR"
rm -rf build/ 2>/dev/null || true
rm -rf ~/Library/Developer/Xcode/DerivedData/Plesury-* 2>/dev/null || true
echo "✅ Очистка завершена"
echo ""

# Генерация codegen
echo "📦 Генерация codegen файлов..."
cd "$PROJECT_ROOT"
node node_modules/react-native/scripts/generate-codegen-artifacts.js -p . -t ios -o ios/build/generated

# Исправление пути codegen
echo "🔧 Исправление путей codegen..."
cd "$IOS_DIR"
if [ -d "build/generated/build/generated/ios" ]; then
    rm -rf build/generated/ios 2>/dev/null || true
    mv build/generated/build/generated/ios build/generated/
    rm -rf build/generated/build
    echo "✅ Codegen файлы перемещены в правильное место"
else
    echo "✅ Codegen файлы уже в правильном месте"
fi
echo ""

# Проверка наличия файлов
echo "🔍 Проверка сгенерированных файлов..."
if [ -f "build/generated/ios/react/renderer/components/lottiereactnative/ComponentDescriptors.h" ]; then
    echo "✅ Codegen файлы успешно сгенерированы"
else
    echo "⚠️  Предупреждение: некоторые codegen файлы могут отсутствовать"
fi
echo ""

echo "✅ Подготовка завершена!"
echo ""
echo "📱 Следующие шаги:"
echo "   1. Откройте проект в Xcode:"
echo "      open $IOS_DIR/Plesury.xcworkspace"
echo ""
echo "   2. В Xcode:"
echo "      - Выберите схему: Plesury"
echo "      - Выберите устройство: Any iOS Device"
echo "      - Product → Clean Build Folder (Cmd+Shift+K)"
echo "      - Product → Archive"
echo ""

