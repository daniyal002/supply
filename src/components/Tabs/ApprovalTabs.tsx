"use client";

import React, { useEffect, useRef, useState } from "react";
import {Tabs } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import { useApprovalStore } from "../../../store/approvalStore";
import ApprovalOrder from "@/app/approval/[slug]/ApprovalOrder";
import { useTabStore } from "../../../store/tabStore";

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

export default function ApprovalTabs() {
  const { tabsApproval, addTabApproval, removeTabApproval, setTabsApproval, activeTabApproval, setActiveTabApproval } = useTabStore();
  const approvalOrderId = useApprovalStore((state) => state.approvalOrderId);
  const setApprovalOrderId = useApprovalStore(
    (state) => state.setApprovalOrderId
  );
  const queryClient = useQueryClient();

  const edit = (orderid: string) => {
    const newActiveKey = `order-${orderid}`;
    const existingPane = tabsApproval.find((pane) => pane.key === newActiveKey);

    if (!existingPane) {
      const newTab = {
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
        closable:true
      };
      addTabApproval(newTab); // Добавляем вкладку в глобальное состояние
    }else{
      setActiveKey(newActiveKey)
    }

    setActiveKey(newActiveKey);
  };

  useEffect(() => {
    setTabsApproval(tabsApproval); // Синхронизируем вкладки при монтировании
  }, [tabsApproval]);


  useEffect(() => {
    if (approvalOrderId !== "0" && approvalOrderId) {
      edit(approvalOrderId);
    }
    setApprovalOrderId("0")
  }, [approvalOrderId]);

  const [activeKey, setActiveKey] = useState(tabsApproval[0].key);
  const newTabIndex = useRef(1);

  useEffect(() => {
    const id = activeKey.startsWith("order-")
      ? activeKey.split("order-")[1]
      : null;
    if (id) {
      queryClient.invalidateQueries({ queryKey: ["getOrderById", id] });
    }
  }, [activeKey]);

  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
    setActiveTabApproval(newActiveKey)
  };


  const remove = (targetKey: TargetKey) => {
    let newActiveKey = activeKey;
    let lastIndex = -1;

    // Находим индекс удаляемой вкладки
    tabsApproval.forEach((item, i) => {
        if (item.key === targetKey) {
            lastIndex = i - 1; // Запоминаем индекс предыдущей вкладки
        }
    });

    // Удаляем вкладку из Zustand store
    removeTabApproval(targetKey as string);

    // Обновляем активный ключ
    const newPanes = tabsApproval.filter((item) => item.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
        if (lastIndex >= 0) {
            newActiveKey = newPanes[lastIndex].key; // Устанавливаем предыдущую вкладку как активную
        } else {
            newActiveKey = newPanes[0].key; // Устанавливаем первую вкладку как активную
        }
    }

    setActiveKey(newActiveKey); // Обновляем активный ключ
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
      <Tabs
        hideAdd
        type="editable-card"
        onChange={onChange}
        activeKey={activeKey}
        onEdit={onEdit}
        items={tabsApproval} // Используем вкладки из глобального состояния
        style={{ padding: "0 10px" }}
        destroyInactiveTabPane={false}
        defaultActiveKey={activeTabApproval}
        animated
      />
  );
}
