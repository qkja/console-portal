import { useCallback } from 'react';
import { Input, Select, Button, Space, Form } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

export interface SearchField {
  name: string;
  label: string;
  type: 'input' | 'select';
  placeholder?: string;
  options?: { label: string; value: string | number }[];
}

interface SearchBarProps {
  fields: SearchField[];
  onSearch: (values: Record<string, string>) => void;
  onReset: () => void;
}

/**
 * 搜索+筛选条（复用查询与重置逻辑）
 */
export function SearchBar({ fields, onSearch, onReset }: SearchBarProps) {
  const [form] = Form.useForm();

  const handleSearch = useCallback(() => {
    const values = form.getFieldsValue();
    onSearch(values);
  }, [form, onSearch]);

  const handleReset = useCallback(() => {
    form.resetFields();
    onReset();
  }, [form, onReset]);

  return (
    <div style={{ marginBottom: 16 }}>
      <Form form={form} layout="inline">
        {fields.map((field) => (
          <Form.Item key={field.name} name={field.name} label={field.label}>
            {field.type === 'select' ? (
              <Select
                style={{ width: 150 }}
                placeholder={field.placeholder || '请选择'}
                options={field.options}
                allowClear
                onChange={handleSearch}
              />
            ) : (
              <Input
                placeholder={field.placeholder || '请输入搜索关键词'}
                style={{ width: 200 }}
                onPressEnter={handleSearch}
              />
            )}
          </Form.Item>
        ))}
        <Form.Item>
          <Space>
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
              搜索
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}
