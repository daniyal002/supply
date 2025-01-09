"use client";

import {
  ConfigProvider,
  Table,
  TableColumnsType,
} from "antd";
import style from './RouteInfoTable.module.scss'

import { IRouteInfoResponse, IRouteStepsInfo } from "@/interface/routeInfo";

interface RouteInfoProps {
  RouteInfoData: IRouteInfoResponse | undefined;
}

const RouteInfoTable: React.FC<RouteInfoProps> = ({ RouteInfoData }) => {

  const columns: TableColumnsType<IRouteStepsInfo> = [
    {
      title: "Сотрудник",
      dataIndex: "buyer_name",
      key: "buyer_name",
    },
    {
        title: "Номер шага",
        dataIndex: "step_number",
        key: "step_number",
    },
    {
      title: "Текущий шаг",
      key: "action",
      render: (_: any, record: IRouteStepsInfo) => (
        record.step_container_id === RouteInfoData?.current_step_id ? (
          <p>Да</p>
        ): <p>Нет</p>
      ),
    },


  ];

  const dataSource = RouteInfoData?.steps?.map((step) => ({
    ...step,
    key: step.step_container_id, // Ensure each item has a unique key
  }));

  const rowClassName = (record: IRouteStepsInfo) => {
    return record.step_container_id === RouteInfoData?.current_step_id ? style.highlightRow : ''; // Например, выделяем строку, если номер шага равен 1
  };

  return (
    <ConfigProvider
    theme={{
      token: {
        colorPrimary:"#678098"
      },
    }}
  >
    <Table dataSource={dataSource} columns={columns} scroll={{ x: 200 }} rowClassName={rowClassName} pagination={{locale:{items_per_page:"/ Шагов"} }}/>
    </ConfigProvider>
  );
};

export default RouteInfoTable;
