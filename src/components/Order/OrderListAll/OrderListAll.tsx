"use client";
import React, { useState, useMemo, useEffect } from "react";
import OrderListTable from "./OrderListAllTable";
import {
  useOrdersData,
  useOrdersWhereUserIsApproverData,
} from "@/hook/orderHook";
import style from "./OrderList.module.scss";
import { Toaster } from "sonner";
import { DatePicker, Radio, Select, Switch } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { useProductData } from "@/hook/productHook";
import { debounce } from "@/helper/debounce";
import OrderCardWrapper from "@/components/OrderCard/OrderCardWrapper";
import Can from "@/components/Can/Can";
dayjs.locale("ru_RU");

const { RangePicker } = DatePicker;

export default function OrderListAll() {
  const [isAllOrder, setIsAllOrder] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<
    [moment.Moment, moment.Moment] | null
  >(null);
  const [orderDateType, setOrderDateType] = useState<
    "created_at" | "updated_at"
  >("created_at");
  const [productIds, setProductIds] = useState<string[]>([]);

  // создаём debounced-функцию
  const [searchValue, setSearchValue] = useState("");

  const debouncedSearch = useMemo(
    () =>
      debounce((val: string) => {
        setSearchValue(val.toLowerCase());
      }, 300),
    []
  );

  const { productData } = useProductData();

  const {
    ordersData: ordersDataIsApprover,
    isLoading: isLoadingIsApprover,
    refetch: refetchIsApprover,
  } = useOrdersWhereUserIsApproverData();
  const {
    ordersData: ordersDataIsAll,
    isLoading: isLoadingIsAll,
    refetch: refetchIsAll,
  } = useOrdersData(productIds);

  useEffect(() => {
    refetchIsAll();
  }, [productIds]);

  // --- Определяем текущие данные (с учётом isAllOrder и самих данных) ---
  const currentOrdersData = isAllOrder ? ordersDataIsAll : ordersDataIsApprover;
  const currentIsLoading = isAllOrder ? isLoadingIsAll : isLoadingIsApprover;
  const currentRefetch = isAllOrder ? refetchIsAll : refetchIsApprover;

  // --- Обработчик фильтрации ---
  const handleFilter = (dates: [moment.Moment, moment.Moment] | null) => {
    setDateRange(dates);
  };

  // --- Фильтрация по дате ---
  const filteredOrderData = useMemo(() => {
    // Если данных нет — возвращаем пустой массив
    if (!currentOrdersData) return [];

    if (!dateRange) return currentOrdersData;

    const [start, end] = dateRange;
    const startDate = start.startOf("day");
    const endDate = end.endOf("day");

    return currentOrdersData.filter((order) => {
      // const orderDate = moment(order.created_at).startOf("day");
      const orderDate =
        orderDateType === "created_at"
          ? moment(order.created_at).startOf("day")
          : moment(order.updated_at).startOf("day");
      return (
        orderDate.isSameOrAfter(startDate.format("YYYY-MM-DD")) &&
        orderDate.isSameOrBefore(endDate.format("YYYY-MM-DD"))
      );
    });
  }, [currentOrdersData, dateRange, orderDateType, productIds]);

  useEffect(() => {
    setDateRange(null);
  }, [orderDateType]);

  useEffect(() => {
    if (isAllOrder) {
      refetchIsAll();
    } else {
      refetchIsApprover();
    }
    setProductIds([]);
  }, [isAllOrder, refetchIsAll, refetchIsApprover]);

  return (
    <div className={style.orderList}>
      <Toaster />
      {isAllOrder && (
        <Select
          mode="multiple"
          onChange={(e) => setProductIds(e)}
          value={productIds}
          placeholder="Выберите товары для фильтрации заявок"
          showSearch
          onSearch={debouncedSearch}
          filterOption={false}
        >
          {productData
            ?.filter((product) =>
              product.product_name.toLowerCase().includes(searchValue)
            )
            .map((product) => (
              <Select.Option
                key={product.product_id}
                value={product.product_id}
                label={product.product_name}
              >
                {product.product_name}
              </Select.Option>
            ))}
        </Select>
      )}

      <RangePicker
        //@ts-ignore
        value={dateRange}
        //@ts-ignore
        onChange={handleFilter}
        format="DD.MM.YYYY"
      />
      <Radio.Group defaultValue={orderDateType}>
        <Radio
          value="created_at"
          onChange={() => setOrderDateType("created_at")}
        >
          Дата создания
        </Radio>
        <Radio
          value="updated_at"
          onChange={() => setOrderDateType("updated_at")}
        >
          Дата обновления
        </Radio>
      </Radio.Group>
      <div className={style.orderListTable}>
        <OrderListTable
          OrderData={filteredOrderData}
          loading={currentIsLoading}
          refetch={currentRefetch}
          isAllOrder={isAllOrder}
          setIsAllOrder={setIsAllOrder}
        />
      </div>

      <div className={style.orderCards}>
        <Can permission="approver_all_orders_switch">
        <Switch
          checkedChildren={"Все заявки"}
          unCheckedChildren={"Я Согласователь"}
          title={isAllOrder ? "Все заявки" : "Я Согласователь"}
          onChange={(e) => {
            setIsAllOrder(e);
          }}
        />
        </Can>
        <OrderCardWrapper
          OrderData={filteredOrderData}
          loading={currentIsLoading}
          refetch={currentRefetch}
          isDraft={false}
        />
      </div>
    </div>
  );
}
