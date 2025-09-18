import Highlighter from "react-highlight-words";
import { InputRef, TableColumnsType } from "antd";
import { IProductUnit, IProductGroup } from "@/interface/product";
import { IUnit } from "@/interface/unit";
import { filterBySearchText } from "@/helper/TableFilters/Filters/filterBySearchText";
import SearchFilter from "@/helper/TableFilters/Filters/SearchFilter";
import { SearchOutlined } from "@ant-design/icons";
import { RefObject } from "react";
import { FilterConfirmProps } from "antd/es/table/interface";

interface Params {
  filteredInfo: any;
  sortedInfo: any;
  data: IProductUnit[];
  searchText: string;
  searchedColumn: string;
  searchInput: RefObject<InputRef>;
  handleSearch: (selectedKeys: string[], confirm: (param?: FilterConfirmProps | undefined) => void, dataIndex: string) => void;
  handleReset: (clearFilters: () => void) => void;
}

export function getProductTableColumns({
  filteredInfo,
  sortedInfo,
  data,
  handleReset,
  handleSearch,
  searchInput,
  searchText,
  searchedColumn,
}: Params): TableColumnsType<IProductUnit> {


  return [
    {
      title: "Товар",
      dataIndex: "product_name",
      key: "product_name",
      width: "400px",
      sorter: (a, b) => a.product_name.localeCompare(b.product_name, "ru"),
      filterDropdown: (props) => (
        <SearchFilter
          {...props}
          placeholder="Поиск по товару"
          searchText={searchText}
          searchedColumn={searchedColumn}
          dataIndex="product_name"
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
      // onFilter: (value, record) =>
      //   filterBySearchText(
      //     (value as string).toLowerCase(),
      //     record.product_name.toLowerCase()
      //   ),
      render: (text) =>
        searchedColumn === "product_name" ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069" }}
            searchWords={
              searchText
                ? searchText
                    .trim()
                    .toLowerCase()
                    .split(/\s+/)
                    .filter(Boolean)
                : []
            }
            autoEscape
            textToHighlight={text ?? ""}
          />
        ) : (
          text
        ),
      filteredValue: filteredInfo.product_name || null,
      sortOrder:
        sortedInfo.columnKey === "product_name" ? sortedInfo.order : null,
    },
    {
      title: "Категория",
      dataIndex: "product_group",
      key: "product_group",
      width: "150px",
      sorter: (a, b) =>
        a.product_group.product_group_name.localeCompare(
          b.product_group.product_group_name,
          "ru"
        ),
      render: (g: IProductGroup) => g.product_group_name,
      filters: Array.from(
        new Set(data.map((p) => p.product_group.product_group_name))
      ).map((name) => ({ text: name, value: name })),
      onFilter: (value, record) =>
        record.product_group.product_group_name === value,
      filteredValue: filteredInfo.product_group || null,
      sortOrder:
        sortedInfo.columnKey === "product_group" ? sortedInfo.order : null,
    },
    {
      title: "Артикул",
      dataIndex: "product_article",
      key: "product_article",
      width: "150px",
      sorter: (a, b) =>
        (a.product_article ?? "").localeCompare(b.product_article ?? "", "ru"),
      sortOrder:
        sortedInfo.columnKey === "product_article" ? sortedInfo.order : null,
      filterDropdown: (props) => (
        <SearchFilter
          {...props}
          placeholder="Поиск по товару"
          searchText={searchText}
          searchedColumn={searchedColumn}
          dataIndex="product_article"
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
        filterBySearchText(
          (value as string).toLowerCase(),
          (record.product_article ?? "").toLowerCase()
        ),
      render: (text) =>
        searchedColumn === "product_article" ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069" }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ?? ""}
          />
        ) : (
          text
        ),
      filteredValue: filteredInfo.product_article || null,
    },
    {
      title: "Ед.",
      dataIndex: "directory_unit_measurement",
      key: "directory_unit_measurement",
      width: "50px",
      sorter: (a, b) => {
        const unitA =
          a.directory_unit_measurement?.[0]?.unit_measurement
            ?.unit_measurement_name ?? "";
        const unitB =
          b.directory_unit_measurement?.[0]?.unit_measurement
            ?.unit_measurement_name ?? "";
        return unitA.localeCompare(unitB, "ru");
      },
      render: (units: IUnit[]) =>
        units?.[0]?.unit_measurement.unit_measurement_name,
      sortOrder:
        sortedInfo.columnKey === "directory_unit_measurement"
          ? sortedInfo.order
          : null,
    },
    {
      title: "Остаток",
      key: "remainder",
      dataIndex: "remainder",
      width: "50px",
      sorter: (a, b) => (a.remainder ?? 0) - (b.remainder ?? 0),
      sortOrder: sortedInfo.columnKey === "remainder" ? sortedInfo.order : null,
    },
  ];
}
