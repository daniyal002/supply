"use client";

import {
  ConfigProvider,
  Table,
  TableColumnsType,
} from "antd";

import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { IStepHistory } from "@/interface/stepHistory";
import { useSearch } from "@/helper/TableFilters/hook/useSearch";
import SearchFilter from "@/helper/TableFilters/Filters/SearchFilter";
import StatusFilter from "@/helper/TableFilters/Filters/StatusFilter";
import { filterBySearchText } from "@/helper/TableFilters/Filters/filterBySearchText";

interface OrderStepHistoryProps {
  OrderStepHistoryData: IStepHistory[] | undefined;
}

const OrderStepHistoryTable: React.FC<OrderStepHistoryProps> = ({ OrderStepHistoryData }) => {

  const { searchText, searchedColumn, searchInput, handleSearch, handleReset } = useSearch();
  const StatusOption = [{label:"Согласована",value:"Согласована"},{label:"Отклонена",value:"Отклонена"}]



  const columns: TableColumnsType<IStepHistory> = [
    {
      title: "Сотрудник",
      dataIndex: "buyer_name",
      key: "buyer_name",
      sorter: (a: any, b: any) =>
        a.buyer_name.localeCompare(b.buyer_name, "ru"),
      filterDropdown: (props) => (
        <SearchFilter
          {...props}
          searchText={searchText}
          searchedColumn={searchedColumn}
          dataIndex="buyer_name"
          searchInput={searchInput}
          handleSearch={handleSearch}
          handleReset={handleReset}
        />
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
      ),
      onFilter: (value, record) => {
        const searchValue = (value as string).toLowerCase();
        const buyer_name = record.buyer_name.toString().toLowerCase();

        return filterBySearchText(searchValue, buyer_name);
      },
      render: (text) =>
        searchedColumn === "buyer_name" ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : (
          text
        ),
    },
    {
      title: "Дата",
      dataIndex: "created_at",
      key: "created_at",
      sorter: (a: any, b: any) =>
        a.created_at.localeCompare(b.created_at, "ru"),
      render: (text: string) => {
        const date = new Date(text);
        return date.toLocaleString("ru-RU", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
      },
    },
    {
        title: "Статус",
        dataIndex: "status_name",
        key: "status_name",
        sorter: (a: any, b: any) =>
          a.status_name.localeCompare(
            b.status_name,
            "ru"
          ),
        render: (status_name: string) => status_name,
        filterDropdown: ({
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
        }) => (
          <StatusFilter
            options={StatusOption}
            setSelectedKeys={setSelectedKeys}
            selectedKeys={selectedKeys.map(key => String(key))}
            confirm={confirm}
            clearFilters={() => clearFilters && clearFilters()}
          />
        ),
        onFilter: (value, record) => record.status_name === value,
      },

    {
      title: "Комментарий",
      dataIndex: "note",
      key: "note",
      sorter: (a: any, b: any) =>
        a.note.localeCompare(b.note, "ru"),
    },

  ];

  const dataSource = OrderStepHistoryData?.map((order) => ({
    ...order,
    key: order.steps_history_id, // Ensure each item has a unique key
  }));

  return (
    <ConfigProvider
    theme={{
      token: {
        colorPrimary:"#678098"
      },
    }}
  >
    <Table dataSource={dataSource} columns={columns} scroll={{ x: 200 }} pagination={{locale:{items_per_page:"/ Шагов"} }}/>
    </ConfigProvider>
  );
};

export default OrderStepHistoryTable;
