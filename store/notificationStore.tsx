import { INotification } from "@/interface/notification"
import { create } from "zustand"

interface INotificationStore{
    notifications:INotification[]
    setNotifications: (notification:INotification[]) => void
}

export const useNotificationStore = create<INotificationStore>((set) => ({
    notifications:[],
    setNotifications: (notification:INotification[]) => set({notifications:notification})
}))