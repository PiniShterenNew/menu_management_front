import React, { useState } from 'react';
import MenuPage from './pages/MenuPage';
import SuppliersPage from './pages/SuppliersPage';
import IngredientsPage from './pages/IngredientsPage';
import DashboardPage from './pages/DashboardPage';
import { AppProvider } from './context/AppContext';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import { Layout, Button, Drawer, Spin } from 'antd';
import { MenuOutlined, HomeOutlined, AppstoreOutlined, ShoppingOutlined } from '@ant-design/icons';
import Loading from "./components/Loading";
import { useMediaQuery } from 'react-responsive'; // הוסף את ה-hook הזה

const { Header, Content, Footer } = Layout;

function App() {
  const [loading, setLoading] = useState(false);
  
  // שימוש ב-hook עבור בדיקה אם זה פלאפון
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  return (
    <AppProvider setLoading={setLoading}>
      <Router>
        <Loading loading={loading}>
          <Layout className="app-container" style={{ minHeight: isMobile ? '85vh' : '100vh' }}>
            <Header className="header" style={{ padding: '0 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <h1 style={{ color: 'white', margin: 0 }}>ניהול תפריט ועץ מוצר</h1>
                <NavigationButtons isMobile={isMobile} />
              </div>
            </Header>
            <Content style={{ padding: '20px' }} className="content">
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/suppliers" element={<SuppliersPage />} />
                <Route path="/ingredients" element={<IngredientsPage />} />
              </Routes>
            </Content>
            <Footer style={{ textAlign: 'center' }}>© 2024 מערכת ניהול תפריט ועץ מוצר</Footer>
          </Layout>
        </Loading>
      </Router>
    </AppProvider>
  );
}

function NavigationButtons({ isMobile }) {
  const location = useLocation();
  const [drawerVisible, setDrawerVisible] = useState(false);

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  if (isMobile) {
    return (
      <>
        <Button type="link" icon={<MenuOutlined />} onClick={showDrawer} style={{ color: 'white' }} />
        <Drawer title="ניווט" placement="right" onClose={closeDrawer} visible={drawerVisible}>
          <MobileNavMenu location={location} closeDrawer={closeDrawer} />
        </Drawer>
      </>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <DesktopNavMenu location={location} />
    </div>
  );
}

function MobileNavMenu({ location, closeDrawer }) {
  const linkStyle = (path) => ({
    display: 'block',
    width: '100%',
    padding: '10px 15px',
    textAlign: 'left',
    color: location.pathname === path ? '#1890ff' : 'black',
    fontWeight: location.pathname === path ? 'bold' : 'normal',
    textDecoration: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  });

  return (
    <div>
      <Link to="/" style={linkStyle('/')} onClick={closeDrawer}>
        <HomeOutlined /> לוח מחוונים
      </Link>
      <Link to="/menu" style={linkStyle('/menu')} onClick={closeDrawer}>
        <AppstoreOutlined /> תפריט
      </Link>
      <Link to="/ingredients" style={linkStyle('/ingredients')} onClick={closeDrawer}>
        <AppstoreOutlined /> חומרי גלם
      </Link>
      <Link to="/suppliers" style={linkStyle('/suppliers')} onClick={closeDrawer}>
        <ShoppingOutlined /> ספקים
      </Link>
    </div>
  );
}

function DesktopNavMenu({ location }) {
  return (
    <div>
      <Button type="link">
        <Link to="/">
          <HomeOutlined /> לוח מחוונים
        </Link>
      </Button>
      <Button type="link">
        <Link to="/menu">
          <AppstoreOutlined /> תפריט
        </Link>
      </Button>
      <Button type="link">
        <Link to="/ingredients">
          <AppstoreOutlined /> חומרי גלם
        </Link>
      </Button>
      <Button type="link">
        <Link to="/suppliers">
          <ShoppingOutlined /> ספקים
        </Link>
      </Button>
    </div>
  );
}

export default App;
