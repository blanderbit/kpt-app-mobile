#!/bin/bash

# ============================================
# EAS Build & Download Script для iOS
# ============================================
# Этот скрипт автоматизирует процесс сборки и скачивания IPA файла
#
# Использование:
#   ./build-and-download.sh [profile]
#
# Примеры:
#   ./build-and-download.sh production
#   ./build-and-download.sh preview
#   ./build-and-download.sh development
# ============================================

set -e  # Остановить выполнение при ошибке

# Цвета для вывода
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Параметры
PROFILE=${1:-production}  # По умолчанию production
PROJECT_NAME="Plesury"
PLATFORM="ios"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}EAS Build & Download для ${PROJECT_NAME}${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Проверка наличия EAS CLI
if ! command -v eas &> /dev/null; then
    echo -e "${RED}❌ EAS CLI не установлен!${NC}"
    echo "Установите: npm install -g eas-cli"
    exit 1
fi

echo -e "${GREEN}✅ EAS CLI найден${NC}"
echo ""

# Шаг 1: Проверка текущей версии
echo -e "${YELLOW}📋 Шаг 1: Проверка текущей версии и build number...${NC}"
VERSION_INFO=$(eas build:version:get --platform ios 2>&1 || true)
echo "$VERSION_INFO"
echo ""

# Шаг 2: Сборка
echo -e "${YELLOW}🔨 Шаг 2: Запуск сборки (profile: ${PROFILE})...${NC}"
echo -e "${BLUE}Это может занять 10-20 минут...${NC}"
echo ""

BUILD_OUTPUT=$(eas build --platform ${PLATFORM} --profile ${PROFILE} --non-interactive 2>&1)
BUILD_ID=$(echo "$BUILD_OUTPUT" | grep -oP 'build/[a-f0-9-]+' | head -1 | cut -d'/' -f2 || echo "")

if [ -z "$BUILD_ID" ]; then
    echo -e "${RED}❌ Не удалось получить ID билда${NC}"
    echo "Вывод команды:"
    echo "$BUILD_OUTPUT"
    exit 1
fi

echo -e "${GREEN}✅ Билд запущен!${NC}"
echo -e "${BLUE}Build ID: ${BUILD_ID}${NC}"
echo ""

# Шаг 3: Ожидание завершения билда
echo -e "${YELLOW}⏳ Шаг 3: Ожидание завершения билда...${NC}"
echo "Можно отслеживать прогресс: https://expo.dev/accounts/wexis/projects/${PROJECT_NAME}/builds/${BUILD_ID}"
echo ""

while true; do
    BUILD_STATUS=$(eas build:view ${BUILD_ID} --json 2>/dev/null | grep -oP '"status":\s*"\K[^"]+' || echo "unknown")
    
    if [ "$BUILD_STATUS" == "finished" ]; then
        echo -e "${GREEN}✅ Билд завершен успешно!${NC}"
        break
    elif [ "$BUILD_STATUS" == "errored" ] || [ "$BUILD_STATUS" == "canceled" ]; then
        echo -e "${RED}❌ Билд завершился с ошибкой: ${BUILD_STATUS}${NC}"
        exit 1
    else
        echo -e "${BLUE}Статус: ${BUILD_STATUS}... (проверка через 30 секунд)${NC}"
        sleep 30
    fi
done

echo ""

# Шаг 4: Получение URL для скачивания
echo -e "${YELLOW}📥 Шаг 4: Получение URL для скачивания...${NC}"
BUILD_INFO=$(eas build:view ${BUILD_ID} --json 2>/dev/null || eas build:list --platform ${PLATFORM} --limit 1 --json 2>/dev/null)

# Пытаемся извлечь URL из JSON или из списка билдов
IPA_URL=$(echo "$BUILD_INFO" | grep -oP '"applicationArchiveUrl":\s*"\K[^"]+' | head -1)

if [ -z "$IPA_URL" ]; then
    # Альтернативный способ - через список билдов
    echo -e "${BLUE}Получаю URL из списка билдов...${NC}"
    BUILD_LIST=$(eas build:list --platform ${PLATFORM} --limit 1 2>&1)
    IPA_URL=$(echo "$BUILD_LIST" | grep -oP 'Application Archive URL\s+\Khttps://[^\s]+' | head -1)
fi

if [ -z "$IPA_URL" ]; then
    echo -e "${YELLOW}⚠️  Не удалось автоматически получить URL${NC}"
    echo "Получите URL вручную:"
    echo "  eas build:list --platform ${PLATFORM} --limit 1"
    echo ""
    read -p "Введите Application Archive URL: " IPA_URL
fi

if [ -z "$IPA_URL" ]; then
    echo -e "${RED}❌ URL не указан, невозможно скачать${NC}"
    exit 1
fi

echo -e "${GREEN}✅ URL получен${NC}"
echo ""

# Шаг 5: Скачивание IPA
echo -e "${YELLOW}⬇️  Шаг 5: Скачивание IPA файла...${NC}"

# Определяем имя файла
BUILD_NUMBER=$(echo "$BUILD_INFO" | grep -oP '"buildNumber":\s*\K[0-9]+' | head -1 || echo "latest")
VERSION=$(echo "$BUILD_INFO" | grep -oP '"version":\s*"\K[^"]+' | head -1 || echo "1.0.0")
IPA_FILENAME="${PROJECT_NAME}-v${VERSION}-build-${BUILD_NUMBER}.ipa"

echo "Скачиваю: ${IPA_URL}"
echo "Сохраняю как: ${IPA_FILENAME}"
echo ""

# Скачивание с прогресс-баром
if command -v curl &> /dev/null; then
    curl -L --progress-bar -o "${IPA_FILENAME}" "${IPA_URL}"
elif command -v wget &> /dev/null; then
    wget --progress=bar -O "${IPA_FILENAME}" "${IPA_URL}"
else
    echo -e "${RED}❌ Не найден curl или wget для скачивания${NC}"
    exit 1
fi

# Проверка успешности скачивания
if [ -f "${IPA_FILENAME}" ]; then
    FILE_SIZE=$(ls -lh "${IPA_FILENAME}" | awk '{print $5}')
    echo ""
    echo -e "${GREEN}✅ IPA файл успешно скачан!${NC}"
    echo ""
    echo -e "${BLUE}📦 Информация о файле:${NC}"
    echo "  Имя: ${IPA_FILENAME}"
    echo "  Размер: ${FILE_SIZE}"
    echo "  Путь: $(pwd)/${IPA_FILENAME}"
    echo ""
    echo -e "${GREEN}🎉 Готово! Файл готов к использованию.${NC}"
else
    echo -e "${RED}❌ Ошибка при скачивании файла${NC}"
    exit 1
fi


