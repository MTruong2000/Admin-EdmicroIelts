import { useEffect, useState } from 'react';
import { Table, Input, Space } from 'antd';
import moment from 'moment';
import axios from 'axios';
import './style.scss';

const HistoryPayment = () => {
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
      title: 'Full Name',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: 'Course title',
      dataIndex: 'courseTitle',
      key: 'courseTitle',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => <span>{amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>,
    },
    {
      title: 'Payment Date',
      dataIndex: 'paymentDate',
      key: 'paymentDate',
      render: (paymentDate) => <span>{moment(paymentDate).format('DD/MM/YYYY')}</span>,
    },
  ];

  const getUserAPI = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_DOMAIN}api/Payment/PaymentHistories`);
      setListUser(response.data);
      setFilteredData(response.data);
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
      <Table columns={columns} dataSource={filteredData.map((user) => ({ ...user, key: user.id }))} />
    </>
  );
};

export default HistoryPayment;
