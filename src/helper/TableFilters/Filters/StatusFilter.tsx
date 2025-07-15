import React from 'react';
import { Select, Button } from 'antd';

interface StatusFilterProps {
  options: { value: string; label: string }[];
  setSelectedKeys: (keys: string[]) => void;
  selectedKeys: string[];
  confirm: () => void;
  clearFilters: () => void;
  placeholder:string;
}

const StatusFilter: React.FC<StatusFilterProps> = ({
  options,
  setSelectedKeys,
  selectedKeys,
  confirm,
  clearFilters,
  placeholder
}) => (
  <div style={{ padding: 8 }}>
    <Select
      options={options}
      value={selectedKeys[0]}
      onChange={(value) => {
        setSelectedKeys(value ? [value] : []);
        confirm();
      }}
      style={{ width: 188, marginBottom: 8, display: 'block' }}
      placeholder={placeholder}
    />

    <Button type="primary" onClick={() => {clearFilters(); confirm();} } size="small" style={{ width: 90 }}>
      Сбросить
    </Button>
  </div>
);

export default StatusFilter;