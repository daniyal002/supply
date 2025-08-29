"use client";

import { Button, Space, Table, TableColumnsType, TableProps } from "antd";
import { toast } from "sonner";
import { IParlor } from "@/interface/parlor";
import { IEmployee } from "@/interface/employee";
import { IPost } from "@/interface/post";
import { useArchiveEmployeeMutation, useDeleteEmployeeMutation } from "@/hook/employeeHook";
import { useSearch } from "@/helper/TableFilters/hook/useSearch";
import SearchFilter from "@/helper/TableFilters/Filters/SearchFilter";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { filterBySearchText } from "@/helper/TableFilters/Filters/filterBySearchText";
import { useEffect } from "react";
import { useColumnFilterShortcut } from "@/helper/TableFilters/hook/useColumnFilterShortcut";
import SearchFilteredIcon from "@/components/UI/FilteredIcon/SearchFilteredIcon";

interface EmployeeTableProps {
  employeeData: IEmployee[] | undefined;
  onEdit: (id: number) => void;
  isArchive:boolean
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employeeData,
  onEdit,
  isArchive
}) => {
  const { mutate: deleteEmployeeMutation } = useDeleteEmployeeMutation();
  const {mutate:archiveEmployeeMutation} = useArchiveEmployeeMutation()
  const {
    searchText,
    searchedColumn,
    searchInput,
    handleSearch,
    handleReset,
  } = useSearch();

      const { visibleColumnKey, setVisibleColumnKey } = useColumnFilterShortcut("buyer_name");


  const columns: TableColumnsType<IEmployee> = [
    {
      title: "ID",
      dataIndex: "buyer_id",
      key: "buyer_id",
      sorter: (a: any, b: any) => a.buyer_id - b.buyer_id,
      showSorterTooltip: { title: "Сортировка по ID" },
      defaultSortOrder: "descend",
      filterDropdown: (props) => (
        <SearchFilter
          {...props}
          placeholder="Поиск по ID"
          searchText={searchText}
          searchedColumn={searchedColumn}
          dataIndex="buyer_id"
          searchInput={searchInput}
          handleSearch={handleSearch}
          handleReset={handleReset}
        />
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined
          style={{ color: filtered ? "#1677ff" : undefined, fontSize: "18px" }}
        />
      ),
      onFilter: (value, record) =>
      (record.buyer_id as number)
          .toString()
          .toLowerCase()
          .includes((value as string).toLowerCase()),
      onFilterDropdownOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
      render: (text) => {
        const formattedID = text
          ? text.toString().replace(/^0+/, "")
          : "";
        return searchedColumn === "buyer_id" ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={formattedID}
          />
        ) : (
          formattedID
        );
      },
    },

    {
      title: "Наименование",
      dataIndex: "buyer_name",
      key: "buyer_name",
      sorter: (a: any, b: any) =>
        a.buyer_name.localeCompare(b.buyer_name, "ru"),
      showSorterTooltip: { title: "Сортировка по наименованию" },
      filterDropdownOpen: visibleColumnKey === "buyer_name",
      onFilterDropdownOpenChange: (visible) => {
        if (!visible) setVisibleColumnKey(null);
      },
      filterDropdown: (props) => (
        <SearchFilter
          {...props}
          placeholder="Поиск по наименованию"
          searchText={searchText}
          searchedColumn={searchedColumn}
          dataIndex="buyer_name"
          searchInput={searchInput}
          handleSearch={handleSearch}
          handleReset={handleReset}
        />
      ),
      filterIcon: (filtered: boolean) => (
        //  <span
        //     onClick={(e) => {
        //       e.stopPropagation(); // 🔒 предотвратить автоматическое закрытие сортировки
        //       setVisibleColumnKey((prev) => (prev === "buyer_name" ? null : "buyer_name")); // ⬅️ toggle
        //     }}
        //     style={{ cursor: "pointer" }}
        //   >
        //     <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined, fontSize: "18px" }} />
        //   </span>
         <SearchFilteredIcon filtered={filtered} setVisibleColumnKey={setVisibleColumnKey} visibleColumnKey="buyer_name"/>
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
      title: "Вид",
      dataIndex: "buyer_type",
      key: "buyer_type",
      sorter: (a: any, b: any) =>
        a.buyer_type.localeCompare(b.buyer_type, "ru"),
      showSorterTooltip: { title: "Сортировка по виду" },
      render: (buyerType) =>
        buyerType === "employee" ? "Сотрудник" : "Кабинет",
      filters: [
        {
          text: "Сотрудник",
          value: "employee",
        },
        {
          text: "Кабинет",
          value: "parlor",
        },
      ] as { text: string; value: string }[],
      onFilter: (value, record) => record.buyer_type === value,
    },
    {
      title: "Кабинет",
      dataIndex: "parlors",
      key: "parlors",
      sorter: (a: any, b: any) =>
        (a.parlors?.[0]?.parlor_name ?? "").localeCompare(
          b.parlors?.[0]?.parlor_name ?? "",
          "ru"
        ),
      showSorterTooltip: { title: "Сортировка по кабинету" },
      filterDropdown: (props) => (
        <SearchFilter
          {...props}
          placeholder="Поиск по кабинету"
          searchText={searchText}
          searchedColumn={searchedColumn}
          dataIndex="parlors"
          searchInput={searchInput}
          handleSearch={handleSearch}
          handleReset={handleReset}
        />
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined, fontSize:"18px" }} />
      ),
      onFilter: (value, record) => {
        const searchValue = (value as string).toLowerCase();
        return Boolean(
          record.parlors?.some((parlor: IParlor) =>
            parlor.parlor_name.toLowerCase().includes(searchValue)
          )
        );
      },
      render: (parlors: IParlor[]) => {
        if (!parlors || parlors.length === 0) return null;

        return parlors.map((parlor, index) => {
          const shouldHighlight =
            searchedColumn === "parlors" &&
            parlor.parlor_name?.toLowerCase()?.includes(searchText?.toLowerCase());

          return (
            <div key={index}>
              {shouldHighlight ? (
                <Highlighter
                  highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                  searchWords={[searchText]}
                  autoEscape
                  textToHighlight={parlor.parlor_name}
                />
              ) : (
                parlor.parlor_name
              )}
            </div>
          );
        });
      },
    },

    {
      title: "Должность",
      dataIndex: "post",
      key: "post",
      sorter: (a: any, b: any) =>
        a?.post?.post_name?.localeCompare(b?.post?.post_name, "ru"),
      showSorterTooltip: { title: "Сортировка по должности" },
      render: (post: IPost) => post?.post_name, // Or any other suitable React element
    },
    {
      title: "Действия",
      key: "action",
      render: (_: any, record: IEmployee) => (
        <Space size="middle">
          <Button
            type="dashed"
            onClick={() => onEdit(record.buyer_id as number)}
            title="Изменить"
          >
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
                  onClick: () => deleteEmployeeMutation(record),
                },
              })
            }
            title="Удалить"
          >
            Удалить
          </Button>
          <Button onClick={() => archiveEmployeeMutation(record)}>
            {record.is_archive ? "Разархивировать" : "Архивировать"}
          </Button>
        </Space>
      ),
    },
  ];

  const dataSource = employeeData?.map((employee) => ({
    ...employee,
    key: employee.buyer_id, // Ensure each item has a unique key
  })).filter((employee) => employee.is_archive === isArchive);

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      pagination={{ locale: { items_per_page: "/ Сотрудников" } }}
      scroll={{ x: 200 }}
    />
  );
};

export default EmployeeTable;
