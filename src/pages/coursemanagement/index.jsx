import { useEffect, useState } from 'react';
import { Table, Button, Input, Select, Space, Modal, Form } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { PiStorefront } from 'react-icons/pi';
import { MdOutlineRestore } from 'react-icons/md';
import Swal from 'sweetalert2';
import axios from 'axios';
import TextArea from 'antd/es/input/TextArea';
import './style.scss';

const { Search } = Input;

const CourseManagement = () => {
  const [form] = Form.useForm();

  const [listUser, setListUser] = useState([]);

  const [courseTitle, setCourseTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [teacher, setTeacher] = useState('');

  const [listCategory, setListCategory] = useState([]);
  const [listTeacher, setListTeacher] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);

  const [selectedUser, setSelectedUser] = useState({});

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

  const getUserAPI = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_DOMAIN}api/Course/GetAllCoursesForAdmin`);
      setListUser(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getCategoryAPI = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_DOMAIN}api/Category`);
      const newData = response.data.filter((item) => !item.isDeleted);
      setListCategory(newData);
    } catch (error) {
      console.error(error);
    }
  };

  const getTeacherAPI = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_DOMAIN}api/User/GetAllTeachers`);
      setListTeacher(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserAPI();
    getCategoryAPI();
    getTeacherAPI();
  }, []);
  const handleEdit = (record) => {
    console.log(record);
    setSelectedUser(record);
    setIsModalOpenEdit(true);
  };
  const handleRestore = async (id) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_DOMAIN}api/Course/Restore/${id}`);
      console.log(response);
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
      const response = await axios.delete(`${import.meta.env.VITE_DOMAIN}api/Course/SoftDelete/${id}`);
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

  const handleHardDelete = async (id) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_DOMAIN}api/Course/HardDelete/${id}`);
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

  const showModal = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleAddCourse = async () => {
    if (!courseTitle || !price || !category || !teacher || !description || !content || !image) {
      Swal.fire({
        title: 'Warning: Please Complete All Required Information',
        text: 'Please fill in all the information.',
        icon: 'warning',
      });
      return;
    }
    const Id = listUser.pop().id + 1;
    const params = {
      Id,
      Title: courseTitle,
      Description: description,
      CourseContent: content,
      Image: image,
      Price: price,
      CategoryId: category,
      InstructorId: teacher,
    };
    try {
      await axios.post(`${import.meta.env.VITE_DOMAIN}api/Course`, params, {
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
      setIsModalOpen(false);
    } catch (error) {
      console.error('Login error:', error);
      Swal.fire({
        title: 'Fail ?',
        text: error.response.data,
        icon: 'error',
      });
    }
  };

  const handleEditCourse = async () => {
    console.log(270);
  };

  const handleEditCancel = () => {
    setIsModalOpenEdit(false);
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Button type="primary" onClick={showModal}>
          Add Teacher Account
        </Button>
        <Space>
          <Search placeholder="Search by name or email" style={{ width: 200 }} />
        </Space>
      </div>
      <Table columns={columns} dataSource={listUser} />
      <Modal
        title="Add New Course"
        open={isModalOpen}
        onOk={handleAddCourse}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleAddCourse}>
            Add Course
          </Button>,
        ]}
      >
        <Form layout="vertical" form={form}>
          <Form.Item label="Course Title" name="courseTitle" required>
            <Input
              placeholder="Enter course title"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea
              placeholder="Enter course description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Content" name="content">
            <Input.TextArea
              placeholder="Enter course content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Image" name="image">
            <Input type="file" onChange={(e) => setImage(e.target.files[0])} accept="image/*" />
          </Form.Item>
          <Form.Item label="Price" name="price" required>
            <Input type="number" placeholder="Enter price" value={price} onChange={(e) => setPrice(e.target.value)} />
          </Form.Item>
          <Form.Item label="Category" name="category" required>
            <Select placeholder="Select a category" value={category} onChange={(value) => setCategory(value)}>
              {listCategory.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Teacher" name="teacher" required>
            <Select placeholder="Select a teacher" value={teacher} onChange={(value) => setTeacher(value)}>
              {listTeacher.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.fullName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Modal title="Edit Course" open={isModalOpenEdit} onCancel={handleEditCancel} onOk={handleEditCourse}>
        {console.log(selectedUser)}
        {
          <Form layout="vertical">
            <Form.Item label="Course Title" name="courseTitle" required>
              <Input
                placeholder="Enter course title"
                value={selectedUser.title}
                onChange={(e) => setSelectedUser({ ...selectedUser, title: e.target.value })}
              />
            </Form.Item>
            <Form.Item label="Description" name="description">
              <TextArea
                placeholder="Enter course description"
                value={selectedUser.description}
                onChange={(e) => setSelectedUser({ ...selectedUser, description: e.target.value })}
              />
            </Form.Item>
            <Form.Item label="Content" name="content">
              <TextArea
                placeholder="Enter course content"
                value={selectedUser.content}
                onChange={(e) => setSelectedUser({ ...selectedUser, content: e.target.value })}
              />
            </Form.Item>
          </Form>
        }
        {/* <Form layout="vertical" form={form}>
          <Form.Item label="Course Title" name="courseTitle" required>
            <Input
              placeholder="Enter course title"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <TextArea
              placeholder="Enter course description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Content" name="content">
            <TextArea placeholder="Enter course content" value={content} onChange={(e) => setContent(e.target.value)} />
          </Form.Item>

          <Form.Item label="Image" name="image">
            <Input type="file" onChange={handleImageChange} accept="image/*" />
          </Form.Item>

          <Form.Item label="Price" name="price" required>
            <Input type="number" placeholder="Enter price" value={price} onChange={(e) => setPrice(e.target.value)} />
          </Form.Item>

          <Form.Item label="Category" name="category" required>
            <Select value={category} onChange={(value) => setCategory(value)}>
              {listCategory.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Teacher" name="teacher" required>
            <Select value={teacher} onChange={(value) => setTeacher(value)}>
              {listTeacher.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.firstName} {item.lastName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form> */}
      </Modal>
    </>
  );
};

export default CourseManagement;
