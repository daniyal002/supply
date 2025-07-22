"use client";

import { IPost } from "@/interface/post";
import { Button, Space, Table, TableColumnsType } from "antd";
import { toast } from "sonner";
import { IHousing } from "@/interface/housing";
import { useArchiveHousingMutation, useDeleteHousingMutation } from "@/hook/housingHook";
import SearchFilter from "@/helper/TableFilters/Filters/SearchFilter";
import { SearchOutlined } from "@ant-design/icons";
import { Key } from "react";
import { filterBySearchText } from "@/helper/TableFilters/Filters/filterBySearchText";
import Highlighter from "react-highlight-words";
import { useSearch } from "@/helper/TableFilters/hook/useSearch";

interface PostTableProps {
  housingsData: IHousing[] | undefined;
  onEdit: (id: number) => void;
  isArchive:boolean
}

const HousingTable: React.FC<PostTableProps> = ({ housingsData, onEdit, isArchive }) => {
  const { mutate: deletePostMutation } = useDeleteHousingMutation();
  const { searchText, searchedColumn, searchInput, handleSearch, handleReset } =
    useSearch();
    const {mutate:archiveHousingMutation} = useArchiveHousingMutation()
  const columns: TableColumnsType<IHousing> = [
    {
      title: "ID",
      dataIndex: "housing_id",
      key: "housing_id",
      sorter: (a: any, b: any) => a.housing_id - b.housing_id,
      showSorterTooltip: { title: "Сортировка по ID" },
    },
    {
      title: "Корпус",
      dataIndex: "housing_name",
      key: "housing_name",
      sorter: (a: any, b: any) =>
        a.housing_name.localeCompare(b.housing_name, "ru"),
      showSorterTooltip: { title: "Сортировка по корпусу" },
      filterDropdown: (props: any) => (
        <SearchFilter
          {...props}
          placeholder="Поиск по корпусу"
          searchText={searchText}
          searchedColumn={searchedColumn}
          dataIndex="housing_name"
          searchInput={searchInput}
          handleSearch={handleSearch}
          handleReset={handleReset}
        />
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined, fontSize:"18px" }} />
      ),
      onFilter: (value: boolean | Key, record: IHousing) => {
        const searchValue = (value as string).toLowerCase();
        const housing_name = record.housing_name.toString().toLowerCase();

        return filterBySearchText(searchValue, housing_name);
      },
      render: (text: string) =>
        searchedColumn === "housing_name" ? (
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
      title: "Действия",
      key: "action",
      render: (_: any, record: IHousing) => (
        <Space size="middle">
          <Button
            type="dashed"
            onClick={() => onEdit(record.housing_id as number)}
          >
            Изменить
          </Button>
          <Button
            type="primary"
            danger
            onClick={() =>
              toast.error("Вы точно хотите удалить корпус ?", {
                style: {
                  color: "red",
                },
                action: {
                  label: "Удалить",
                  onClick: () => deletePostMutation(record),
                },
              })
            }
          >
            Удалить
          </Button>
          <Button onClick={() => archiveHousingMutation(record)}>
            {record.is_archive ? "Разархивировать" : "Архивировать"}
          </Button>
        </Space>
      ),
    },
  ];

  const dataSource = housingsData?.map((housing) => ({
    ...housing,
    key: housing.housing_id, // Ensure each item has a unique key
  })).filter((housing) => housing.is_archive === isArchive);;

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      pagination={{ locale: { items_per_page: "/ Корпусов" } }}
      scroll={{ x: 200 }}
    />
  );
};

export default HousingTable;
