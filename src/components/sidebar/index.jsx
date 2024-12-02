import {
  RiDashboardLine,
  RiUser3Line,
  RiListCheck2,
  RiBookLine,
  RiMoneyDollarCircleLine,
  RiLogoutBoxLine,
} from 'react-icons/ri';
import { Link } from 'react-router-dom';
import './style.scss';

function Sidebar() {
  return (
    <>
      <div className="sidebar">
        <h2 className="sidebar-title">Aduca English</h2>
        <ul className="sidebar-menu">
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
          <li className="menu-item logout-item">
            <RiLogoutBoxLine className="icon" /> Logout
          </li>
        </ul>
      </div>
    </>
  );
}

export default Sidebar;
