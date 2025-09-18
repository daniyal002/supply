import Highlighter from "react-highlight-words";
import { Button, InputRef, Space, TableColumnsType } from "antd";
import { IProductUnit, IProductGroup } from "@/interface/product";
import { IUnit } from "@/interface/unit";
import SearchFilter from "@/helper/TableFilters/Filters/SearchFilter";
import { SearchOutlined } from "@ant-design/icons";
import SearchFilteredIcon from "../UI/FilteredIcon/SearchFilteredIcon";
import { RefObject, SetStateAction } from "react";
import { FilterConfirmProps } from "antd/es/table/interface";

interface Params {
  filteredInfo: any;
  sortedInfo: any;
  data: IProductUnit[];
  showModal: () => void;
  setProductId: (product: number) => void;
  visibleColumnKey: string | null;
  setVisibleColumnKey: (key: SetStateAction<string | null>) => void;
  searchText: string;
  searchedColumn: string;
  searchInput: RefObject<InputRef>;
  handleSearch: (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps | undefined) => void,
    dataIndex: string
  ) => void;
  handleReset: (clearFilters: () => void) => void;
}

export function getSelectProductTableColumns({
  filteredInfo,
  sortedInfo,
  data,
  setProductId,
  showModal,
  visibleColumnKey,
  setVisibleColumnKey,
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
      filterDropdownOpen: visibleColumnKey === "product_name",
      onFilterDropdownOpenChange: (visible) => {
        if (!visible) setVisibleColumnKey(null);
      },
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
        <SearchFilteredIcon
          filtered={filtered}
          setVisibleColumnKey={setVisibleColumnKey}
          visibleColumnKey="product_name"
        />
      ),

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
      filteredValue: filteredInfo.product_group || null,
      sortOrder:
        sortedInfo.columnKey === "product_group" ? sortedInfo.order : null,
    },
    {
      title: "Артикул",
      dataIndex: "product_article",
      key: "product_article",
      width: "150px",
      showSorterTooltip: { title: "Сортировка по артикулу" },
      sorter: (a, b) =>
        a?.product_article?.localeCompare(b?.product_article ?? "", "ru") ?? 0,
      responsive: ["sm"],
      filterDropdown: (props) => (
        <SearchFilter
          {...props}
          placeholder="Поиск по артиклу"
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
      render: (text) =>
        searchedColumn === "product_article" ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : (
          text
        ),
      filteredValue: filteredInfo.product_article || null,
      sortOrder:
        sortedInfo.columnKey === "product_article" ? sortedInfo.order : null,
    },
    {
      title: "Ед. измерения",
      dataIndex: "directory_unit_measurement",
      key: "directory_unit_measurement",
      width: "50px",
      showSorterTooltip: { title: "Сортировка по ед. измерения" },
      sorter: (a, b) => {
        if (!a || !b) return 0;

        const getMainUnit = (product: IProductUnit) => {
          const units = product.directory_unit_measurement;
          if (!units?.length) return null;
          return units.find((u) => u.coefficient > 1) || units[0];
        };

        const unitA = getMainUnit(a);
        const unitB = getMainUnit(b);

        if (!unitA && !unitB) return 0;
        if (!unitA) return -1;
        if (!unitB) return 1;

        return unitA.unit_measurement.unit_measurement_name.localeCompare(
          unitB.unit_measurement.unit_measurement_name,
          "ru"
        );
      },
      render: (directory_unit_measurement: IUnit[]) => {
        const mainUnit =
          directory_unit_measurement.find((unit) => unit.coefficient > 1) ||
          directory_unit_measurement[0];
        return mainUnit?.unit_measurement.unit_measurement_name;
      },
      responsive: ["sm"],
      filters: Array.from(
        new Map(
          data
            .flatMap((p) => p.directory_unit_measurement || [])
            .filter((u) => u.unit_measurement.unit_measurement_id !== undefined) // <-- убираем undefined
            .map((u) => [
              u.unit_measurement.unit_measurement_id,
              u.unit_measurement,
            ])
        ).values()
      ).map((unit) => ({
        text: unit.unit_measurement_name,
        value: unit.unit_measurement_id as number, // теперь гарантированно number
      })),
      filterSearch: true,
      filteredValue: filteredInfo.directory_unit_measurement || null,
      sortOrder:
        sortedInfo.columnKey === "directory_unit_measurement"
          ? sortedInfo.order
          : null,
    },
    {
      title: "Общий остаток",
      key: "remainder",
      dataIndex: "remainder",
      width: "50px",
      showSorterTooltip: { title: "Действия" },
      sorter: {
        compare: (a: any, b: any) => a.remainder - b.remainder,
      },
      sortOrder: sortedInfo.columnKey === "remainder" ? sortedInfo.order : null,
    },
    {
      title: "Действия",
      key: "action",
      width: "100px",
      showSorterTooltip: { title: "Действия" },
      render: (_: any, record: IProductUnit) => (
        <Space size="middle">
          <Button
            onClick={() => {
              showModal();
              setProductId(record.product_id);
            }}
            // disabled={
            //   record.product_group.product_group_id !==
            //   getValues("product_group.value")
            // }
            title="Добавить"
          >
            Добавить
          </Button>
        </Space>
      ),
    },
  ];
}
