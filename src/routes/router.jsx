import { createBrowserRouter } from 'react-router-dom';
import RequireAuth from '../auth/requireauth';
import Home from '../pages/home';
import User from '../pages/user';
import Login from '../pages/login';
import DashBoard from '../pages/dashboard';
import Category from '../pages/category';
import HistoryPayment from '../pages/historypayment';
import CourseManagement from '../pages/coursemanagement';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <RequireAuth>
        <Home />
      </RequireAuth>
    ),
    children: [
      { path: '/', element: <DashBoard /> },
      { path: 'user', element: <User /> },
      { path: 'category', element: <Category /> },
      { path: 'history-payment', element: <HistoryPayment /> },
      { path: 'course', element: <CourseManagement /> },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
]);

export default router;
