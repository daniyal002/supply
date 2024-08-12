'use client';

import { Button, Space, Table, TableColumnsType, Input } from "antd";
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { useState, useRef } from 'react';
import { IProductGroup, IProductUnit } from "@/interface/product";
import { IBasicUnit } from "@/interface/basicUnit";
import type { InputRef, TableColumnType } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';

interface ProductTableProps {
  productData: IProductUnit[];
  showModal: () => void;
  setProductId: (product: number) => void;
}

const SelectProductOrderTable: React.FC<ProductTableProps> = ({ productData, showModal, setProductId }) => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: keyof IProductUnit,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: keyof IProductUnit): TableColumnType<IProductUnit> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Поиск
          </Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Сброс
          </Button>
          {/* <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Фильтр
          </Button> */}
          <Button
            type="link"
            size="small"
            onClick={() => close()}
          >
            Закрыть
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const productGroup = productData?.map(product => ({
    text: product.product_group.product_group_name,
    value: product.product_group.product_group_id
  }));
  const unitGroup = productData?.map(product => ({
    text: product.unit_measurement.unit_measurement_name,
    value: product.unit_measurement.unit_measurement_id
  }));
  const columns: TableColumnsType<IProductUnit> = [
    {
      title: "Товар",
      dataIndex: "product_name",
      key: "product_name",
      sorter: (a, b) => a.product_name.localeCompare(b.product_name, "ru"),
      ...getColumnSearchProps('product_name'), // Add search capability here
    },
    {
      title: "Группа товаров",
      dataIndex: "product_group",
      key: "product_group",
      sorter: (a, b) => a.product_group.product_group_name.localeCompare(b.product_group.product_group_name, "ru"),
      render: (product_group: IProductGroup) => product_group.product_group_name,
      responsive: ["sm"],
      filters: productGroup,
      onFilter: (value, record) => record.product_group.product_group_id === value,
    },
    {
      title: "Ед. измерения",
      dataIndex: "unit_measurement",
      key: "unit_measurement",
      sorter: (a, b) => a.unit_measurement.unit_measurement_name.localeCompare(b.unit_measurement.unit_measurement_name, "ru"),
      render: (unit_measurement: IBasicUnit) => unit_measurement.unit_measurement_name,
      responsive: ["sm"],
      filters: unitGroup as { text: string; value: number }[],
      onFilter: (value, record) => record.unit_measurement.unit_measurement_id === value,
    },
    {
      title: "Действия",
      key: "action",
      render: (_: any, record: IProductUnit) => (
        <Space size="middle">
          <Button
            onClick={() => {
              showModal();
              setProductId(record.product_id);
            }}
          >
            Добавить
          </Button>
        </Space>
      ),
    },
  ];

  const dataSource = productData?.map((product) => ({
    ...product,
    key: product.product_id, // Ensure each item has a unique key
  }));

  return <Table dataSource={dataSource} columns={columns} />;
};

export default SelectProductOrderTable;
