import { useEffect, useState } from 'react';
import { Table, Button, Input, Space } from 'antd';
import { IoMdPeople } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import './style.scss';

const CourseTeacher = () => {
  const navigate = useNavigate();
  const userRole = Cookies.get('userRole');
  const [listUser, setListUser] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);

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
          <Button
            icon={<IoMdPeople />}
            onClick={(e) => {
              e.stopPropagation();
              handleViewStuden(record);
            }}
          >
            {' '}
            View all students
          </Button>
        </Space>
      ),
    },
  ];

  const handleViewStuden = (record) => {
    navigate(`/student-management/${record.id}`);
  };

  const getUserAPI = async () => {
    try {
      if (userRole === 'Admin') {
        const response = await axios.get(`${import.meta.env.VITE_DOMAIN}api/Course/GetAllCoursesForAdmin`);
        setListUser(response.data);
        setFilteredData(response.data);
      } else {
        const response = await axios.get(`${import.meta.env.VITE_DOMAIN}api/Course/GetCoursesByInstructor`, {
          headers: {
            Authorization: `Bearer ${Cookies.get('jwtToken')}`,
          },
        });
        setListUser(response.data);
        setFilteredData(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserAPI();
  }, []);

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
        <Space>
          <Input
            placeholder="Tìm kiếm..."
            value={searchText}
            onChange={handleSearch}
            style={{ marginBottom: 16, width: '300px' }}
          />
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={filteredData.map((user) => ({ ...user, key: user.id }))}
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
