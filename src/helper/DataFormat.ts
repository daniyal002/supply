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