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
  const [formEdit] = Form.useForm();
  const [lessonVideo, setLessonVideo] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [fileListEdit, setFileListEdit] = useState([]);

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
    formEdit.resetFields();
    setSelectedUser(user);
    setIsModalOpenEdit(true);
  };

  const handleCancelEdit = () => {
    setIsModalOpenEdit(false);
    setSelectedUser(null);
  };

  const getUserAPI = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_DOMAIN}api/LessonVideo/Lesson/${id}`);
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
      const response = await axios.delete(`${import.meta.env.VITE_DOMAIN}api/LessonVideo?videoId=${id}`);
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

    const params = new FormData();
    params.append('Video', fileList[0].originFileObj);
    params.append('LessonId', id);
    try {
      await axios.post(`${import.meta.env.VITE_DOMAIN}api/LessonVideo`, params, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
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
    if (fileListEdit.length === 0) {
      Swal.fire({
        title: 'Warning: Please Complete All Required Information',
        text: 'Please upload a file.',
        icon: 'warning',
      });
      return;
    }
    const params = new FormData();
    params.append('Video', fileListEdit[0].originFileObj);
    params.append('LessonId', id);
    try {
      await axios.put(`${import.meta.env.VITE_DOMAIN}api/LessonVideo?videoId=${selectedUser.id}`, params, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Success',
        showConfirmButton: false,
        timer: 1500,
      });
      getUserAPI();
    } catch (error) {
      console.error('Login error:', error);
      Swal.fire({
        title: 'Fail ?',
        text: error.response.data,
        icon: 'error',
      });
    }
    setIsModalOpenEdit(false);
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const handleChangeEdit = ({ fileList: newFileList }) => setFileListEdit(newFileList);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        {lessonVideo && lessonVideo.length == 0 && (
          <Button type="primary" onClick={showModal}>
            Add New Video
          </Button>
        )}
      </div>
      {lessonVideo && <Table columns={columns} dataSource={lessonVideo.map((user) => ({ ...user, key: user.id }))} />}
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

      <Modal
        title="Edit Video"
        open={isModalOpenEdit}
        onOk={handleSaveEdit}
        onCancel={handleCancelEdit}
        footer={[
          <Button key="cancel" onClick={handleCancelEdit}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSaveEdit}>
            Edit Video
          </Button>,
        ]}
      >
        <Form layout="vertical" form={formEdit}>
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
              fileList={fileListEdit}
              onChange={handleChangeEdit}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default LessonVideo;
