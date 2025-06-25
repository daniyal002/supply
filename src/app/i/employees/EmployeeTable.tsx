'use client';

import { Button, Space, Table, TableColumnsType, TableProps } from "antd";
import { toast } from "sonner";
import { IParlor } from "@/interface/parlor";
import { IEmployee } from "@/interface/employee";
import { IPost } from "@/interface/post";
import { useDeleteEmployeeMutation } from "@/hook/employeeHook";
import { useSearch } from "@/helper/TableFilters/hook/useSearch";
import SearchFilter from "@/helper/TableFilters/Filters/SearchFilter";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { filterBySearchText } from "@/helper/TableFilters/Filters/filterBySearchText";
import { useEffect } from "react";

interface EmployeeTableProps {
  employeeData: IEmployee[] | undefined;
  onEdit: (id: number) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ employeeData, onEdit }) => {
  const { mutate: deleteEmployeeMutation } = useDeleteEmployeeMutation();
  const { searchText, searchedColumn,setSearchedColumn, searchInput, handleSearch, handleReset } = useSearch();


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {

      if ((e.ctrlKey || e.metaKey) && (e.key === 'f' || e.key === "а")) {
        e.preventDefault();

        setSearchedColumn("buyer_name");

        // Ищем кнопку фильтра по колонке "buyer_name"
        const filterButton = document.querySelector(
          `.ant-dropdown-trigger.ant-table-filter-trigger`
        ) as HTMLButtonElement;

        if (filterButton) {
          filterButton.click(); // имитируем клик

          // Через небольшую задержку ставим фокус на инпут
          setTimeout(() => {
            searchInput.current?.focus();
          }, 200);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const columns: TableColumnsType<IEmployee> = [
    {
      title: 'ID',
      dataIndex: 'buyer_id',
      key: 'buyer_id',
      sorter: (a:any, b:any) => a.buyer_id - b.buyer_id,
    },

    {
      title: 'Наименование',
      dataIndex: 'buyer_name',
      key: 'buyer_name',
      sorter: (a: any, b: any) => a.buyer_name.localeCompare(b.buyer_name, 'ru'),
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
      title: 'Вид',
      dataIndex: 'buyer_type',
      key: 'buyer_type',
      sorter: (a: any, b: any) => a.buyer_type.localeCompare(b.buyer_type, 'ru'),
      render:(buyerType) => buyerType === "employee" ? "Сотрудник" : "Кабинет",
      filters: [{
        text: "Сотрудник",
        value: "employee"
      },{
        text:"Кабинет",
        value:"parlor"
      }] as { text: string; value: string }[],
      onFilter: (value, record) =>
        record.buyer_type === value,
    },
    {
      title: 'Кабинет',
      dataIndex: 'parlors',
      key: 'parlors',
      sorter: (a: any, b: any) =>
        (a.parlors?.[0]?.parlor_name ?? '').localeCompare(
          b.parlors?.[0]?.parlor_name ?? '',
          'ru'
        ),
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
        <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
      ),
      onFilter: (value, record) => {
        const searchValue = (value as string).toLowerCase();
        return Boolean(record.parlors?.some((parlor: IParlor) =>
          parlor.parlor_name.toLowerCase().includes(searchValue)
        ));
      },
      render: (parlors: IParlor[]) => {
        if (!parlors || parlors.length === 0) return null;

        return parlors.map((parlor, index) => {
          const shouldHighlight = searchedColumn === 'parlors' &&
            parlor.parlor_name.toLowerCase().includes(searchText.toLowerCase());

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
      title: 'Должность',
      dataIndex: 'post',
      key: 'post',
      sorter: (a: any, b: any) => a?.post?.post_name?.localeCompare(b?.post?.post_name, 'ru'),
      render: (post: IPost) => post?.post_name // Or any other suitable React element
    },
    {
      title: "Действия",
      key: "action",
      render: (_: any, record: IEmployee) => (
        <Space size="middle">
          <Button type="dashed" onClick={() => onEdit(record.buyer_id as number)}>
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
          >
            Удалить
          </Button>
        </Space>
      ),
    },
  ];

  const dataSource = employeeData?.map((employee) => ({
    ...employee,
    key: employee.buyer_id, // Ensure each item has a unique key
  }));

  return <Table dataSource={dataSource} columns={columns} pagination={{locale:{items_per_page:"/ Сотрудников"} }}  />;
};

export default EmployeeTable;
