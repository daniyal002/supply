// store/onlineStore.ts
import { create } from "zustand";

interface OnlineState {
  orderTabCount: Map<number, number>; // orderId → количество открытых вкладок
  openTab: (orderId: number) => void;
  closeTab: (orderId: number) => void;
  isAnyTabOpen: (orderId: number) => boolean;
  getTabCount: (orderId: number) => number;
}

export const useOnlineStore = create<OnlineState>((set, get) => ({
  orderTabCount: new Map(),

  openTab: (orderId) =>
    set((state) => {
      const updated = new Map(state.orderTabCount);
      updated.set(orderId, (updated.get(orderId) || 0) + 1);
      return { orderTabCount: updated };
    }),

  closeTab: (orderId) =>
    set((state) => {
      const updated = new Map(state.orderTabCount);
      const count = updated.get(orderId) || 0;
      if (count <= 1) {
        updated.delete(orderId);
      } else {
        updated.set(orderId, count - 1);
      }
      return { orderTabCount: updated };
    }),

  isAnyTabOpen: (orderId) => get().orderTabCount.has(orderId),
  getTabCount: (orderId) => get().orderTabCount.get(orderId) || 0,
}));