"use client";

import { Menu, MenuProps } from "antd";
import { useEffect, useRef } from "react";

interface ContextMenuProps {
  x: number;
  y: number;
  visible: boolean;
  onClose: () => void;
  onCopy: () => void;
}

const ContextMenu = ({ x, y, visible, onClose, onCopy }: ContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [onClose]);

  const items: MenuProps["items"] = [
    {
      key: "copy",
      label: "Создать копию",
      onClick: () => {
        onCopy();
        onClose();
      },
    },
  ];

  if (!visible) return null;

  return (
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        left: x,
        top: y,
        zIndex: 1000,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      <Menu items={items} style={{ minWidth: 120 }} />
    </div>
  );
};

export default ContextMenu;