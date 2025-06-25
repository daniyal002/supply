'use client';

import { Button, Space, Table, TableColumnsType } from "antd";
import { toast } from "sonner";
import { IDepartment } from "@/interface/department";
import { IParlor } from "@/interface/parlor";
import { useDeleteParlorMutation } from "@/hook/parlorHook";
import SearchFilter from "@/helper/TableFilters/Filters/SearchFilter";
import { SearchOutlined } from "@ant-design/icons";
import { filterBySearchText } from "@/helper/TableFilters/Filters/filterBySearchText";
import Highlighter from "react-highlight-words";
import { useSearch } from "@/helper/TableFilters/hook/useSearch";
import { useMemo } from "react";

interface PostTableProps {
  parlorData: IParlor[] | undefined;
  onEdit: (id: number) => void;
}

const ParlorTable: React.FC<PostTableProps> = ({ parlorData, onEdit }) => {
  const { mutate: deleteParlorMutation } = useDeleteParlorMutation();
  const { searchText, searchedColumn, searchInput, handleSearch, handleReset } = useSearch();

  const columns: TableColumnsType<IParlor> = [
    {
      title: 'ID',
      dataIndex: 'parlor_id',
      key: 'parlor_id',
      sorter: (a:any, b:any) => a.id - b.id,
      showSorterTooltip: { title: "Сортировка по ID" },
    },

    {
      title: 'Кабинет',
      dataIndex: 'parlor_name',
      key: 'parlor_name',
      sorter: (a: any, b: any) => a.parlor_name.localeCompare(b.parlor_name, 'ru'),
      showSorterTooltip: { title: "Сортировка по кабинету" },
      filterDropdown: (props) => (
        <SearchFilter
          {...props}
          placeholder="Поиск по кабинету"
          searchText={searchText}
          searchedColumn={searchedColumn}
          dataIndex="parlor_name"
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
        const parlor_name = record.parlor_name.toString().toLowerCase();

        return filterBySearchText(searchValue, parlor_name);
      },
      render: (text) =>
        searchedColumn === "parlor_name" ? (
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
      title: 'Подразделение',
      dataIndex: 'department',
      key: 'department',
      sorter: (a: any, b: any) =>
        a.department.department_name.localeCompare(b.department.department_name, 'ru'),
      showSorterTooltip: { title: "Сортировка по подразделению" },
      render: (department: IDepartment) => department?.department_name,
      filters: useMemo(() => {
        if (!parlorData) return [];

        const uniqueDepartments = Array.from(
          new Map(
            parlorData
              .filter(p => p.department && p.department.department_id) // Фильтруем сразу по наличию department_id
              .map(parlor => [
                parlor.department!.department_id,
                {
                  text: parlor.department!.department_name,
                  value: parlor.department!.department_id as number, // Явно приводим к number
                },
              ])
          ).values()
        );

        return uniqueDepartments
          .sort((a, b) => a.text.localeCompare(b.text, 'ru'));
      }, [parlorData]),
      onFilter: (value, record) =>
        record.department?.department_id === value,
    },
    {
      title: "Действия",
      key: "action",
      render: (_: any, record: IParlor) => (
        <Space size="middle">
          <Button type="dashed" onClick={() => onEdit(record.parlor_id as number)}>
            Изменить
          </Button>
          <Button
            type="primary"
            danger
            onClick={() =>
              toast.error("Вы точно хотите удалить кабинет ?", {
                style: {
                  color: "red",
                },
                action: {
                  label: "Удалить",
                  onClick: () => deleteParlorMutation(record),
                },
              })
            }
          >
            Удалить
          </Button>
        </Space>
      ),
    },
  ];

  const dataSource = parlorData?.map((parlor) => ({
    ...parlor,
    key: parlor.parlor_id, // Ensure each item has a unique key
  }));

  return <Table dataSource={dataSource} columns={columns} pagination={{locale:{items_per_page:"/ Кабинетов"} }}/>;
};

export default ParlorTable;
