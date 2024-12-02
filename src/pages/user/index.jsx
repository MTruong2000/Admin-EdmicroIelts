import { useEffect, useState } from 'react';
import { Table, Button, Input, Select, Space, Modal, Form } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { PiStorefront } from 'react-icons/pi';
import { MdOutlineRestore } from 'react-icons/md';
import Swal from 'sweetalert2';
import axios from 'axios';
import './style.scss';

const { Search } = Input;
const { Option } = Select;

const User = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassWord] = useState('');
  const [listUser, setListUser] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
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
          {!record.isDeleted && (
            <>
              <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
              <Button icon={<PiStorefront />} onClick={() => handleSoftDelete(record.id)} />
              <Button icon={<DeleteOutlined />} danger onClick={() => handleHardDelete(record.id)} />
            </>
          )}
          {record.isDeleted && (
            <>
              <Button icon={<MdOutlineRestore />} onClick={() => handleRestore(record)} />
            </>
          )}
        </Space>
      ),
    },
  ];
  const handleRestore = async (id) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_DOMAIN}api/User/Restore/${id}`);
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: response.data,
        showConfirmButton: false,
        timer: 1500,
      });
      getUserAPI();
    } catch (error) {
      Swal.fire({
        title: 'Request Fail ?',
        text: error,
        icon: 'error',
      });
    }
  };
  const handleSoftDelete = async (id) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_DOMAIN}api/User/SoftDelete/${id}`);
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: response.data.message,
        showConfirmButton: false,
        timer: 1500,
      });
      getUserAPI();
    } catch (error) {
      Swal.fire({
        title: 'Request Fail ?',
        text: error,
        icon: 'error',
      });
    }
  };
  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpenEdit(true);
  };

  const handleCancelEdit = () => {
    setIsModalOpenEdit(false);
    setSelectedUser(null);
  };
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

  const handleHardDelete = async (id) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_DOMAIN}api/User/HardDelete/${id}`);
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: response.data.message,
        showConfirmButton: false,
        timer: 1500,
      });
      getUserAPI();
    } catch (error) {
      Swal.fire({
        title: 'Request Fail ?',
        text: error,
        icon: 'error',
      });
    }
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

  const handleSaveEdit = async () => {
    const params = {
      fullName: selectedUser.fullName,
      email: selectedUser.email,
      phoneNumber: selectedUser.phoneNumber,
    };
    try {
      const response = await axios.put(`${import.meta.env.VITE_DOMAIN}api/User/${selectedUser.id}`, params, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: response.data.message,
        showConfirmButton: false,
        timer: 1500,
      });
      getUserAPI();
      handleCancelEdit();
    } catch (error) {
      Swal.fire({
        title: 'Request Fail ?',
        text: error,
        icon: 'error',
      });
    }
    setIsModalOpenEdit(false);
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
      <Modal title="Edit User Information" open={isModalOpenEdit} onCancel={handleCancelEdit} footer={null}>
        {selectedUser && (
          <form onSubmit={handleSaveEdit}>
            <label>
              Full Name:
              <Input
                value={selectedUser.fullName}
                onChange={(e) => setSelectedUser({ ...selectedUser, fullName: e.target.value })}
              />
            </label>
            <label>
              Email:
              <Input
                value={selectedUser.email}
                onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
              />
            </label>
            <label>
              Phone Number:
              <Input
                value={selectedUser.phoneNumber}
                onChange={(e) => setSelectedUser({ ...selectedUser, phoneNumber: e.target.value })}
              />
            </label>
            <div style={{ marginTop: '16px' }}>
              <Button onClick={handleCancelEdit} style={{ marginRight: '8px' }}>
                Cancel
              </Button>
              <Button type="primary" onClick={handleSaveEdit}>
                Save
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
};

export default User;
