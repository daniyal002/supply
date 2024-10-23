"use client";

import React, { useEffect, useRef, useState } from "react";
import { ConfigProvider, Tabs } from "antd";
import Order from "@/app/order/[slug]/Order";
import { useQueryClient } from "@tanstack/react-query";
import { useApprovalStore } from "../../../store/approvalStore";
import ApprovalList from "../Approval/ApprovalList/ApprovalList";
import ApprovalOrder from "@/app/approval/[slug]/ApprovalOrder";

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

export default function ApprovalTabs() {
  const approvalOrderId = useApprovalStore((state) => state.approvalOrderId);
  const setApprovalOrderId = useApprovalStore(
    (state) => state.setApprovalOrderId
  );
  const queryClient = useQueryClient();

  const edit = (orderid: string) => {
    const newActiveKey = `order-${orderid}`;
    const newPanes = [...items];
    const existingPane = newPanes.find((pane) => pane.key === newActiveKey);

    if (!existingPane) {
      newPanes.push({
        label: `Заявка №${orderid}`,
        children: (
          <ApprovalOrder
            type="Изменить"
            orderid={orderid}
            remove={remove}
            targetKey={newActiveKey}
          />
        ),
        key: newActiveKey,
        closable: true,
      });
    }

    setItems(newPanes);
    setActiveKey(newActiveKey);
  };

  const initialItems = [
    {
      label: "Заявки на согласовании",
      children: <ApprovalList />,
      key: "1",
      closable: false,
    },
  ];

  useEffect(() => {
    if (approvalOrderId !== "0" && approvalOrderId) {
      edit(approvalOrderId);
    }
  }, [approvalOrderId]);

  const [activeKey, setActiveKey] = useState(initialItems[0].key);
  const [items, setItems] = useState(initialItems);
  const newTabIndex = useRef(1);

  useEffect(() => {
    const id = activeKey.startsWith("order-")
      ? activeKey.split("order-")[1]
      : null;
    if (id) {
      queryClient.invalidateQueries({ queryKey: ["getOrderById", id] });
      console.log(id);
    }
  }, [activeKey]);

  const onChange = (newActiveKey: string) => {
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
    setApprovalOrderId("0");
  };

  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: "add" | "remove"
  ) => {
    if (action === "remove") {
      remove(targetKey);
    }
  };

  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#678098" } }}>
      <Tabs
        hideAdd
        type="editable-card"
        onChange={onChange}
        activeKey={activeKey}
        onEdit={onEdit}
        items={items}
        style={{ padding: "0 10px" }}
      />
    </ConfigProvider>
  );
}
