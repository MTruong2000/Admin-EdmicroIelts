import { useState } from 'react';
import { Table, Button, Input, Select, Space } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

import './style.scss';

const { Search } = Input;
const { Option } = Select;

const Category = () => {
  const [data, setData] = useState([
    {
      key: '1',
      name: 'John Doe',
      email: 'johndoe@example.com',
      role: 'Student',
      phone: '0123456789',
      status: 'Active',
    },
    {
      key: '2',
      name: 'Jane Smith',
      email: 'janesmith@example.com',
      role: 'Teacher',
      phone: '0987654321',
      status: 'Active',
    },
    {
      key: '3',
      name: 'Bob Johnson',
      email: 'bobjohnson@example.com',
      role: 'Student',
      phone: '0369852147',
      status: 'Soft Deleted',
    },
  ]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space>
          <Button icon={<EditOutlined />} />
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.key)} />
        </Space>
      ),
    },
  ];

  const handleDelete = (key) => {
    const newData = data.filter((item) => item.key !== key);
    setData(newData);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Button type="primary">Add Teacher Account</Button>
        <Space>
          <Search placeholder="Search by name or email" style={{ width: 200 }} />
          <Select defaultValue="All" style={{ width: 120 }}>
            <Option value="All">All</Option>
            <Option value="Active">Active</Option>
            <Option value="Soft Deleted">Soft Deleted</Option>
          </Select>
        </Space>
      </div>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default Category;
