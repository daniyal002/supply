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
      dataIndex: "approvers",
      key: "approvers",
    },
    {
      title: "Номер шага",
      dataIndex: "step_number",
      key: "step_number",
    },
    {
      title: "Текущий шаг",
      key: "action",
      render: (_: any, record: IRouteStepsInfo) => {
        // Определяем, является ли текущая строка финальной (статической)
        const isFinalRow = record.step_number === 999;

        // Проверяем, есть ли вообще текущий шаг среди реальных шагов
        const hasCurrentStep = RouteInfoData?.steps?.some(
          step => step.step_container_id === RouteInfoData.current_step_id
        );

        // Если это финальная строка и нет текущего шага — показываем "Да"
        if (isFinalRow && !hasCurrentStep) {
          return <p>Да</p>;
        }

        // Иначе проверяем, совпадает ли с текущим шагом
        return record.step_container_id === RouteInfoData?.current_step_id ? (
          <p>Да</p>
        ) : <p>Нет</p>;
      },
    },
  ];

  const originalSteps = RouteInfoData?.steps || [];
  let steps = [...originalSteps];

  // Добавляем статический элемент, если есть хотя бы один шаг
  if (steps.length > 0) {
    steps.push({
      step_container_id: -999,
      approvers: "Ушло в 1С УНФ",
      step_number: 999,
    });
  }

  const dataSource = steps.map((step) => ({
    ...step,
    key: step.step_container_id,
  }));

  const rowClassName = (record: IRouteStepsInfo) => {
    // Выделяем текущий шаг или финальную строку, если она отмечена как "Да"
    const isFinalRow = record.step_number === 999;
    const hasCurrentStep = RouteInfoData?.steps?.some(
      step => step.step_container_id === RouteInfoData.current_step_id
    );

    if (isFinalRow && !hasCurrentStep) {
      return style.highlightRow; // можно задать свой стиль для этой строки
    }

    return record.step_container_id === RouteInfoData?.current_step_id ? style.highlightRow : '';
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#678098"
        },
      }}
    >
      <Table
        dataSource={dataSource}
        columns={columns}
        scroll={{ x: 200 }}
        rowClassName={rowClassName}
        pagination={{ locale: { items_per_page: "/ Шагов" } }}
      />
    </ConfigProvider>
  );
};

export default RouteInfoTable;