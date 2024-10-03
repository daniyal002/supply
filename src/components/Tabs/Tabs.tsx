"use client";

import React, { useEffect, useRef, useState } from "react";
import OrderList from "../Order/OrderList/OrderList";
import { ConfigProvider, Tabs } from "antd";
import Order from "@/app/order/[slug]/Order";
import { useOrderIdStore } from "../../../store/orderIdStore";
import { useQueryClient } from "@tanstack/react-query";

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

export default function Tab() {
  const orderId = useOrderIdStore(state => state.orderId);
  const draftOrderId = useOrderIdStore(state => state.draftOrderId);
  const setOrderId = useOrderIdStore(state => state.setOrderId);
  const setDraftOrderId = useOrderIdStore(state => state.setDraftOrderId);
  const queryClient = useQueryClient();

  const edit = (orderid: string) => {
    const newActiveKey = `order-${orderid}`;
    const newPanes = [...items];
    const existingPane = newPanes.find(pane => pane.key === newActiveKey);

    if (!existingPane) {
      newPanes.push({
        label: `Заявка №${orderid}`,
        children: <Order type="Изменить" orderid={orderid} remove={remove} targetKey={newActiveKey} />,
        key: newActiveKey,
        closable: true,
      });
    }

    setItems(newPanes);
    setActiveKey(newActiveKey);
  };

  const editDraft = (orderid: string) => {
    const newActiveKey = `draft`;
    const newPanes = [...items];
    const existingPane = newPanes.find(pane => pane.key === newActiveKey);

    if (!existingPane) {
      newPanes.push({
        label: `Черновик`,
        children: <Order type="Добавить" orderid={orderid} remove={remove} targetKey={newActiveKey} />,
        key: newActiveKey,
        closable: true,
      });
    }

    setItems(newPanes);
    setActiveKey(newActiveKey);
  };
  const initialItems = [
    {
      label: "Главная",
      children: <OrderList />,
      key: "1",
      closable: false,
    },
  ];

  useEffect(() => {
    if (orderId !== "0" && orderId) {
      edit(orderId);
    }
  }, [orderId]);

  useEffect(() => {
    if (draftOrderId !== "0" && draftOrderId) {
      editDraft(draftOrderId);
    }
  }, [draftOrderId]);

  const [activeKey, setActiveKey] = useState(initialItems[0].key);
  const [items, setItems] = useState(initialItems);
  const newTabIndex = useRef(1);

  useEffect(() => {
    const id = activeKey.startsWith('order-') ? activeKey.split('order-')[1] : null;
    if (id) {
      queryClient.invalidateQueries({ queryKey: ['getOrderById',id]});
      console.log(id);

    }
  }, [activeKey]);


  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
  };

  const add = () => {
    const newActiveKey = `newTab`;
    const newPanes = [...items];
    const existingPane = newPanes.find(pane => pane.key === newActiveKey);
    if (!existingPane) {
    newPanes.push({
      label: "Новая заявка",
      children: <Order type="Добавить" orderid="newOrder" remove={remove} targetKey={newActiveKey} />,
      key: newActiveKey,
      closable: true,
    });
  }
    setItems(newPanes);
    setActiveKey(newActiveKey);
  };

  const remove = (targetKey: TargetKey) => {
    let newActiveKey = activeKey;
    let lastIndex = -1;
    items.forEach((item, i) => {
      if (item.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = items.filter((item) => item.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    setItems(newPanes);
    setActiveKey(newActiveKey);
    setOrderId("0");
    setDraftOrderId("0")
  };

  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: "add" | "remove"
  ) => {
    if (action === "add") {
      add();
    } else {
      remove(targetKey);
    }
  };

  return (
    <ConfigProvider theme={{token:{colorPrimary:"#678098"}}}>
      <Tabs
        type="editable-card"
        onChange={onChange}
        activeKey={activeKey}
        onEdit={onEdit}
        items={items}
        style={{padding:"0 10px"}}
      />
    </ConfigProvider>

  );
}