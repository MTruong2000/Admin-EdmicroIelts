import {
  RiDashboardLine,
  RiUser3Line,
  RiListCheck2,
  RiBookLine,
  RiMoneyDollarCircleLine,
  RiLogoutBoxLine,
} from 'react-icons/ri';
import { FaRegFileAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import './style.scss';
import Swal from 'sweetalert2';

function Sidebar() {
  const userRole = Cookies.get('userRole');
  const navigate = useNavigate();

  const handleLogout = async () => {
    const jwtToken = Cookies.get('jwtToken');
    const refreshToken = Cookies.get('refreshToken');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_DOMAIN}api/User/Logout?refreshToken=${refreshToken}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        },
      );

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: response.data,
        showConfirmButton: false,
        timer: 1500,
      });

      const cookies = document.cookie.split(';');

      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;

        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/';
      }

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      Swal.fire({
        title: 'Login Fail ?',
        text: error.response.data,
        icon: 'error',
      });
      console.error('Login error:', error.response.data);
    }
  };
  return (
    <>
      <div className="sidebar">
        <h2 className="sidebar-title">Aduca English</h2>
        <ul className="sidebar-menu">
          {userRole === 'Admin' ? (
            <>
              <li className="menu-item">
                <Link className="" to={`/`}>
                  <RiDashboardLine className="icon" />
                  Dashboard
                </Link>
              </li>
              <li className="menu-item">
                <Link className="" to={`/user`}>
                  <RiUser3Line className="icon" /> Users
                </Link>
              </li>
              <li className="menu-item">
                <Link className="" to={`/category`}>
                  <RiListCheck2 className="icon" /> Categories
                </Link>
              </li>
              <li className="menu-item">
                <Link className="" to={`/course`}>
                  <RiBookLine className="icon" /> Courses
                </Link>
              </li>
              <li className="menu-item">
                <Link className="" to={`/history-payment`}>
                  <RiMoneyDollarCircleLine className="icon" /> History Payments
                </Link>
              </li>
            </>
          ) : null}
          <li className="menu-item">
            <Link className="" to={`/course-teacher`}>
              <RiBookLine className="icon" /> Course Teacher
            </Link>
          </li>
          <li className="menu-item">
            <Link className="" to={`/history-payment`}>
              <FaRegFileAlt className="icon" /> Test
            </Link>
          </li>
          <li className="menu-item logout-item" onClick={handleLogout}>
            <RiLogoutBoxLine className="icon" /> Logout
          </li>
        </ul>
      </div>
    </>
  );
}

export default Sidebar;
