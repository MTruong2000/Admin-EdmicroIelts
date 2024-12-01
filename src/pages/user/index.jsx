import { useEffect, useState } from 'react';
import { Table, Button, Input, Select, Space, Modal, Form } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import axios from 'axios';
import './style.scss';

const { Search } = Input;
const { Option } = Select;

const User = () => {
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
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassWord] = useState('');
  const [listUser, setListUser] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
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
  const updateRole = (data) => {
    data.forEach((user) => {
      switch (user.roleId) {
        case 1:
          user.role = 'Student';
          break;
        case 2:
          user.role = 'Teacher';
          break;
        case 3:
          user.role = 'Admin';
          break;
        default:
          user.role = 'unknown';
      }
    });
    return data;
  };
  const updateStatus = (data) => {
    data.forEach((user) => {
      switch (user.isDeleted) {
        case true:
          user.status = 'Soft Delete';
          break;
        case false:
          user.status = 'Active';
          break;
      }
    });
    return data;
  };

  const getUserAPI = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_DOMAIN}api/User`);
      const newData = updateStatus(response.data);
      console.log(newData);

      setListUser(updateRole(newData));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserAPI();
  }, []);
  const resetModal = () => {
    setFullName('');
    setEmail('');
    setPhoneNumber('');
    setPassWord('');
  };
  const showModal = () => {
    resetModal();
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDelete = (key) => {
    const newData = data.filter((item) => item.key !== key);
    setData(newData);
  };

  const handleSignUp = async () => {
    if (!fullName || !email || !phoneNumber || !password) {
      Swal.fire({
        title: 'Warning: Please Complete All Required Information',
        text: 'Please fill in all the information.',
        icon: 'warning',
      });
      return;
    }

    const params = {
      fullName,
      email,
      password,
      phoneNumber,
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_DOMAIN}api/User/Register/Teacher`, params);

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: response.data.message,
        showConfirmButton: false,
        timer: 1500,
      });
      getUserAPI();
      handleOk();
    } catch (error) {
      console.error('Login error:', error);
      Swal.fire({
        title: 'Fail ?',
        text: error.response.data.message,
        icon: 'error',
      });
    }
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Button type="primary" onClick={showModal}>
          Add Teacher Account
        </Button>
        <Space>
          <Search placeholder="Search by name or email" style={{ width: 200 }} />
          <Select defaultValue="All" style={{ width: 120 }}>
            <Option value="All">All</Option>
            <Option value="Active">Active</Option>
            <Option value="Soft Deleted">Soft Deleted</Option>
          </Select>
        </Space>
      </div>
      <Table columns={columns} dataSource={listUser} />
      <Modal
        title="Add Teacher Account"
        open={isModalOpen}
        onOk={handleSignUp}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSignUp}>
            Add User
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="Full Name" name="fullName" required>
            <Input placeholder="Enter full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </Form.Item>
          <Form.Item label="Email" name="email" required>
            <Input type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Form.Item>
          <Form.Item label="Phone Number" name="phoneNumber">
            <Input
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Role" name="role">
            <Input placeholder="Teacher" value="Teacher" disabled />
          </Form.Item>
          <Form.Item label="Password" name="password" required>
            <Input.Password
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassWord(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default User;
