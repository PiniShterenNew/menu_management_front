// src/App.jsx - יישום ראשי עם עמוד Dashboard עליון ותפריט ניהול
import React, { useState, useEffect } from 'react';
import MenuPage from './pages/MenuPage';
import SuppliersPage from './pages/SuppliersPage';
import IngredientsPage from './pages/IngredientsPage';
import DashboardPage from './pages/DashboardPage';
import { AppProvider } from './context/AppContext';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import { Layout, Button, Drawer } from 'antd';
import { MenuOutlined, FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;

const isMobile = window.innerWidth <= 768;

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout className="app-container" style={{ minHeight: isMobile ? '85vh' : '100vh' }}>
          <Header className="header" style={{ padding: '0 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <h1 style={{ color: 'white', margin: 0 }}>ניהול תפריט ועץ מוצר</h1>
              <NavigationButtons />
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
      </Router>
    </AppProvider>
  );
}

function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullscreen = () => {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) { // Firefox
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) { // Chrome, Safari and Opera
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { // IE/Edge
        elem.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // עדכון המצב כשהמשתמש יוצא/נכנס למסך מלא בדרך אחרת (כמו מקש F11)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <Button onClick={handleFullscreen} type="link" style={{ color: 'white', marginLeft: '10px' }}>
      {isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
    </Button>
  );
}

function NavigationButtons() {
  const location = useLocation();
  const [drawerVisible, setDrawerVisible] = useState(false);


  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  if (isMobile) {
    // תפריט רספונסיבי לטלפונים ניידים עם Drawer
    return (
      <>
        <Button type="link" icon={<MenuOutlined />} onClick={showDrawer} style={{ color: 'white' }} />
        <Drawer
          title="ניווט"
          placement="right"
          onClose={closeDrawer}
          visible={drawerVisible}
        >
          <MobileNavMenu location={location} closeDrawer={closeDrawer} />
          <FullscreenButton />
        </Drawer>
      </>
    );
  }

  // תפריט רגיל למחשבים ומסכים גדולים יותר
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <DesktopNavMenu location={location} />
      <FullscreenButton />
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
        לוח מחוונים
      </Link>
      <Link to="/menu" style={linkStyle('/menu')} onClick={closeDrawer}>
        תפריט
      </Link>
      <Link to="/suppliers" style={linkStyle('/suppliers')} onClick={closeDrawer}>
        ספקים
      </Link>
      <Link to="/ingredients" style={linkStyle('/ingredients')} onClick={closeDrawer}>
        חומרי גלם
      </Link>
    </div>
  );
}

function DesktopNavMenu({ location }) {
  return (
    <div>
      <Button
        type="link"
        style={{
          color: location.pathname === '/' ? '#1890ff' : 'white',
          fontWeight: location.pathname === '/' ? 'bold' : 'normal',
        }}
      >
        <Link to="/" style={{ color: 'inherit' }}>לוח מחוונים</Link>
      </Button>
      <Button
        type="link"
        style={{
          color: location.pathname === '/menu' ? '#1890ff' : 'white',
          fontWeight: location.pathname === '/menu' ? 'bold' : 'normal',
        }}
      >
        <Link to="/menu" style={{ color: 'inherit' }}>תפריט</Link>
      </Button>
      <Button
        type="link"
        style={{
          color: location.pathname === '/suppliers' ? '#1890ff' : 'white',
          fontWeight: location.pathname === '/suppliers' ? 'bold' : 'normal',
        }}
      >
        <Link to="/suppliers" style={{ color: 'inherit' }}>ספקים</Link>
      </Button>
      <Button
        type="link"
        style={{
          color: location.pathname === '/ingredients' ? '#1890ff' : 'white',
          fontWeight: location.pathname === '/ingredients' ? 'bold' : 'normal',
        }}
      >
        <Link to="/ingredients" style={{ color: 'inherit' }}>חומרי גלם</Link>
      </Button>
    </div>
  );
}

export default App;
