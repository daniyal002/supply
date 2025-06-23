import React, { useEffect } from 'react';
import { Button, Input, InputRef, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { FilterDropdownProps } from 'antd/es/table/interface';

interface SearchFilterProps extends FilterDropdownProps {
  searchText: string;
  searchedColumn: string;
  dataIndex: string;
  searchInput: React.RefObject<InputRef>;
  handleSearch: (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: string
  ) => void;
  handleReset: (clearFilters: () => void) => void;
  placeholder:string
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  setSelectedKeys,
  selectedKeys,
  confirm,
  clearFilters,
  close,
  searchText,
  searchedColumn,
  dataIndex,
  searchInput,
  handleSearch,
  handleReset,
  placeholder
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();

        // Просто вызываем close(), чтобы закрыть фильтр
        close();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [close]); // <-- важно добавить close в зависимости
  return (
  <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
    <Input
      ref={searchInput}
      placeholder={placeholder}
      value={selectedKeys[0]}
      onChange={(e) =>
        setSelectedKeys(e.target.value ? [e.target.value] : [])
      }
      onPressEnter={() =>
        handleSearch(selectedKeys as string[], confirm, dataIndex)
      }
      style={{ marginBottom: 8, display: 'block' }}
    />
    <Space>
      <Button
        type="primary"
        onClick={() =>
          handleSearch(selectedKeys as string[], confirm, dataIndex)
        }
        icon={<SearchOutlined />}
        size="small"
        style={{ width: 90 }}
      >
        Поиск
      </Button>
      <Button
        onClick={() => clearFilters && handleReset(clearFilters)}
        size="small"
        style={{ width: 90 }}
      >
        Сброс
      </Button>
      <Button
        type="link"
        size="small"
        onClick={() => close()}
        style={{ color: '#678098' }}
      >
        Закрыть
      </Button>
    </Space>
  </div>
);
}

export default SearchFilter;