import { IMessage } from "@/interface/message"
import { create } from "zustand"

interface IMessageStore {
  data: { orderId: number; messages: IMessage[] }[]
  setMessages: (
    orderId: number,
    messagesOrUpdater: IMessage[] | ((prev: IMessage[] | undefined) => IMessage[])
  ) => void
  deleteMessages: (orderId: number) => void
}

export const useMessageStore = create<IMessageStore>((set, get) => ({
  data: [],

  // Единая функция: добавляет или заменяет
  // setMessages: (orderId, messages) => {
  //   const current = get().data
  //   const index = current.findIndex(item => item.orderId === orderId)

  //   const updated = [...current]
  //   if (index > -1) {
  //     updated[index] = { orderId, messages }
  //   } else {
  //     updated.push({ orderId, messages })
  //   }

  //   set({ data: updated })
  // },

  setMessages: (orderId, updater) => {
    set(state => {
      const current = [...state.data];
      const index = current.findIndex(item => item.orderId === orderId);

      const prevMessages = index > -1 ? current[index].messages : undefined;

      const newMessages = typeof updater === 'function'
        ? updater(prevMessages)
        : updater;

      if (index > -1) {
        current[index] = { orderId, messages: newMessages };
      } else {
        current.push({ orderId, messages: newMessages });
      }

      return { data: current };
    });
  },

  // Удаление по orderId
  deleteMessages: (orderId) => {
    set({ data: get().data.filter(item => item.orderId !== orderId) })
  },
}))