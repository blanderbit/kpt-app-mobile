import { Dimensions, Platform, DimensionValue } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Минимальная ширина для определения планшета (iPad mini ~768, многие планшеты от 600)
const TABLET_MIN_WIDTH = 600;

/**
 * Проверяет, работает ли приложение на планшете
 */
export const isTablet = (): boolean => {
    return SCREEN_WIDTH >= TABLET_MIN_WIDTH;
};

// Размеры экранов iPhone (высота в портретной ориентации)
export const SCREEN_SIZES = {
    // Маленькие экраны (iPhone 7, 8, SE)
    SMALL: 667, // iPhone 7, 8
    SMALL_PLUS: 736, // iPhone 7 Plus, 8 Plus
    
    // Средние экраны (iPhone X, 11, 12, 13)
    MEDIUM: 812, // iPhone X, XS, 11 Pro
    MEDIUM_PLUS: 844, // iPhone 12, 13
    
    // Большие экраны (iPhone 14, 15 Pro Max)
    LARGE: 926, // iPhone 14 Plus, 15 Plus
    LARGE_PLUS: 932, // iPhone 14 Pro Max, 15 Pro Max
} as const;

/**
 * Определяет размер экрана
 */
export const getScreenSize = (): 'small' | 'medium' | 'large' => {
    if (SCREEN_HEIGHT <= SCREEN_SIZES.SMALL_PLUS) {
        return 'small';
    } else if (SCREEN_HEIGHT <= SCREEN_SIZES.MEDIUM_PLUS) {
        return 'medium';
    } else {
        return 'large';
    }
};

/**
 * Проверяет, является ли экран маленьким
 */
export const isSmallScreen = (): boolean => {
    return getScreenSize() === 'small';
};

/**
 * Возвращает адаптивное значение в зависимости от размера экрана
 */
export const getResponsiveValue = <T>(values: {
    small?: T;
    medium?: T;
    large?: T;
    default: T;
}): T => {
    const size = getScreenSize();
    return values[size] ?? values.default;
};

/**
 * Возвращает адаптивный размер шрифта
 * ТОЛЬКО для маленьких экранов - уменьшаем, для остальных - оригинальное значение
 */
export const getResponsiveFontSize = (baseSize: number): number => {
    const size = getScreenSize();
    if (size === 'small') {
        return baseSize * 0.9; // Уменьшаем на 10% для маленьких экранов
    }
    return baseSize; // Для средних и больших - оригинальное значение
};

/**
 * Возвращает адаптивный отступ
 * ТОЛЬКО для маленьких экранов - уменьшаем, для остальных - оригинальное значение
 */
export const getResponsivePadding = (basePadding: number): number => {
    const size = getScreenSize();
    if (size === 'small') {
        return Math.max(basePadding * 0.75, 8); // Уменьшаем отступы для маленьких экранов
    }
    return basePadding; // Для средних и больших - оригинальное значение
};

/**
 * Возвращает адаптивный gap
 * ТОЛЬКО для маленьких экранов - уменьшаем, для остальных - оригинальное значение
 */
export const getResponsiveGap = (baseGap: number): number => {
    const size = getScreenSize();
    if (size === 'small') {
        // Для gap: 16 на маленьких экранах возвращаем 8, для остальных - 0.8 от базового значения
        if (baseGap === 16) {
            return 8;
        }
        return Math.max(baseGap * 0.8, 4); // Уменьшаем gap для маленьких экранов
    }
    return baseGap; // Для средних и больших - оригинальное значение
};

/**
 * Возвращает адаптивный горизонтальный padding для основного контейнера
 * ТОЛЬКО для маленьких экранов: 6-8, для остальных: исходное значение
 */
export const getResponsiveHorizontalPadding = (basePadding: number = 14): number => {
    const size = getScreenSize();
    if (size === 'small') {
        return 6; // Для маленьких экранов используем 6-8 (берем 6 как минимум)
    }
    return basePadding; // Для средних и больших - оригинальное значение
};

/**
 * Возвращает адаптивный paddingTop для навигации
 * ТОЛЬКО для маленьких экранов: 30, для остальных: исходное значение (обычно 60)
 */
export const getResponsiveTopPadding = (basePadding: number = 60): number => {
    const size = getScreenSize();
    if (size === 'small') {
        return 30; // Для маленьких экранов используем 30
    }
    return basePadding; // Для средних и больших - оригинальное значение
};

/**
 * Возвращает адаптивный maxWidth для элементов активности
 * ТОЛЬКО для маленьких экранов: 60%, для остальных: 70% (оригинальное значение)
 */
export const getResponsiveActivityMaxWidth = (): DimensionValue => {
    const size = getScreenSize();
    if (size === 'small') {
        return '60%' as DimensionValue;
    }
    return '70%' as DimensionValue; // Для средних и больших - оригинальное значение
};

export { SCREEN_WIDTH, SCREEN_HEIGHT };

