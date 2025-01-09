'use client';

import { Button, Space, Table } from "antd";
import { toast } from "sonner";
import { IDepartment } from "@/interface/department";
import { useDeleteDepartmentMutation } from "@/hook/departmentHook";
import { IHousing } from "@/interface/housing";
import SearchFilter from "@/helper/TableFilters/Filters/SearchFilter";
import { SearchOutlined } from "@ant-design/icons";
import { filterBySearchText } from "@/helper/TableFilters/Filters/filterBySearchText";
import Highlighter from "react-highlight-words";
import { useSearch } from "@/helper/TableFilters/hook/useSearch";
import { Key } from "react";
import { useHousingData } from "@/hook/housingHook";

interface PostTableProps {
  departmentData: IDepartment[] | undefined;
  onEdit: (id: number) => void;
}

const DepartmentTable: React.FC<PostTableProps> = ({ departmentData, onEdit }) => {
  const { mutate: deleteDepartmentMutation } = useDeleteDepartmentMutation();
  const { searchText, searchedColumn, searchInput, handleSearch, handleReset } = useSearch();
  const {housingsData} = useHousingData()


  const columns = [
    {
      title: "ID",
      dataIndex: "department_id",
      key: "department_id",
    },
    {
      title: "Подразделение",
      dataIndex: "department_name",
      key: "department_name",
      sorter: (a:any, b:any) => a.department_name.localeCompare(b.department_name, 'ru'),
      filterDropdown: (props:any) => (
        <SearchFilter
          {...props}
          searchText={searchText}
          searchedColumn={searchedColumn}
          dataIndex="department_name"
          searchInput={searchInput}
          handleSearch={handleSearch}
          handleReset={handleReset}
        />
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
      ),
      onFilter: (value:boolean|Key, record:IDepartment) => {
        const searchValue = (value as string).toLowerCase();
        const department_name = record.department_name.toString().toLowerCase();

        return filterBySearchText(searchValue, department_name);
      },
      render: (text:string) =>
        searchedColumn === "department_name" ? (
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
      title: 'Корпус',
      dataIndex: 'housing',
      key: 'housing',
      sorter: (a: any, b: any) => a.housing?.housing_name.localeCompare(b.housing?.housing_name, 'ru'),
      render: (housing:IHousing) => housing?.housing_name,
      filters: housingsData?.map(housing => ({
        text: housing.housing_name,
        value: housing.housing_id
      })) as { text: string; value: number }[],
      onFilter: (value: boolean | Key, record: IDepartment) =>
        record.housing?.housing_id === Number(value),
    },
    {
      title: "Действия",
      key: "action",
      render: (_: any, record: IDepartment) => (
        <Space size="middle">
          <Button type="dashed" onClick={() => onEdit(record.department_id as number)}>
            Изменить
          </Button>
          <Button
            type="primary"
            danger
            onClick={() =>
              toast.error("Вы точно хотите удалить должность ?", {
                style: {
                  color: "red",
                },
                action: {
                  label: "Удалить",
                  onClick: () => deleteDepartmentMutation(record),
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

  const dataSource = departmentData?.map((department) => ({
    ...department,
    key: department.department_id, // Ensure each item has a unique key
  }));

  return <Table dataSource={dataSource} columns={columns} pagination={{locale:{items_per_page:"/ Подразделений"} }} />;
};

export default DepartmentTable;
