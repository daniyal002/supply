"use client";

import { Drawer, Tree, Button } from "antd";
import {
  ClearOutlined,
  FolderOutlined,
  FolderOpenOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { IProductUnit } from "@/interface/product";

interface Props {
  folderTree: any[];
  productData: IProductUnit[];
  selectedFolderKeys: string[];
  setSelectedFolderKeys: (keys: string[]) => void;
  drawerVisible: boolean;
  setDrawerVisible: (v: boolean) => void;
}

export const ProductFolderSidebar: React.FC<Props> = ({
  folderTree,
  productData,
  selectedFolderKeys,
  setSelectedFolderKeys,
  drawerVisible,
  setDrawerVisible,
}) => {
  const addIcons = (nodes: any[]): any[] =>
    nodes.map((node) => ({
      ...node,
      icon: ({ expanded }: any) =>
        node.key === "no-parent" ? (
          <ClearOutlined style={{ color: "#ff4d4f" }} />
        ) : expanded ? (
          <FolderOpenOutlined style={{ color: "#1890ff" }} />
        ) : (
          <FolderOutlined style={{ color: "#1890ff" }} />
        ),
      children: node.children ? addIcons(node.children) : [],
    }));

  return (
    <>
      <Button
        onClick={() => setDrawerVisible(true)}
        icon={<FolderOutlined />}
        style={{ marginBottom: 10, width: "100%" }}
        type="primary"
      >
        Папки
      </Button>

      <Drawer
        title="Выберите папки"
        placement="bottom"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={window.innerWidth < 768 ? "100%" : 320}
      >
        <Tree
          treeData={addIcons(folderTree)}
          checkable
          checkStrictly
          selectable={false}
          checkedKeys={selectedFolderKeys}
          onCheck={(checkedInfo) => {
            const checked = Array.isArray(checkedInfo)
              ? checkedInfo
              : checkedInfo.checked;

            let newChecked: string[] = checked.map((k) => k.toString());

            const parentMap: Record<string, string[]> = {};
            productData.forEach((item) => {
              if (item.is_group && item.product_kod_1c_parent) {
                if (!parentMap[item.product_kod_1c_parent])
                  parentMap[item.product_kod_1c_parent] = [];
                parentMap[item.product_kod_1c_parent].push(item.product_kod_1c);
              }
            });

            newChecked.forEach((key) => {
              const children = parentMap[key];
              if (children) {
                newChecked = newChecked.filter((k) => !children.includes(k));
              }
            });

            Object.entries(parentMap).forEach(([parent, children]) => {
              const hasChildSelected = children.some((c) =>
                newChecked.includes(c)
              );
              if (hasChildSelected && newChecked.includes(parent)) {
                newChecked = newChecked.filter((k) => k !== parent);
              }
            });

            setSelectedFolderKeys(newChecked);
          }}
          defaultExpandAll
          showIcon
          blockNode
          switcherIcon={({ expanded }) =>
            expanded ? <MinusCircleOutlined style={{fontSize: 12}} /> : <PlusCircleOutlined style={{fontSize: 12}} />
          }
        />
      </Drawer>
    </>
  );
};
