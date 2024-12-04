import ApprovalTabs from "@/components/Tabs/ApprovalTabs";
import Tab from "@/components/Tabs/Tabs";
import { Tabs, TabsProps } from "antd";

export default function Home() {

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Заявки',
      children: <Tab/>,
    },
    {
      key: '2',
      label: 'Согласования',
      children: <ApprovalTabs/>,
    },
  ];

  return (
    <div>
      <Tabs defaultActiveKey="1" items={items}/>
    </div>
  );
}
