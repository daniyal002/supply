import { INotification } from "@/interface/notification"
import { create } from "zustand"

interface INotificationChatStore{
    notificationsChat:INotification[]
    setNotificationsChat: (notification:INotification[]) => void
    deleteNotificationChat: (notification_id:number) => void
    deleteAllNotificationChat: () => void
}

export const useNotificationChatStore = create<INotificationChatStore>((set,get) => ({
    notificationsChat:[],
    setNotificationsChat: (notification:INotification[]) => set({notificationsChat:notification}),
    deleteNotificationChat: (notification_id) => set((state) => ({notificationsChat:state.notificationsChat.filter(notification => notification.notification_id !== notification_id)})),
    deleteAllNotificationChat: () => set(() => ({notificationsChat:[]})),
}))