import React, { useState } from 'react';
import MenuPage from './pages/MenuPage';
import SuppliersPage from './pages/SuppliersPage';
import IngredientsPage from './pages/IngredientsPage';
import DashboardPage from './pages/DashboardPage';
import { AppProvider } from './context/AppContext';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import { Layout, Button, Drawer, Image, Divider, Spin, Col } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faStore, faDolly, faTruck } from '@fortawesome/free-solid-svg-icons';
import Logo from "./assets/logo.png";
import TopBar from './components/topBar/TopBar';
import { useMediaQuery } from 'react-responsive';

const { Header, Content, Footer } = Layout;

function App() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery({ query: '(max-width: 1200px)' });

  return (
    <AppProvider setLoading={setLoading}>
      <Spin fullscreen spinning={loading} size='large' />
      <Router>
        <Layout className="app-container" style={{ minHeight: isMobile ? '85vh' : '100vh' }}>
          <div className='nav-container'>
            <div className='nav-top'>
              <Image className='logo' src={Logo} alt='GainGuard' preview={false} />
            </div>
            <NavMenu />
          </div>
          <div className='body-container'>
            <Header className="header" style={{ padding: '0 20px' }}>
              <TopBar isMobile={isMobile} drawerVisible={drawerVisible} setDrawerVisible={setDrawerVisible} />
              <Divider className="no-margin" />
            </Header>
            <Content className="content">
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/suppliers" element={<SuppliersPage />} />
                <Route path="/ingredients" element={<IngredientsPage />} />
              </Routes>
            </Content>
            <Footer className="footer">© 2024 מערכת ניהול תפריט ועץ מוצר</Footer>
          </div>
          {/* Drawer לתפריט במובייל */}
          <Drawer
            title={<Col>
            <Image className='logo' src={Logo} alt='GainGuard' preview={false} />
            <p>ניווט</p>
            </Col>}
            placement="right"
            closable={true}
            onClose={() => setDrawerVisible(false)}
            visible={drawerVisible}
            width={240}
          >
            <NavMenu onClose={() => setDrawerVisible(false)} />
          </Drawer>
        </Layout>
      </Router>
    </AppProvider>
  );
}

function NavMenu({ onClose }) {
  const location = useLocation();
  const linkStyle = (path) => location.pathname === path ? "link-active" : "link";

  return (
    <div className='nav-desktop-child'>
      <Divider />
      <Button type="link" onClick={onClose} className={linkStyle('/')}>
        <Link to="/">
          <FontAwesomeIcon icon={faChartLine} /> <p>לוח מחוונים</p>
        </Link>
      </Button>
      <Button type="link" onClick={onClose} className={linkStyle('/menu')}>
        <Link to="/menu">
          <FontAwesomeIcon icon={faStore} /> <p>תפריט</p>
        </Link>
      </Button>
      <Button type="link" onClick={onClose} className={linkStyle('/ingredients')}>
        <Link to="/ingredients">
          <FontAwesomeIcon icon={faDolly} /> <p>חומרי גלם</p>
        </Link>
      </Button>
      <Button type="link" onClick={onClose} className={linkStyle('/suppliers')}>
        <Link to="/suppliers">
          <FontAwesomeIcon icon={faTruck} /> <p>ספקים</p>
        </Link>
      </Button>
    </div>
  );
}

export default App;
