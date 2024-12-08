import { useEffect, useState } from 'react';
import { Button, Drawer, Input, List, Typography, Layout, Table, Space, Modal, Form } from 'antd';
import { DeleteOutlined, EditOutlined, MessageOutlined } from '@ant-design/icons';
import { PiStorefront } from 'react-icons/pi';
import { MdOutlineRestore } from 'react-icons/md';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import axios from 'axios';
import './style.scss';

const { Sider, Content } = Layout;

const FinalTest = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const jwtToken = Cookies.get('jwtToken');
  const Uid = Cookies.get('Uid');
  const userRole = Cookies.get('userRole');

  const [visible, setVisible] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatData, setChatData] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const [form] = Form.useForm();
  const [fullName, setFullName] = useState('');
  const [description, setDecription] = useState('');

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
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
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
              <Button
                icon={<EditOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(record);
                }}
              />
              <Button
                icon={<PiStorefront />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSoftDelete(record.id);
                }}
              />
              <Button
                icon={<DeleteOutlined />}
                danger
                onClick={(e) => {
                  e.stopPropagation();
                  handleHardDelete(record.id);
                }}
              />
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddFinalTest(record.id);
                }}
              >
                Add Final Test
              </Button>
            </>
          )}
          {record.isDeleted && (
            <>
              <Button
                icon={<MdOutlineRestore />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRestore(record.id);
                }}
              />
            </>
          )}
        </Space>
      ),
    },
  ];
  const handleAddFinalTest = (id) => {
    console.log(id);
  };
  const handleRestore = async (id) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_DOMAIN}api/Lesson/Restore/${id}`);
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
      const response = await axios.delete(`${import.meta.env.VITE_DOMAIN}api/Lesson/SoftDelete/${id}`);
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
      const response = await axios.get(`${import.meta.env.VITE_DOMAIN}api/Lesson/Course/${id}`);
      setListUser(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDataListChat = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_DOMAIN}api/Chat/${id}/messages`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      setChatData(response.data);
    } catch (error) {
      console.error('Error fetching chat data:', error);
    }
  };

  useEffect(() => {
    const groupedData = chatData.reduce((acc, message) => {
      acc[message.senderId] = {
        senderId: message.senderId,
        senderName: message.senderName,
        content: message.content,
        courseId: message.courseId,
        timestamp: message.timestamp,
      };
      return acc;
    }, {});

    setProcessedData(Object.values(groupedData));
  }, [chatData]);

  const fetchMessages = async (courseId, studentId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_DOMAIN}api/Chat/teacher/${courseId}/messages/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        },
      );
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat.senderId);

    const studentId = Uid === chat.senderId.toString() ? chat.receiverId : chat.senderId;
    const courseId = chat.courseId;

    fetchMessages(courseId, studentId);
  };

  const sendMessage = async () => {
    if (newMessage.trim() !== '' && selectedChat) {
      try {
        await axios.post(
          `${import.meta.env.VITE_DOMAIN}api/Chat/send-from-instructor`,
          {
            courseId: id,
            messageContent: newMessage,
            studentId: selectedChat,
          },
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          },
        );
        setNewMessage('');
      } catch (error) {
        Swal.fire({
          title: 'Send mess Fail ?',
          text: error,
          icon: 'error',
        });
      }
      fetchMessages(id, selectedChat);
    }
  };

  useEffect(() => {
    getUserAPI();
    fetchDataListChat();
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
      const response = await axios.delete(`${import.meta.env.VITE_DOMAIN}api/Lesson/HardDelete/${id}`);
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
      title: fullName,
      description,
      courseId: id,
    };

    try {
      await axios.post(`${import.meta.env.VITE_DOMAIN}api/Lesson`, params);
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
      title: selectedUser.title,
      description: selectedUser.description,
      courseId: id,
    };
    try {
      const response = await axios.put(`${import.meta.env.VITE_DOMAIN}api/Lesson/?id=${selectedUser.id}`, params, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: response.data,
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
          Add Lesson
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
      <Table
        columns={columns}
        dataSource={filteredData.map((user) => ({ ...user, key: user.id }))}
        onRow={(record) => {
          return {
            onClick: () => {
              navigate(`/lesson-video/${record.id}`);
            },
          };
        }}
      />
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
            Add Lesson
          </Button>,
        ]}
      >
        <Form layout="vertical" form={form}>
          <Form.Item label="Title" name="fullName" required>
            <Input placeholder="Enter Title" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input
              placeholder="Enter Description"
              value={description}
              onChange={(e) => setDecription(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal title="Edit User Information" open={isModalOpenEdit} onCancel={handleCancelEdit} footer={null}>
        {selectedUser && (
          <form onSubmit={handleSaveEdit}>
            <label>
              Title
              <Input
                value={selectedUser.title}
                onChange={(e) => setSelectedUser({ ...selectedUser, title: e.target.value })}
              />
            </label>
            <label>
              Description
              <Input
                value={selectedUser.description}
                onChange={(e) => setSelectedUser({ ...selectedUser, description: e.target.value })}
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
      {userRole === 'Teacher' && (
        <Button
          type="primary"
          shape="circle"
          icon={<MessageOutlined />}
          className="btn-chatting"
          style={{
            backgroundColor: '#000',
            borderColor: '#000',
            color: '#fff',
            width: '50px',
            height: '50px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={() => {
            setSelectedChat(null);
            setVisible(true);
          }}
        />
      )}

      <Drawer title="Chat" placement="right" width={800} onClose={() => setVisible(false)} open={visible}>
        <Layout style={{ height: '100%' }}>
          <Sider
            width={300}
            style={{ backgroundColor: '#f9f9f9', borderRight: '1px solid #e8e8e8', overflowY: 'auto' }}
          >
            <List
              dataSource={processedData}
              renderItem={(item) => (
                <List.Item
                  style={{
                    cursor: 'pointer',
                    padding: '16px',
                    backgroundColor: selectedChat === item.senderId ? '#e6f7ff' : '#fff',
                  }}
                  onClick={() => handleChatSelect(item)}
                >
                  <List.Item.Meta
                    title={<Typography.Text strong>{item.senderName}</Typography.Text>}
                    description={item.content}
                  />
                  <Typography.Text type="secondary">{moment(item.timestamp).format('HH:mm A')}</Typography.Text>
                </List.Item>
              )}
            />
          </Sider>

          <Layout>
            <Content style={{ padding: '16px', display: 'flex', flexDirection: 'column', height: '100%' }}>
              {selectedChat ? (
                <>
                  <div style={{ flexGrow: 1, overflowY: 'auto', paddingBottom: '16px' }}>
                    <List
                      dataSource={messages}
                      renderItem={(item) => (
                        <List.Item
                          style={{
                            justifyContent: item.senderId.toString() === Uid ? 'flex-end' : 'flex-start',
                            textAlign: item.senderId.toString() === Uid ? 'right' : 'left',
                          }}
                        >
                          <div
                            style={{
                              maxWidth: '70%',
                              padding: '10px',
                              borderRadius: '8px',
                              backgroundColor: item.senderId.toString() === Uid ? '#000' : '#f0f0f0',
                              color: item.senderId.toString() === Uid ? '#fff' : '#000',
                            }}
                          >
                            <Typography.Text style={{ color: item.senderId.toString() === Uid ? '#fff' : '#000' }}>
                              {item.content}
                            </Typography.Text>
                            <div style={{ fontSize: '12px', marginTop: '5px', opacity: 0.6 }}>
                              {moment(item.timestamp).format('HH:mm A')}
                            </div>
                          </div>
                        </List.Item>
                      )}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onPressEnter={sendMessage}
                    />
                    <Button type="primary" onClick={sendMessage}>
                      Send
                    </Button>
                  </div>
                </>
              ) : (
                <Typography.Text type="secondary" style={{ textAlign: 'center', marginTop: '20px' }}>
                  Select a chat to start messaging
                </Typography.Text>
              )}
            </Content>
          </Layout>
        </Layout>
      </Drawer>
    </>
  );
};

export default FinalTest;
