import React, { useState } from 'react';
import MenuPage from './pages/MenuPage';
import SuppliersPage from './pages/SuppliersPage';
import IngredientsPage from './pages/IngredientsPage';
import DashboardPage from './pages/DashboardPage';
import MixesPage from "./pages/MixesPage";
import EmployeesPage from "./pages/EmployeesPage";
import WorkHoursPage from './pages/WorkHoursPage.jsx';
import { AppProvider } from './context/AppContext';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import { Layout, Button, Drawer, Image, Divider, Spin, Col } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faStore, faDolly, faTruck, faFlask, faUserTie, faClock } from '@fortawesome/free-solid-svg-icons'; // אייקון לעובדים
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
                <Route path="/mixes" element={<MixesPage />} />
                <Route path="/ingredients" element={<IngredientsPage />} />
                <Route path="/employees" element={<EmployeesPage />} />
                <Route path="/work-hours" element={<WorkHoursPage />} />
              </Routes>
            </Content>
            <Footer className="footer">© 2024 מערכת ניהול תפריט ועץ מוצר</Footer>
          </div>
          <Drawer
            title={<Col>
              <Image className='logo' src={Logo} alt='GainGuard' preview={false} />
              <p>ניווט</p>
            </Col>}
            placement="right"
            closable={true}
            onClose={() => setDrawerVisible(false)}
            open={drawerVisible}
            width={300}
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
  const linkStyle = (path) => (`text-sm font-thin ${location.pathname === path ? "" : ""}`);

  return (
    <div className='nav-desktop-child'>
      <Divider />
      <Button type="link" onClick={onClose} className={linkStyle('/')}>
        <Link to="/" className='!gap-2'>
          <FontAwesomeIcon icon={faChartLine} className='w-4 flex items-center justify-center' /> <p>לוח מחוונים</p>
        </Link>
      </Button>
      <Button type="link" onClick={onClose} className={linkStyle('/menu')}>
        <Link to="/menu" className='!gap-2'>
          <FontAwesomeIcon icon={faStore} className='w-4 flex items-center justify-center' /> <p>תפריט</p>
        </Link>
      </Button>
      <Button type="link" onClick={onClose} className={linkStyle('/mixes')}>
        <Link to="/mixes" className='!gap-2'>
          <FontAwesomeIcon icon={faFlask} className='w-4 flex items-center justify-center' /> <p>מתכונים</p>
        </Link>
      </Button>
      <Button type="link" onClick={onClose} className={linkStyle('/ingredients')}>
        <Link to="/ingredients" className='!gap-2'>
          <FontAwesomeIcon icon={faDolly} className='w-4 flex items-center justify-center' /> <p>חומרי גלם</p>
        </Link>
      </Button>
      <Button type="link" onClick={onClose} className={linkStyle('/suppliers')}>
        <Link to="/suppliers" className='!gap-2'>
          <FontAwesomeIcon icon={faTruck} className='w-4 flex items-center justify-center' /> <p>ספקים</p>
        </Link>
      </Button>
      <Button type="link" onClick={onClose} className={linkStyle('/employees')}>
        <Link to="/employees" className='!gap-2'>
          <FontAwesomeIcon icon={faUserTie} className='w-4 flex items-center justify-center' /> <p>עובדים</p>
        </Link>
      </Button>
      <Button type="link" onClick={onClose} className={linkStyle('/work-hours')}>
        <Link to="/work-hours" className='!gap-2'>
          <FontAwesomeIcon icon={faClock} className='w-4 flex items-center justify-center' /> <p>ניהול שעות עבודה</p>
        </Link>
      </Button>
    </div>
  );
}

export default App;
