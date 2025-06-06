import { INotification } from "@/interface/notification"
import { create } from "zustand"

interface INotificationStore{
    notifications:INotification[]
    setNotifications: (notification:INotification[]) => void
    deleteNotification: (notification_id:number) => void
    deleteAllNotification: () => void
}

export const useNotificationStore = create<INotificationStore>((set,get) => ({
    notifications:[],
    setNotifications: (notification:INotification[]) => set({notifications:notification}),
    deleteNotification: (notification_id) => set((state) => ({notifications:state.notifications.filter(notification => notification.notification_id !== notification_id)})),
    deleteAllNotification: () => set(() => ({notifications:[]}))
}))