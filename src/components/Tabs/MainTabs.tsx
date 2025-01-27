'use client'
import Tab from "@/components/Tabs/Tabs";
import ApprovalTabs from "@/components/Tabs/ApprovalTabs";
import { Tabs, TabsProps } from "antd";
import { useApprovalOrders } from "@/hook/orderHook";

export const MainTabs = () => {
    const { approvalOrders } = useApprovalOrders();

    const items: TabsProps["items"] = [
      {
        key: "1",
        label: "Заявки",
        children: <Tab />,
      },
      {
        key: "2",
        label: (
          <span className="approval-label" data-descr={approvalOrders?.length}>
            Согласования
          </span>
        ),
        children: <ApprovalTabs />,
      },
    ];
    return(
        <div style={{padding:"0 10px"}}>
        <Tabs defaultActiveKey="1" items={items} />
      </div>
    )
  };