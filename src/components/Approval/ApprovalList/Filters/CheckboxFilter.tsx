import React from 'react';
import { Checkbox, Button, Space } from 'antd';

interface CheckboxFilterProps {
  setSelectedKeys: (keys: string[]) => void;
  selectedKeys: string[];
  confirm: () => void;
  clearFilters: () => void;
}

const CheckboxFilter: React.FC<CheckboxFilterProps> = ({
  setSelectedKeys,
  selectedKeys,
  confirm,
  clearFilters,
}) => (
  <div style={{ padding: 8 }}>
    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '5px' }}>
      <Checkbox
        onChange={(e) =>
          setSelectedKeys(
            e.target.checked ? ['OMS'] : selectedKeys.filter((key) => key !== 'OMS')
          )
        }
        checked={selectedKeys.includes('OMS')}
      >
        ОМС
      </Checkbox>
      <Checkbox
        onChange={(e) =>
          setSelectedKeys(
            e.target.checked ? ['PU'] : selectedKeys.filter((key) => key !== 'PU')
          )
        }
        checked={selectedKeys.includes('PU')}
      >
        ПУ
      </Checkbox>
    </div>
    <Space>
      <Button type="primary" onClick={confirm} size="small" style={{ width: 50 }}>
        ОК
      </Button>
      <Button onClick={clearFilters} size="small" style={{ width: 90 }}>
        Сброс
      </Button>
    </Space>
  </div>
);

export default CheckboxFilter;