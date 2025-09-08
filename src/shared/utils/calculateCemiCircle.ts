type SemiCircleProps = {
    valueA: number;
    valueB: number;
    gap?: number; // px
};

/**
 * Рассчитывает пропорции для полусферы с учётом gap.
 * Возвращает объект с долями первой и второй дуги от полукруга (0..1) и gap.
 */
export function calculateSemiCircleProportions({ valueA, valueB, gap = 6 }: SemiCircleProps) {
    const total = Math.max(0, valueA) + Math.max(0, valueB);

    if (total === 0) {
        return {
            proportionA: 0,
            proportionB: 0,
            gap,
        };
    }

    const proportionA = valueA / total;
    const proportionB = valueB / total;

    return {
        proportionA,
        proportionB,
        gap,
    };
}
