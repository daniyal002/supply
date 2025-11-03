"use client";

import { Button, Select } from "antd";
import { Toaster } from "sonner";
import RouteTable from "./RouteTable";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useOrderRouteData } from "@/hook/orderRouterHook";
import { BookFilled, PlusOutlined } from "@ant-design/icons";
import { useEmployeeData } from "@/hook/employeeHook";
import { debounce } from "@/helper/debounce";

export default function AdminRoute() {
  const [employeeId, setEmployeeId] = useState<string>("");

  const { orderRouteData, refetch } = useOrderRouteData(String(employeeId));
  const { employeeData } = useEmployeeData();

  // создаём debounced-функцию
  const [searchValue, setSearchValue] = useState("");

  const debouncedSearch = useMemo(
    () =>
      debounce((val: string) => {
        setSearchValue(val.toLowerCase());
      }, 300),
    []
  );

  useEffect(() => {
    refetch();
  }, [employeeId]);

  const [type, setType] = useState<"Добавить" | "Изменить">("Добавить");
  const [postId, setPostId] = useState<number>();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isArchive, setIsArchive] = useState<boolean>(false);

  const onAdd = () => {
    setPostId(undefined);
    setType("Добавить");
    setIsModalOpen(true);
  };

  const onEdit = (id: number) => {
    setPostId(id);
    setType("Изменить");
    setIsModalOpen(true);
  };

  return (
    <div>
      <Toaster />
      <div style={{ display: "flex", gap: "10px" }}>
        <Link href="routes/newRoute">
          {" "}
          <Button
            type="primary"
            shape="circle"
            icon={<PlusOutlined />}
            onClick={onAdd}
            style={{ marginBottom: "10px" }}
            title="Добавить"
          />
        </Link>
        <Button
          type="primary"
          shape="circle"
          icon={<BookFilled />}
          onClick={() => setIsArchive(!isArchive)}
          style={{
            marginBottom: "10px",
            color: isArchive ? "" : "#fff",
            backgroundColor: isArchive ? "" : "gray",
          }}
          title={isArchive ? "Не архивные" : "Архивные"}
        />
      </div>
      <div>
        <label>Фильтр по сотрудникам</label>

        <Select
          onChange={(value) => {
            // Когда пользователь нажимает "очистить" (крестик), value === undefined
            setEmployeeId(value ?? ""); // преобразуем undefined → ""
          }}
          value={employeeId}
          placeholder="Выберите товары для фильтрации заявок"
          showSearch
          onSearch={debouncedSearch}
          filterOption={false}
          style={{ width: "100%" }}
          allowClear
        >
          {employeeData
            ?.filter((employee) =>
              employee.buyer_name.toLowerCase().includes(searchValue)
            )
            .map((employee) => (
              <Select.Option
                key={employee.buyer_id}
                value={employee.buyer_id}
                label={employee.buyer_name}
              >
                {employee.buyer_name}
              </Select.Option>
            ))}
        </Select>
      </div>

      <RouteTable
        routeData={orderRouteData}
        onEdit={onEdit}
        isArchive={isArchive}
        refetch={refetch}
      />
    </div>
  );
}
