import { useEffect, useState } from 'react';
import { Table, Button, Input, Space, Modal, Form } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { PiStorefront } from 'react-icons/pi';
import { MdOutlineRestore } from 'react-icons/md';
import Swal from 'sweetalert2';
import axios from 'axios';
import './style.scss';

const Category = () => {
  const [form] = Form.useForm();
  const [fullName, setFullName] = useState('');
  const [listUser, setListUser] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);

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
      dataIndex: 'isDeleted',
      key: 'isDeleted',
      render: (isDeleted) =>
        isDeleted ? <div className="status-softdelete">SoftDelete</div> : <div className="status-active">Active</div>,
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
              <Button icon={<MdOutlineRestore />} onClick={() => handleRestore(record.id)} />
            </>
          )}
        </Space>
      ),
    },
  ];
  const handleRestore = async (id) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_DOMAIN}api/Category/Restore/${id}`);
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
      const response = await axios.delete(`${import.meta.env.VITE_DOMAIN}api/Category/SoftDelete/${id}`);
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
  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpenEdit(true);
  };

  const handleCancelEdit = () => {
    setIsModalOpenEdit(false);
    setSelectedUser(null);
  };

  const getUserAPI = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_DOMAIN}api/Category`);
      setListUser(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserAPI();
  }, []);

  const showModal = () => {
    form.resetFields();
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
      await axios.post(`${import.meta.env.VITE_DOMAIN}api/Category`, params);
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

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    const filtered = listUser.filter((user) =>
      Object.values(user).some((field) => String(field).toLowerCase().includes(value)),
    );

    setFilteredData(filtered);
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Button type="primary" onClick={showModal}>
          Add Category
        </Button>
        <Space>
          <Input
            placeholder="Tìm kiếm..."
            value={searchText}
            onChange={handleSearch}
            style={{ marginBottom: 16, width: '300px' }}
          />
        </Space>
      </div>
      <Table columns={columns} dataSource={filteredData.map((user) => ({ ...user, key: user.id }))} />
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
        <Form layout="vertical" form={form}>
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
