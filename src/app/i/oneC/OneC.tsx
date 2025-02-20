'use client'
import { useUpdateAndUploadProduct1c } from "@/hook/oneCHook";
import { Button } from "antd";
import React from "react";

export default function OneC() {
  const { mutate, isPending } = useUpdateAndUploadProduct1c();

  return (
    <Button onClick={() => mutate()}>
      {isPending ? "Обновление..." : "Обновить товары"}
    </Button>
  );
}
