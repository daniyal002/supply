import { create } from "zustand";
import { devtools } from 'zustand/middleware';

interface IOrderIdStore {
    orderId: string;
    setOrderId: (orderId: string) => void;
    adminOrderId: string;
    setAdminOrderId: (adminOrderId: string) => void;
    draftOrderId: string;
    setDraftOrderId: (draftOrderId: string) => void;
    targetKey: string;
    setTargetKey: (targetKey: string) => void;
}

// Используем devtools с правильными типами
export const useOrderIdStore = create<IOrderIdStore>()(
    devtools((set, get) => ({
        orderId: "0",
        setOrderId: (orderId) => {
            set({ orderId:orderId });
        },
        adminOrderId: "0",
        setAdminOrderId: (adminOrderId) => {
            set({adminOrderId:adminOrderId});
        },
        draftOrderId: "0",
        setDraftOrderId: (draftOrderId) => {
            set({ draftOrderId:draftOrderId });
        },
        targetKey: "0",
        setTargetKey: (targetKey) => {
            set({ targetKey:targetKey });
        }
    }), { name: "OrderIdStore" }) // Укажите имя для devtools
);