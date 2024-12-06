import { useEffect, useState } from 'react';
import { Table, Button, Input, Space } from 'antd';
import { IoMdPeople } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style.scss';

const { Search } = Input;

const CourseTeacher = () => {
  const navigate = useNavigate();
  const [listUser, setListUser] = useState([]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Course Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Content',
      dataIndex: 'courseContent',
      key: 'courseContent',
    },
    {
      title: 'Image',
      dataIndex: 'imageLink',
      key: 'imageLink',
      render: (imageLink) => (
        <img src={imageLink} alt="Course Image" style={{ width: '100px', height: 'auto', objectFit: 'contain' }} />
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => <span>{price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>,
    },
    {
      title: 'Category',
      dataIndex: 'categoryName',
      key: 'categoryName',
      render: (categoryName) => <div className="category-name-cus">{categoryName}</div>,
    },
    {
      title: 'Teacher',
      dataIndex: 'teacherName',
      key: 'teacherName',
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
          <Button icon={<IoMdPeople />} onClick={() => handleViewStuden(record)}>
            {' '}
            View all students
          </Button>
        </Space>
      ),
    },
  ];

  const handleViewStuden = (record) => {
    console.log(record);
  };

  const getUserAPI = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_DOMAIN}api/Course/GetAllCoursesForAdmin`);
      setListUser(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserAPI();
  }, []);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Space>
          <Search placeholder="Search by name or email" style={{ width: 200 }} />
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={listUser.map((user) => ({ ...user, key: user.id }))}
        onRow={(record) => {
          return {
            onClick: () => {
              navigate(`/lesson/${record.id}`);
            },
          };
        }}
      />
    </>
  );
};

export default CourseTeacher;
