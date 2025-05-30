import AdminOrderList from "@/components/AdminOrderList/AdminOrderList";
import ApprovalList from "@/components/Approval/ApprovalList/ApprovalList";
import DraftOrderList from "@/components/Order/OrderDraftLitst/DraftOrderList";
import OrderList from "@/components/Order/OrderList/OrderList";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface Tab {
  key: string;
  label: string;
  children: JSX.Element;
  closable: boolean;
}

interface ITabStore {
  tabsOrders: Tab[];
  addTabOrders: (tab: Tab) => void;
  removeTabOrders: (key: string) => void;
  setTabsOrders: (tabs: Tab[]) => void;
  activeTabOrders: string;
  setActiveTabOrders: (key: string) => void;
  deleteTabsOrders: () => void;

  tabsDraftOrders: Tab[];
  addTabDraftOrders: (tab: Tab) => void;
  removeTabDraftOrders: (key: string) => void;
  setTabsDraftOrders: (tabs: Tab[]) => void;
  activeTabDraftOrders: string;
  setActiveTabDraftOrders: (key: string) => void;
  deleteTabsDraftOrders: () => void;

  tabsApproval: Tab[];
  addTabApproval: (tab: Tab) => void;
  removeTabApproval: (key: string) => void;
  setTabsApproval: (tabs: Tab[]) => void;
  activeTabApproval: string;
  setActiveTabApproval: (key: string) => void;
  deleteTabsApproval: () => void;

  tabsAdminOrders: Tab[];
  addTabAdminOrders: (tab: Tab) => void;
  removeTabAdminOrders: (key: string) => void;
  setTabsAdminOrders: (tabs: Tab[]) => void;
  activeTabAdminOrders: string;
  setActiveTabAdminOrders: (key: string) => void;
  deleteTabsAdminOrders: () => void;

  activeMainTabKey:string,
  setActiveMainTabKey: (key: string) => void;
}

export const useTabStore = create<ITabStore>()(
  devtools(
    (set) => ({
      tabsOrders: [
        {
          label: "Главная",
          children: <OrderList />,
          key: "1",
          closable: false,
        },
      ],
      addTabOrders: (tab) =>
        set((state) => ({ tabsOrders: [...state.tabsOrders, tab] })),
      removeTabOrders: (key) =>
        set((state) => ({
          tabsOrders: state.tabsOrders.filter((tab) => tab.key !== key),
        })),
      setTabsOrders: (tabs) => set({ tabsOrders: tabs }),
      activeTabOrders: "1",
      setActiveTabOrders: (key) => set({ activeTabOrders: key }),
      deleteTabsOrders: () =>
        set({
          tabsOrders: [
            {
              label: "Главная",
              children: <OrderList />,
              key: "1",
              closable: false,
            },
          ],
          activeTabOrders: "1",
        }),

        tabsDraftOrders: [
          {
            label: "Главная",
            children: <DraftOrderList />,
            key: "1",
            closable: false,
          },
        ],
        addTabDraftOrders: (tab) =>
          set((state) => ({ tabsDraftOrders: [...state.tabsDraftOrders, tab] })),
        removeTabDraftOrders: (key) =>
          set((state) => ({
            tabsDraftOrders: state.tabsDraftOrders.filter((tab) => tab.key !== key),
          })),
        setTabsDraftOrders: (tabs) => set({ tabsDraftOrders: tabs }),
        activeTabDraftOrders: "1",
        setActiveTabDraftOrders: (key) => set({ activeTabDraftOrders: key }),
        deleteTabsDraftOrders: () =>
          set({
            tabsDraftOrders: [
              {
                label: "Главная",
                children: <DraftOrderList />,
                key: "1",
                closable: false,
              },
            ],
            activeTabDraftOrders: "1",
          }),

      tabsApproval: [
        {
          label: "Заявки на согласовании",
          children: <ApprovalList />,
          key: "1",
          closable: false,
        },
      ],
      addTabApproval: (tab) =>
        set((state) => ({ tabsApproval: [...state.tabsApproval, tab] })),
      removeTabApproval: (key) =>
        set((state) => ({
          tabsApproval: state.tabsApproval.filter((tab) => tab.key !== key),
        })),
      setTabsApproval: (tabs) => set({ tabsApproval: tabs }),
      activeTabApproval: "1",
      setActiveTabApproval: (key) => set({ activeTabApproval: key }),
      deleteTabsApproval: () =>
        set({
          tabsApproval: [
            {
              label: "Заявки на согласовании",
              children: <ApprovalList />,
              key: "1",
              closable: false,
            },
          ],
          activeTabApproval: "1",
        }),

        tabsAdminOrders: [
          {
            label: "Главная",
            children: <AdminOrderList />,
            key: "1",
            closable: false,
          },
        ],
        addTabAdminOrders: (tab) =>
          set((state) => ({ tabsAdminOrders: [...state.tabsAdminOrders, tab] })),
        removeTabAdminOrders: (key) =>
          set((state) => ({
            tabsAdminOrders: state.tabsAdminOrders.filter((tab) => tab.key !== key),
          })),
        setTabsAdminOrders: (tabs) => set({ tabsAdminOrders: tabs }),
        activeTabAdminOrders: "1",
        setActiveTabAdminOrders: (key) => set({ activeTabAdminOrders: key }),
        deleteTabsAdminOrders: () =>
          set({
            tabsAdminOrders: [
              {
                label: "Главная",
                children: <AdminOrderList />,
                key: "1",
                closable: false,
              },
            ],
            activeTabAdminOrders: "1",
          }),

        activeMainTabKey: "1",
        setActiveMainTabKey: (key) => set({activeMainTabKey:key})

    }),
    { name: "tabsOrders" }
  )
);
