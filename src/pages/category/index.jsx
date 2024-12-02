import { useEffect, useState } from 'react';
import { Table, Button, Input, Select, Space, Modal, Form } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { PiStorefront } from 'react-icons/pi';
import Swal from 'sweetalert2';
import axios from 'axios';
import './style.scss';

const { Search } = Input;
const { Option } = Select;

const Category = () => {
  const [fullName, setFullName] = useState('');
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
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button icon={<PiStorefront />} onClick={() => handleSoftDelete(record.id)} />
          <Button icon={<DeleteOutlined />} danger onClick={() => handleHardDelete(record.id)} />
        </Space>
      ),
    },
  ];
  const handleSoftDelete = async (id) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_DOMAIN}api/Category/SoftDelete/${id}`);
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
      const response = await axios.get(`${import.meta.env.VITE_DOMAIN}api/Category`);
      console.log(response.data);
      const newData = updateStatus(response.data);
      setListUser(newData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserAPI();
  }, []);
  const resetModal = () => {
    setFullName('');
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
      const response = await axios.delete(`${import.meta.env.VITE_DOMAIN}api/Category/HardDelete/${id}`);
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
    if (!fullName) {
      Swal.fire({
        title: 'Warning: Please Complete All Required Information',
        text: 'Please fill in all the information.',
        icon: 'warning',
      });
      return;
    }

    const params = {
      name: fullName,
      isDeleted: false,
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_DOMAIN}api/Category`, params);
      console.log(response);
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Success',
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
    console.log(selectedUser);

    const params = {
      name: selectedUser.name,
      isDeleted: selectedUser.isDeleted,
    };
    try {
      const response = await axios.put(`${import.meta.env.VITE_DOMAIN}api/Category/${selectedUser.id}`, params, {
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
          Add Category
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
        title="Add Category"
        open={isModalOpen}
        onOk={handleSignUp}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSignUp}>
            Add Category
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="" name="fullName" required>
            <Input placeholder="Enter  name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal title="Edit User Information" open={isModalOpenEdit} onCancel={handleCancelEdit} footer={null}>
        {selectedUser && (
          <form onSubmit={handleSaveEdit}>
            <label>
              Full Name:
              <Input
                value={selectedUser.name}
                onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
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

export default Category;
