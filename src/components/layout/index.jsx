import { useState } from 'react';
import Sidebar from '../sidebar';
import Header from '../header';
import { Outlet } from 'react-router-dom';
import './style.scss';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  return (
    <>
      <div className="layout">
        {isSidebarOpen && <Sidebar />}
        <div className="block-main-layout">
          <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <div className={`main-content-body ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
