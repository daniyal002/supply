'use client'
import Tab from "@/components/Tabs/Tabs";
import ApprovalTabs from "@/components/Tabs/ApprovalTabs";
import { Tabs, TabsProps } from "antd";
import Notification from "../Notification/Notification";

export const MainTabs = () => {
    const items: TabsProps["items"] = [
      {
        key: "1",
        label: "Заявки",
        children: <Tab />,
      },
      {
        key: "2",
        label: "Согласования",
        children: <ApprovalTabs />,
      },
    ];
    return(
        <div style={{padding:"0 10px"}}>
        <Tabs defaultActiveKey="1" items={items} />
        <Notification/>
      </div>
    )
  };