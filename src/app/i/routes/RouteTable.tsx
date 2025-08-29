"use client";

import { Button, Space, Table, TableColumnsType } from "antd";
import { toast } from "sonner";
import { IOrderRouteResponseDetail } from "@/interface/orderRoute";
import { IDepartment } from "@/interface/department";
import {
  useArchiveOrderRouteMutation,
  useDeleteOrderRouteMutation,
} from "@/hook/orderRouterHook";
import Link from "next/link";
import SearchFilter from "@/helper/TableFilters/Filters/SearchFilter";
import { useSearch } from "@/helper/TableFilters/hook/useSearch";
import { SearchOutlined } from "@ant-design/icons";
import { filterBySearchText } from "@/helper/TableFilters/Filters/filterBySearchText";
import { Key, useMemo } from "react";
import Highlighter from "react-highlight-words";
import { EnumOrderTypes } from "@/interface/orderItem";

interface RouteTableProps {
  routeData: IOrderRouteResponseDetail[] | undefined;
  onEdit: (id: number) => void;
  isArchive: boolean;
}

const RouteTable: React.FC<RouteTableProps> = ({ routeData, isArchive }) => {
  const { mutate: deleteOrderRouteMutation } = useDeleteOrderRouteMutation();
  const { mutate: archiveOrderRouteMutation } = useArchiveOrderRouteMutation();
  const { searchText, searchedColumn, searchInput, handleSearch, handleReset } =
    useSearch();

  const columns: TableColumnsType<IOrderRouteResponseDetail> = [
    {
      title: "ID",
      dataIndex: "route_id",
      key: "route_id",
      sorter: (a: IOrderRouteResponseDetail, b: IOrderRouteResponseDetail) =>
        Number(a?.route_id) - Number(b?.route_id),
      showSorterTooltip: { title: "Сортировка по ID" },
      defaultSortOrder: "descend",
      filterDropdown: (props) => (
        <SearchFilter
          {...props}
          placeholder="Поиск по ID"
          searchText={searchText}
          searchedColumn={searchedColumn}
          dataIndex="route_id"
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
      (record.route_id as number)
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
        return searchedColumn === "route_id" ? (
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
      title: "Маршрут",
      dataIndex: "route_name",
      key: "route_name",
      sorter: (a: IOrderRouteResponseDetail, b: IOrderRouteResponseDetail) =>
        a.route_name.localeCompare(b.route_name, "ru"),
      showSorterTooltip: { title: "Сортировка по маршрутам" },
      filterDropdown: (props: any) => (
        <SearchFilter
          {...props}
          placeholder="Поиск по маршруту"
          searchText={searchText}
          searchedColumn={searchedColumn}
          dataIndex="route_name"
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
      onFilter: (value: boolean | Key, record: IOrderRouteResponseDetail) => {
        const searchValue = (value as string).toLowerCase();
        const route_name = record.route_name.toString().toLowerCase();

        return filterBySearchText(searchValue, route_name);
      },
      render: (text: string) =>
        searchedColumn === "route_name" ? (
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
      title: "Подразделение",
      dataIndex: "department",
      key: "department",
      sorter: (a: any, b: any) =>
        a.department?.department_name.localeCompare(
          b.department?.department_name,
          "ru"
        ),
      showSorterTooltip: { title: "Сортировка по подразделению" },
      render: (department: IDepartment) => department?.department_name,
      filters: useMemo(() => {
        if (!routeData) return [];

        const uniqueDepartments = Array.from(
          new Map(
            routeData
              .filter((r) => r.department && r.department.department_id) // Фильтруем сразу по наличию department_id
              .map((route) => [
                route.department!.department_id,
                {
                  text: route.department!.department_name,
                  value: route.department!.department_id as number, // Явно приводим к number
                },
              ])
          ).values()
        );

        return uniqueDepartments.sort((a, b) =>
          a.text.localeCompare(b.text, "ru")
        );
      }, [routeData]),
      onFilter: (value, record) => record.department?.department_id === value,
      filterMode:'menu',
      filterSearch:true
    },
    {
      title: "Тип маршрута",
      dataIndex: "order_route_type",
      key: "order_route_type",
      render: (order_route_type: string) =>
        order_route_type === EnumOrderTypes.WAREHOUSE
          ? "Маршут на склад"
          : "Маршрут на закуп",
      filters: [
        {
          text: "Маршут на склад",
          value: EnumOrderTypes.WAREHOUSE,
        },
        {
          text: "Маршрут на закуп",
          value: EnumOrderTypes.PURCHASE,
        },
      ],
      onFilter: (value, record) => record.order_route_type === value,
    },
    {
      title: "Действия",
      key: "action",
      render: (_: any, record: IOrderRouteResponseDetail) => (
        <Space size="middle">
          <Link href={`/i/routes/${record.route_id}`} title="Изменить">
            Изменить
          </Link>
          <Button
            type="primary"
            danger
            onClick={() =>
              toast.error("Вы точно хотите удалить маршрут ?", {
                style: {
                  color: "red",
                },
                action: {
                  label: "Удалить",
                  onClick: () =>
                    deleteOrderRouteMutation({
                      route_id: record.route_id as number,
                      route_name: record.route_name,
                    }),
                },
              })
            }
            title="Удалить"
          >
            Удалить
          </Button>
          <Button
            onClick={() =>
              archiveOrderRouteMutation({ route_id: record.route_id as number })
            }
          >
            {record.is_archive ? "Разархивировать" : "Архивировать"}
          </Button>
          <Link href={`/i/routes/copy-${record.route_id}`}>Копия</Link>
        </Space>
      ),
    },
  ];

  const dataSource = routeData
    ?.map((route) => ({
      ...route,
      key: route.route_id, // Ensure each item has a unique key
    }))
    .filter((route) => route.is_archive === isArchive);
  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      pagination={{ locale: { items_per_page: "/ Маршрутов" } }}
      scroll={{ x: 200 }}
    />
  );
};

export default RouteTable;
