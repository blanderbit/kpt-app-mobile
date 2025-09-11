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
      // Отключаем повторные попытки для всех запросов
      retry: false,
      // Рефетч при фокусе окна
      refetchOnWindowFocus: false,
      // Рефетч при восстановлении соединения
      refetchOnReconnect: false,
    },
    mutations: {
      // Отключаем повторные попытки для всех мутаций
      retry: false,
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

