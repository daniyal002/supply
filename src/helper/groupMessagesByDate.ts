// helper/groupMessagesByDate.ts
import { IMessage } from "@/interface/message";

export const groupMessagesByDate = (messages: IMessage[]) => {
  const groups: { [date: string]: IMessage[] } = {};

  // Сортируем по времени (от старых к новым)
  const sorted = [...messages].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  sorted.forEach((msg) => {
    const date = new Date(msg.created_at).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    // Пример: "3 сентября 2025"

    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(msg);
  });

  return groups;
};