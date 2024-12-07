import { useEffect, useState } from 'react';
import { Table, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import moment from 'moment';
import './style.scss';

const StudentManagement = () => {
  const { id } = useParams();
  const [listUser, setListUser] = useState([]);
  const [searchText, setSearchText] = useState('');

  const columns = [
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
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Grade',
      dataIndex: 'grade',
      key: 'grade',
    },
    {
      title: 'Test Date',
      dataIndex: 'testDate',
      key: 'testDate',
      render: (testDate) => <span>{moment(testDate).format('DD/MM/YYYY')}</span>,
    },
  ];

  const getUserAPI = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_DOMAIN}api/Course/${id}/students`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('jwtToken')}`,
        },
      });
      setListUser(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchClick = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_DOMAIN}api/Course/${id}/students?searchQuery=${searchText}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('jwtToken')}`,
          },
        },
      );
      setListUser(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="block-student-search">
        <Input
          placeholder="Search by name or email"
          style={{ width: 200 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <SearchOutlined
          style={{
            marginLeft: 8,
            fontSize: 18,
            cursor: 'pointer',
          }}
          onClick={handleSearchClick}
        />
      </div>
      <Table columns={columns} dataSource={listUser.map((user) => ({ ...user, key: user.phoneNumber }))} />
    </>
  );
};

export default StudentManagement;
