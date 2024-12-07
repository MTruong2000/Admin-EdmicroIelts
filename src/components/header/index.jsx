import { CiMenuBurger } from 'react-icons/ci';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import proFileAvatarPlaceholder from '/img/Profile_avatar_placeholder.png';
import PropTypes from 'prop-types';
import './style.scss';

const Header = ({ isSidebarOpen, toggleSidebar }) => {
  const [infoAccount, setInfoAccount] = useState({});
  Header.propTypes = {
    isSidebarOpen: PropTypes.bool.isRequired,
    toggleSidebar: PropTypes.func.isRequired,
  };
  useEffect(() => {
    const jwtToken = Cookies.get('jwtToken');
    const fetchDataAccount = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_DOMAIN}api/User/Profile`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        console.log(response.data);
        Cookies.set('Uid', response.data.id, {
          expires: 30,
          path: '/',
        });
        setInfoAccount(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDataAccount();
  }, []);

  return (
    <>
      <div className="block-main-layout">
        <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
          <header className="header">
            <button className="menu-toggle" onClick={toggleSidebar}>
              <CiMenuBurger />
            </button>
            <div className="user-info">
              <i className="ri-notification-line notification-icon"></i>
              <img
                src={infoAccount.imageUrl ? infoAccount.imageUrl : proFileAvatarPlaceholder}
                alt="User Avatar"
                className="user-avatar"
              />
              <span className="user-name">{infoAccount.fullName}</span>
            </div>
          </header>
        </div>
      </div>
    </>
  );
};

export default Header;
