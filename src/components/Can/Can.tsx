import { db } from "@/db/db";
import { useLiveQuery } from "dexie-react-hooks";
import React from "react";
import { IPermission } from "@/interface/role"; // Убедись, что путь верный

interface Props {
  permission: string; // Например: "ui_settings" или "api_user_create"
  children: React.ReactNode;
}

export default function Can({ permission, children }: Props) {
  const GetMeData = useLiveQuery(() => db.getMe.toCollection().first(), []);

  // Получаем массив permission-объектов (IPermission[])
  const permissions: IPermission[] = GetMeData?.role?.permissions || [];

  // Проверяем, есть ли среди них permission с нужным кодом
  const hasPermission = permissions.some(
    (p: IPermission) => p.permission_code === permission
  );

  return hasPermission ? <>{children}</> : null;
}