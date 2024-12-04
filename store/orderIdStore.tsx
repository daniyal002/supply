import { create } from "zustand";
import { devtools } from 'zustand/middleware';

interface IOrderIdStore {
    orderId: string;
    setOrderId: (orderId: string) => void;
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
            set({ orderId });
            console.log(orderId);
        },
        draftOrderId: "0",
        setDraftOrderId: (draftOrderId) => {
            set({ draftOrderId });
        },
        targetKey: "0",
        setTargetKey: (targetKey) => {
            set({ targetKey });
            console.log(targetKey);
        }
    }), { name: "OrderIdStore" }) // Укажите имя для devtools
);