import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Создаем QueryClient с настройками
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Время кеширования - 5 минут
      staleTime: 5 * 60 * 1000,
      // Время жизни кеша - 10 минут
      gcTime: 10 * 60 * 1000,
      // Повторные попытки при ошибке
      retry: (failureCount, error: any) => {
        // Не повторяем для 4xx ошибок (кроме 408, 429)
        if (error?.status >= 400 && error?.status < 500 && error?.status !== 408 && error?.status !== 429) {
          return false;
        }
        // Максимум 3 попытки
        return failureCount < 3;
      },
      // Интервал между попытками
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Рефетч при фокусе окна
      refetchOnWindowFocus: false,
      // Рефетч при восстановлении соединения
      refetchOnReconnect: true,
    },
    mutations: {
      // Повторные попытки для мутаций
      retry: (failureCount, error: any) => {
        // Не повторяем для 4xx ошибок
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});

interface QueryProviderProps {
  children: ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export { queryClient };

