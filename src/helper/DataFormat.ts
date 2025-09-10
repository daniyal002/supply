export const formatNotificationDate = (dateString: string) => {
    try {
      return new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(dateString));
    } catch (e) {
      return 'неверный формат даты';
    }
  };

  export const formatMessageDate = (dateString: string) => {
    try {
      return new Intl.DateTimeFormat('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(dateString));
    } catch (e) {
      return 'неверный формат даты';
    }
  };

  export function getCurrentDateWithMicroseconds() {
    const now = new Date();
    const iso = now.toISOString(); // "2025-09-10T11:02:24.500Z"
    // Заменяем .XXXZ на .XXXXXXZ
    return iso.replace(/\.\d{3}Z$/, match => match.slice(0, -1).padEnd(7, '0') + 'Z');
}