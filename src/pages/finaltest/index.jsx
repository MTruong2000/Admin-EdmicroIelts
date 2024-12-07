import { useState } from 'react';
import { Card, Button, Input, Modal, Form, List } from 'antd';
import { useParams } from 'react-router-dom';

import './style.scss';

const Lesson = () => {
  const { id } = useParams();

  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenListView, setIsModalOpenListView] = useState(false);

  const [questions, setQuestions] = useState([{ question: '', answers: { A: '', B: '', C: '', D: '' } }]);

  const onClose = () => {
    setIsModalOpen(false);
  };

  const showModal = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleSubmit = (values) => {
    console.log({
      timeLimit: values.timeLimit,
      questions: questions,
    });
    // onClose();
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: '', answers: { A: '', B: '', C: '', D: '' } }]);
  };

  const updateQuestion = (index, key, value) => {
    const updatedQuestions = [...questions];
    if (key === 'question') {
      updatedQuestions[index].question = value;
    } else {
      updatedQuestions[index].answers[key] = value;
    }
    setQuestions(updatedQuestions);
  };

  const data = [
    { id: 1, title: 'Final Test 1', createdAt: '12/7/2024, 11:05:34 AM', timeLimit: '60 minutes' },
    { id: 2, title: 'Final Test 2', createdAt: '12/7/2024, 11:10:00 AM', timeLimit: '90 minutes' },
    { id: 3, title: 'Final Test 3', createdAt: '12/7/2024, 12:00:00 PM', timeLimit: '120 minutes' },
    { id: 4, title: 'Final Test 3', createdAt: '12/7/2024, 12:00:00 PM', timeLimit: '120 minutes' },
    { id: 5, title: 'Final Test 3', createdAt: '12/7/2024, 12:00:00 PM', timeLimit: '120 minutes' },
    { id: 6, title: 'Final Test 3', createdAt: '12/7/2024, 12:00:00 PM', timeLimit: '120 minutes' },
    { id: 7, title: 'Final Test 3', createdAt: '12/7/2024, 12:00:00 PM', timeLimit: '120 minutes' },
  ];

  const handleView = () => {
    console.log('View');
    setIsModalOpenListView(true);
  };

  const onCloseListView = () => {
    setIsModalOpenListView(false);
  };

  const testData = {
    title: 'Final Test 1',
    timeLimit: 60,
    questions: [
      {
        question: 'What is React?',
        answers: { A: 'A library', B: 'A framework', C: 'A database', D: 'None of the above' },
      },
      {
        question: 'What is JSX?',
        answers: { A: 'JavaScript XML', B: 'Java Syntax Extension', C: 'JSON XML', D: 'None of the above' },
      },
    ],
  };

  return (
    <>
      <div className="block-final-test-btn-create">
        <Button type="primary" onClick={showModal}>
          Create Final Test
        </Button>
      </div>
      <div className="final-test-list">
        {data.map((item) => (
          <Card key={item.id} title={item.title} bordered={false} className="final-test-card" onClick={handleView}>
            <p>
              <strong>Created at:</strong> {item.createdAt}
            </p>
            <p>
              <strong>Time limit:</strong> {item.timeLimit}
            </p>
            <div className="final-test-actions">
              <Button type="default">Edit</Button>
              <Button type="primary" danger>
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
      <Modal title="Create Final Test" open={isModalOpen} onCancel={onClose} footer={null} width={600}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            timeLimit: 60,
          }}
        >
          <Form.Item
            label="Set Time Limit (minutes)"
            name="timeLimit"
            rules={[{ required: true, message: 'Please set a time limit!' }]}
          >
            <Input type="number" placeholder="Enter time limit in minutes" />
          </Form.Item>

          {questions.map((item, index) => (
            <div key={index} style={{ marginBottom: '20px' }}>
              <Form.Item
                label={`Question ${index + 1}`}
                required
                rules={[{ required: true, message: 'Please enter a question!' }]}
              >
                <Input
                  placeholder={`Enter question ${index + 1}`}
                  value={item.question}
                  onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                />
              </Form.Item>

              <Form.Item label="Answer A" required>
                <Input
                  placeholder="Enter answer A"
                  value={item.answers.A}
                  onChange={(e) => updateQuestion(index, 'A', e.target.value)}
                />
              </Form.Item>
              <Form.Item label="Answer B" required>
                <Input
                  placeholder="Enter answer B"
                  value={item.answers.B}
                  onChange={(e) => updateQuestion(index, 'B', e.target.value)}
                />
              </Form.Item>
              <Form.Item label="Answer C" required>
                <Input
                  placeholder="Enter answer C"
                  value={item.answers.C}
                  onChange={(e) => updateQuestion(index, 'C', e.target.value)}
                />
              </Form.Item>
              <Form.Item label="Answer D" required>
                <Input
                  placeholder="Enter answer D"
                  value={item.answers.D}
                  onChange={(e) => updateQuestion(index, 'D', e.target.value)}
                />
              </Form.Item>
            </div>
          ))}

          <Button type="dashed" onClick={addQuestion} style={{ width: '100%' }}>
            Add Question
          </Button>

          <div className="modal-actions modal-custom-btn" style={{ marginTop: 20 }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </div>
        </Form>
      </Modal>
      <Modal
        title="Quick View - Final Test"
        open={isModalOpenListView}
        onCancel={onCloseListView}
        footer={null}
        width={600}
      >
        <div>
          <p>
            <strong>Title:</strong> {testData.title}
          </p>
          <p>
            <strong>Time Limit:</strong> {testData.timeLimit} minutes
          </p>
        </div>

        <List
          className="final-test-questions"
          dataSource={testData.questions}
          renderItem={(item, index) => (
            <List.Item>
              <div>
                <p>
                  <strong>Question {index + 1}.</strong> {item.question}
                </p>
                <ul>
                  <li>
                    <strong>A. </strong> {item.answers.A}
                  </li>
                  <li>
                    <strong>B. </strong> {item.answers.B}
                  </li>
                  <li>
                    <strong>C. </strong> {item.answers.C}
                  </li>
                  <li>
                    <strong>D. </strong> {item.answers.D}
                  </li>
                </ul>
              </div>
            </List.Item>
          )}
        />
        <div style={{ marginTop: 20, textAlign: 'right' }}>
          <Button onClick={onCloseListView}>Close</Button>
        </div>
      </Modal>
    </>
  );
};

export default Lesson;
