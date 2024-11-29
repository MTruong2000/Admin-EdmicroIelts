import {
  RiDashboardLine,
  RiUser3Line,
  RiListCheck2,
  RiBookLine,
  RiMoneyDollarCircleLine,
  RiLogoutBoxLine,
} from "react-icons/ri";
import "./style.scss";

function Sidebar() {
  return (
    <>
      <div className="sidebar">
        <h2 className="sidebar-title">Aduca English</h2>
        <ul className="sidebar-menu">
          <li className="menu-item">
            <RiDashboardLine className="icon" /> Dashboard
          </li>
          <li className="menu-item">
            <RiUser3Line className="icon" /> Users
          </li>
          <li className="menu-item">
            <RiListCheck2 className="icon" /> Categories
          </li>
          <li className="menu-item">
            <RiBookLine className="icon" /> Courses
          </li>
          <li className="menu-item">
            <RiMoneyDollarCircleLine className="icon" /> History Payments
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
