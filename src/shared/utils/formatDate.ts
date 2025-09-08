export function formatDateLong(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;

    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    return d.toLocaleDateString('en-US', options);
}
