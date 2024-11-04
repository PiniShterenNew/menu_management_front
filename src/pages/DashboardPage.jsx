import React, { useContext, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { Row, Col, Card, Typography, Divider, Statistic } from 'antd';
import { useMediaQuery } from 'react-responsive';
import { Doughnut, Bar } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faDatabase, faDolly, faFolder, faStore, faTruck, faUser } from '@fortawesome/free-solid-svg-icons';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js'; // ייבוא האלמנטים הנדרשים
import "./dashboard.css";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement); // רישום האלמנטים

const { Text } = Typography;
const COLORS = ['#4E79A7', '#F28E2B', '#E15759', '#76B7B2', '#59A14F'];

function DashboardPage() {
  const { categoryData } = useContext(AppContext);
  const productsState = useSelector((state) => state.products);
  const supplierState = useSelector((state) => state.suppliers);
  const ingredientsState = useSelector((state) => state.ingredients);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  const productsByCategory = useMemo(() => {
    const categoryCounts = productsState.reduce((acc, product) => {
      const categoryName = categoryData.find(cat => cat._id === product.category)?.name || 'לא מוגדר';
      acc[categoryName] = (acc[categoryName] || 0) + 1;
      return acc;
    }, {});
    return {
      labels: Object.keys(categoryCounts),
      datasets: [{
        data: Object.values(categoryCounts),
        backgroundColor: COLORS,
      }]
    };
  }, [productsState, categoryData]);

  const expensiveIngredients = useMemo(() => {
    return [...ingredientsState] // יצירת עותק של המערך
      .sort((a, b) => (b.unitPrice || 0) - (a.unitPrice || 0))
      .slice(0, 5)
      .map(ingredient => ({
        name: ingredient.name,
        price: ingredient.unitPrice,
      }));
  }, [ingredientsState]);


  const expensiveIngredientsData = {
    labels: expensiveIngredients.map(i => i.name),
    datasets: [{
      label: 'מחיר ל-100 גרם',
      data: expensiveIngredients.map(i => i.price),
      backgroundColor: '#FF8042',
    }]
  };

  const lowProfitProducts = useMemo(() => {
    return productsState
      .filter(product => product.profitMargin <= 90)
      .slice(0, 3)
      .map(product => ({
        key: product._id,
        name: product.name,
        profitMargin: product.profitMargin
      }));
  }, [productsState]);

  return (
    <div className="dashboard-container" style={{ padding: isMobile ? '10px' : '20px' }}>
      <Row gutter={[16, 16]} wrap>
        <Col xs={12} sm={12} md={10} lg={8} xl={6}>
          <Card className="dashboard-card">
            <div className="icon-circle green">
              <FontAwesomeIcon icon={faStore} />
            </div>
            <div className="stat-content">
              <div className="stat-title">מוצרים</div>
              <div className="stat-value">{productsState.length}</div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={12} md={10} lg={8} xl={6}>
          <Card className="dashboard-card">
            <div className="icon-circle red">
              <FontAwesomeIcon icon={faTruck} />
            </div>
            <div className="stat-content">
              <div className="stat-title">ספקים</div>
              <div className="stat-value">{supplierState.length}</div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={12} md={10} lg={8} xl={6}>
          <Card className="dashboard-card">
            <div className="icon-circle blue">
              <FontAwesomeIcon icon={faDolly} />
            </div>
            <div className="stat-content">
              <div className="stat-title">חומרי גלם</div>
              <div className="stat-value">{ingredientsState.length}</div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={12} md={10} lg={8} xl={6}>
          <Card className="dashboard-card">
            <div className="icon-circle yellow">
              <FontAwesomeIcon icon={faFolder} />
            </div>
            <div className="stat-content">
              <div className="stat-title">קטגוריות</div>
              <div className="stat-value">{categoryData.length}</div>
            </div>
          </Card>
        </Col>
      </Row>
      <Divider className="no-margin" />

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card
          className='dashboard-card'
            title={
              <span>
                <FontAwesomeIcon icon={faFolder} style={{ marginLeft: '8px' }} />
                מוצרים לפי קטגוריה
              </span>
            }
          >
            <Doughnut data={productsByCategory} options={{ responsive: true, maintainAspectRatio: false }} />
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
          className='dashboard-card'
            title={
              <span>
                <FontAwesomeIcon icon={faDolly} style={{ marginLeft: '8px' }} />
                חומרי הגלם היקרים ביותר
              </span>
            }
          >
            <Bar data={expensiveIngredientsData} options={{ responsive: true, maintainAspectRatio: false }} />
          </Card>
        </Col>
      </Row>

      <Divider className="no-margin" />

      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card
            title={
              <span>
                <FontAwesomeIcon icon={faStore} style={{ marginLeft: '8px' }} />
                מוצרים עם רווחיות נמוכה
              </span>
            }
          >
            <Row gutter={[16, 16]}>
              {lowProfitProducts.map(product => (
                <Col key={product.key} xs={24} sm={8}>
                  <Card>
                    <Statistic
                      title={product.name}
                      value={product.profitMargin}
                      suffix="%"
                      valueStyle={{ color: '#cf1322' }}
                    />
                    <Text type="secondary">רווחיות</Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default DashboardPage;
