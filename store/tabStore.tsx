import ApprovalList from "@/components/Approval/ApprovalList/ApprovalList";
import OrderList from "@/components/Order/OrderList/OrderList";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface Tab {
    key: string;
    label: string;
    children: JSX.Element;
}

interface ITabStore {
    tabsOrders: Tab[];
    addTabOrders: (tab: Tab) => void;
    removeTabOrders: (key: string) => void;
    setTabsOrders: (tabs: Tab[]) => void;
    activeTabOrders: string;
    setActiveTabOrders: (key: string) => void;

    tabsApproval: Tab[];
    addTabApproval: (tab: Tab) => void;
    removeTabApproval: (key: string) => void;
    setTabsApproval: (tabs: Tab[]) => void;
    activeTabApproval: string;
    setActiveTabApproval: (key: string) => void;
}

export const useTabStore = create<ITabStore>()(devtools((set) => ({
    tabsOrders: [
        {
            label: "Главная",
            children: <OrderList />,
            key: "1",
            closable: false,
          },
    ],
    addTabOrders: (tab) => set((state) => ({ tabsOrders: [...state.tabsOrders, tab] })),
    removeTabOrders: (key) => set((state) => ({ tabsOrders: state.tabsOrders.filter(tab => tab.key !== key) })),
    setTabsOrders: (tabs) => set({ tabsOrders:tabs }),
    activeTabOrders: "1",
  setActiveTabOrders: (key) => set({ activeTabOrders: key }),

    tabsApproval: [
        {
            label: "Заявки на согласовании",
            children: <ApprovalList />,
            key: "1",
            closable: false,
          },
    ],
    addTabApproval: (tab) => set((state) => ({ tabsApproval: [...state.tabsApproval, tab] })),
    removeTabApproval: (key) => set((state) => ({ tabsApproval: state.tabsApproval.filter(tab => tab.key !== key) })),
    setTabsApproval: (tabs) => set({ tabsApproval:tabs }),
    activeTabApproval: "1",
  setActiveTabApproval: (key) => set({ activeTabApproval: key }),

}),{name:"tabsOrders"}));