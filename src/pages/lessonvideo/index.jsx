import { useEffect, useState } from 'react';
import { Table, Button, Input, Space, Modal, Form, Upload } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { UploadOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import './style.scss';

const LessonVideo = () => {
  const { id } = useParams();

  const [form] = Form.useForm();
  const [lessonVideo, setLessonVideo] = useState(null);
  const [fileList, setFileList] = useState([]);
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
      title: 'File Name',
      dataIndex: 'videoUrl',
      key: 'videoUrl',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button icon={<DeleteOutlined />} danger onClick={() => handleHardDelete(record.id)} />
        </Space>
      ),
    },
  ];

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
      const response = await axios.get(`${import.meta.env.VITE_DOMAIN}api/LessonVideo/${id}`);
      console.log(response.data);
      setLessonVideo(response.data);
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
    if (fileList.length === 0) {
      Swal.fire({
        title: 'Warning: Please Complete All Required Information',
        text: 'Please upload a file.',
        icon: 'warning',
      });
      return;
    }
    console.log(fileList);

    const newFile = new File([fileList[0]], fileList[0].name, {
      type: fileList[0].type,
      lastModified: fileList[0].lastModified,
    });
    console.log(newFile);
    setTimeout(async () => {
      const params = {
        Video: newFile,
        LessonId: id,
      };

      try {
        await axios.post(`${import.meta.env.VITE_DOMAIN}api/LessonVideo`, params);
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
    }, 2000);
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
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const dataSource = [lessonVideo];
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        {!lessonVideo && (
          <Button type="primary" onClick={showModal}>
            Add New Video
          </Button>
        )}
      </div>
      {lessonVideo && <Table columns={columns} dataSource={dataSource} />}
      <Modal
        title="Add New Video"
        open={isModalOpen}
        onOk={handleSignUp}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSignUp}>
            Add Video
          </Button>,
        ]}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Upload Video"
            name="file"
            valuePropName="fileList"
            getValueFromEvent={({ fileList }) => fileList}
            rules={[{ required: true, message: 'Please upload a file!' }]}
          >
            <Upload
              name="video"
              action="/upload"
              listType="picture"
              fileList={fileList}
              onChange={handleChange}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
      {/* <Modal
        title="Add Category"
        open={isModalOpen}
        onOk={handleSignUp}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSignUp}>
            Add Video
          </Button>,
        ]}
      >
        <Form layout="vertical" form={form}>
          <Form.Item label="Title" name="fullName" required>
            <Input placeholder="Enter Title" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </Form.Item>
        </Form>
      </Modal> */}
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
    </>
  );
};

export default LessonVideo;
