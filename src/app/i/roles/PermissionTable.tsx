import SearchFilter from "@/helper/TableFilters/Filters/SearchFilter";
import { useSearch } from "@/helper/TableFilters/hook/useSearch";
import {
  useCreatePermissionMutation,
  useDeletePermissionMutation,
  useGetPermission,
} from "@/hook/roleHook";
import { IPermission } from "@/interface/role";
import { SearchOutlined } from "@ant-design/icons";
import { Checkbox, Space, Table, TableColumnsType } from "antd";
import { useEffect, useMemo, useState } from "react";
import Highlighter from "react-highlight-words";

interface PermissionTableProps {
  permissionData: IPermission[]; // УЖЕ ПРИВЯЗАННЫЕ к роли
  roleId: number;
}

export default function PermissionTable({
  permissionData,
  roleId,
}: PermissionTableProps) {
  const { mutate: addPermission } = useCreatePermissionMutation();
  const { mutate: deletePermission } = useDeletePermissionMutation();
  const { permissionData: allPermissions, isLoading } = useGetPermission();

  const assignedPermissionIds = useMemo(() => {
    return new Set(permissionData.map((p) => p.permission_id));
  }, [permissionData]);

  const { searchText, searchedColumn, searchInput, handleSearch, handleReset } =
    useSearch();

  const handleCheckboxChange = (permissionId: number, checked: boolean) => {
    if (checked) {
      // Найдём полный объект permission из allPermissions (нужен для кеша)
      const permissionToAdd = allPermissions?.find(
        (p) => p.permission_id === permissionId
      );
      if (!permissionToAdd) return;

      addPermission({
        role_id: roleId,
        permission_id: permissionId,
      });
    } else {
      deletePermission({
        role_id: roleId,
        permission_id: permissionId,
      });
    }
  };

  const columns: TableColumnsType<IPermission> = [
    {
      title: "Действия",
      key: "action",
      width: "50px",
      render: (_: any, record: IPermission) => (
        <Space size="middle">
          <Checkbox
            checked={assignedPermissionIds.has(record.permission_id)}
            onChange={(e) =>
              handleCheckboxChange(
                record.permission_id as number,
                e.target.checked
              )
            }
          />
        </Space>
      ),
    },
    {
      title: "ID",
      width: "100px",
      dataIndex: "permission_id",
      key: "permission_id",
      sorter: (a, b) => Number(a.permission_id) - Number(b.permission_id),
    },
    {
      title: "Название",
      dataIndex: "permission_code",
      key: "permission_code",
      width: "250px",
      sorter: (a, b) =>
        (a.permission_code || "").localeCompare(b.permission_code || "", "ru"),
      filterDropdown: (props) => (
        <SearchFilter
          {...props}
          placeholder="Поиск по названию"
          searchText={searchText}
          searchedColumn={searchedColumn}
          dataIndex="permission_code"
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
        record.permission_code
          .toString()
          .toLowerCase()
          .includes((value as string).toLowerCase()),
      onFilterDropdownOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
      render: (text) => {
        const formattedID = text ? text.toString().replace(/^0+/, "") : "";
        return searchedColumn === "permission_code" ? (
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
      title: "Тип",
      dataIndex: "permission_type",
      key: "permission_type",
      width: "50px",
      filters: [
        { value: "api", text: "API" },
        { value: "ui", text: "UI" },
        { value: "unf", text: "UNF" },
      ],
      onFilter: (value, record) => record.permission_type === value,
    },
    {
      title: "Описание",
      dataIndex: "note",
      width: "250px",
      key: "note",
      sorter: (a, b) => (a.note || "").localeCompare(b.note || "", "ru"),
      filterDropdown: (props) => (
        <SearchFilter
          {...props}
          placeholder="Поиск по названию"
          searchText={searchText}
          searchedColumn={searchedColumn}
          dataIndex="note"
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
        (record.note as string)
          .toString()
          .toLowerCase()
          .includes((value as string).toLowerCase()),
      onFilterDropdownOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
      render: (text) => {
        const formattedID = text ? text.toString().replace(/^0+/, "") : "";
        return searchedColumn === "note" ? (
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
      title: "Дата создания",
      dataIndex: "created_at",
      key: "created_at",
      width: "100px",
      sorter: (a, b) =>
        (a.created_at || "").localeCompare(b.created_at || "", "ru"),
      render: (text: string) => {
        if (!text) return "-";
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
      title: "Дата обновления",
      dataIndex: "updated_at",
      key: "updated_at",
      width: "100px",
      sorter: (a, b) =>
        (a.updated_at || "").localeCompare(b.updated_at || "", "ru"),
      render: (text: string) => {
        if (!text) return "-";
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
  ];

  const dataSource = useMemo(() => {
    if (!allPermissions) return [];

    // Сначала сортируем: активные (назначенные) — в начало
    const sorted = [...allPermissions].sort((a, b) => {
      const aAssigned = assignedPermissionIds.has(a.permission_id) ? 1 : 0;
      const bAssigned = assignedPermissionIds.has(b.permission_id) ? 1 : 0;

      // Сортируем по убыванию: 1 (назначено) > 0 (не назначено)
      return bAssigned - aAssigned;
    });

    return sorted.map((permission) => ({
      ...permission,
      key: permission.permission_id,
    }));
  }, [allPermissions, assignedPermissionIds]); // ⚠️ важно добавить assignedPermissionIds в зависимости

  const [currentFiltersCount, setCurrentFiltersCount] = useState(0);

  useEffect(() => {
    if (dataSource) {
      setCurrentFiltersCount(dataSource.length);
    }
  }, [dataSource]);

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      loading={isLoading}
      pagination={{ locale: { items_per_page: "/ Ограничений" } }}
      scroll={{ x: 200 }}
      footer={() => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p>Ограничений: {currentFiltersCount}</p>
        </div>
      )}
      onChange={(_, __, ___, extra) => {
        setCurrentFiltersCount(extra.currentDataSource.length);
      }}
    />
  );
}
