import React, { useContext, useMemo } from 'react';
import { Row, Col, Card, Typography, Divider, Statistic } from 'antd';
import { useMediaQuery } from 'react-responsive';
import { Doughnut, Bar } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faDatabase, faDolly, faFolder, faStore, faTruck, faUser } from '@fortawesome/free-solid-svg-icons';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import "./dashboard.css";
import { Link } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const { Text } = Typography;
const COLORS = ['#4E79A7', '#F28E2B', '#E15759', '#76B7B2', '#59A14F'];

function DashboardPage() {
  const categoriesState = useSelector((state) => state.categories);
  const productsState = useSelector((state) => state.products);
  const supplierState = useSelector((state) => state.suppliers);
  const ingredientsState = useSelector((state) => state.ingredients);
  const mixesState = useSelector((state) => state.mixes);
  const employees = useSelector((state) => state.employees);
  const isMobile = useMediaQuery({ query: '(max-width: 500px)' });

  const productsByCategory = useMemo(() => {
    const categoryCounts = productsState.reduce((acc, product) => {
      const categoryName = categoriesState.find(cat => cat._id === product.category)?.name || 'לא מוגדר';
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
  }, [productsState, categoriesState]);

  const expensiveIngredients = useMemo(() => {
    return [...ingredientsState]
      .sort((a, b) => (b.unitPrice || 0) - (a.unitPrice || 0))
      .slice(0, 5)
      .map(ingredient => ({
        name: ingredient.name,
        price: ingredient.unitPrice,
      }));
  }, [ingredientsState]);

  const expensiveMixes = useMemo(() => {
    return [...mixesState]
      .map(mix => {
        const mixCostPerLiter = mix.totalCost / mix.totalWeight; // מחיר לליטר בהתחשב במשקל הכולל
        return {
          name: mix.name,
          costPerLiter: mixCostPerLiter
        };
      })
      .sort((a, b) => (b.costPerLiter || 0) - (a.costPerLiter || 0))
      .slice(0, 5);
  }, [mixesState]);

  const expensiveIngredientsData = {
    labels: expensiveIngredients.map(i => i.name),
    datasets: [{
      label: 'מחיר ל-100 גרם',
      data: expensiveIngredients.map(i => i.price),
      backgroundColor: '#FF8042',
    }]
  };

  const expensiveMixesData = {
    labels: expensiveMixes.map(mix => mix.name),
    datasets: [{
      label: 'עלות לליטר',
      data: expensiveMixes.map(mix => mix.costPerLiter),
      backgroundColor: '#8884d8',
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
      <Row gutter={[5, 5]} wrap>
        <Col xs={12} sm={12} md={10} lg={8} xl={6}>
          <Link to="/menu">
            <Card className="dashboard-card">
              <div className="icon-circle green">
                <FontAwesomeIcon icon={faStore} />
              </div>
              <div className="stat-content">
                <div className="stat-title">מוצרים</div>
                <div className="stat-value">{productsState.length}</div>
              </div>
            </Card>
          </Link>
        </Col>
        <Col xs={12} sm={12} md={10} lg={8} xl={6}>
          <Link to="/suppliers">
            <Card className="dashboard-card">
              <div className="icon-circle red">
                <FontAwesomeIcon icon={faTruck} />
              </div>
              <div className="stat-content">
                <div className="stat-title">ספקים</div>
                <div className="stat-value">{supplierState.length}</div>
              </div>
            </Card>
          </Link>
        </Col>
        <Col xs={12} sm={12} md={10} lg={8} xl={6}>
          <Link to="/ingredients">
            <Card className="dashboard-card">
              <div className="icon-circle blue">
                <FontAwesomeIcon icon={faDolly} />
              </div>
              <div className="stat-content">
                <div className="stat-title">חומרי גלם</div>
                <div className="stat-value">{ingredientsState.length}</div>
              </div>
            </Card>
          </Link>
        </Col>
        <Col xs={12} sm={12} md={10} lg={8} xl={6}>
          <Link to="/menu">
            <Card className="dashboard-card">
              <div className="icon-circle yellow">
                <FontAwesomeIcon icon={faFolder} />
              </div>
              <div className="stat-content">
                <div className="stat-title">קטגוריות</div>
                <div className="stat-value">{categoriesState.length}</div>
              </div>
            </Card>
          </Link>
        </Col>
        <Col xs={12} sm={12} md={10} lg={8} xl={6}>
          <Link to="/mixes">
            <Card className="dashboard-card">
              <div className="icon-circle purple">
                <FontAwesomeIcon icon={faBox} />
              </div>
              <div className="stat-content">
                <div className="stat-title">תערובות</div>
                <div className="stat-value">{mixesState.length}</div>
              </div>
            </Card>
          </Link>
        </Col>
        <Col xs={12} sm={12} md={10} lg={8} xl={6}>
          <Link to="/employees">
            <Card className="dashboard-card">
              <div className="icon-circle aqua">
                <FontAwesomeIcon icon={faBox} />
              </div>
              <div className="stat-content">
                <div className="stat-title">עובדים</div>
                <div className="stat-value">{employees?.length}</div>
              </div>
            </Card>
          </Link>
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
        <Col xs={24} md={12}>
          <Card
            className='dashboard-card'
            title={
              <span>
                <FontAwesomeIcon icon={faBox} style={{ marginLeft: '8px' }} />
                התערובות היקרות ביותר
              </span>
            }
          >
            <Bar data={expensiveMixesData} options={{ responsive: true, maintainAspectRatio: false }} />
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            className='dashboard-card'
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
