import { IMessage } from "@/interface/message"
import { create } from "zustand"

interface IMessageStore {
  data: { orderId: number; messages: IMessage[] }[]
  setMessages: (orderId: number, messages: IMessage[]) => void
  deleteMessages: (orderId: number) => void
}

export const useMessageStore = create<IMessageStore>((set, get) => ({
  data: [],

  // Единая функция: добавляет или заменяет
  setMessages: (orderId, messages) => {
    const current = get().data
    const index = current.findIndex(item => item.orderId === orderId)

    const updated = [...current]
    if (index > -1) {
      updated[index] = { orderId, messages }
    } else {
      updated.push({ orderId, messages })
    }

    set({ data: updated })
  },

  // Удаление по orderId
  deleteMessages: (orderId) => {
    set({ data: get().data.filter(item => item.orderId !== orderId) })
  },
}))