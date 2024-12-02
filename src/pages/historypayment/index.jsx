import { useEffect, useState } from 'react';
import { Table, Input, Space } from 'antd';
import moment from 'moment';
import axios from 'axios';
import './style.scss';

const { Search } = Input;

const HistoryPayment = () => {
  const [listUser, setListUser] = useState([]);
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
      console.log(response.data);
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
      <Table columns={columns} dataSource={listUser} />
    </>
  );
};

export default HistoryPayment;
