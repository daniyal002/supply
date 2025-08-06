// components/Beforeunload/Beforeunload.tsx
'use client';

import { useEffect } from 'react';

let isLoggingOut = false; // Глобальная переменная в модуле

// Экспортируем функцию, чтобы установить флаг
export const setLoggingOut = (value: boolean) => {
  isLoggingOut = value;
};

export default function Beforeunload({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Если пользователь выходит — не показываем предупреждение
      if (isLoggingOut) {
        return;
      }

      e.preventDefault();
      e.returnValue = 'У вас есть несохранённые изменения. Вы уверены, что хотите уйти?';
      return e.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return <>{children}</>;
}