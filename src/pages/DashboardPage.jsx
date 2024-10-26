// src/pages/DashboardPage.jsx - דף Dashboard משודרג עם מידע מקיף ועיצוב מודרני
import React, { useContext, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { Row, Col, Card, Typography, Divider, Progress, Table, Statistic } from 'antd';
import { useMediaQuery } from 'react-responsive';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ShoppingOutlined, UserOutlined, DatabaseOutlined, FolderOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

function DashboardPage() {
  const { productData, supplierData, ingredientData, categoryData } = useContext(AppContext);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  // מידע על מוצרים לפי קטגוריה
  const productsByCategory = useMemo(() => {
    const categoryCounts = productData.reduce((acc, product) => {
      const categoryName = categoryData.find(cat => cat._id === product.category)?.name || 'לא מוגדר';
      acc[categoryName] = (acc[categoryName] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));
  }, [productData, categoryData]);

  // חומרי הגלם היקרים ביותר
  const expensiveIngredients = useMemo(() => {
    return [...ingredientData]
      .sort((a, b) => {
        const pricePerUnitA = a.isJuice ? (a.price / (a.quantity * a.juiceRatio)) : (a.price / a.quantity);
        const pricePerUnitB = b.isJuice ? (b.price / (b.quantity * b.juiceRatio)) : (b.price / b.quantity);
        return pricePerUnitB - pricePerUnitA;
      })
      .slice(0, 5)
      .map(ingredient => ({
        key: ingredient._id,
        name: ingredient.name,
        pricePerUnit: ingredient.isJuice
          ? ((ingredient.price / ingredient.quantity * ingredient.juiceRatio) * 0.1).toFixed(2)
          : ((ingredient.price / ingredient.quantity) * 0.1).toFixed(2)
      }));
  }, [ingredientData]);

  // מוצרים עם הרווחיות הנמוכה ביותר
  const lowProfitProducts = useMemo(() => {
    return productData
      .filter(product => product.profitMargin < 20)
      .slice(0, 3)
      .map(product => ({
        key: product._id,
        name: product.name,
        profitMargin: product.profitMargin.toFixed(2)
      }));
  }, [productData]);

  return (
    <div className="dashboard-container" style={{ padding: isMobile ? '10px' : '20px' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card >
            <Statistic
              title="מוצרים"
              value={productData.length}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card >
            <Statistic
              title="ספקים"
              value={supplierData.length}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card >
            <Statistic
              title="חומרי גלם"
              value={ingredientData.length}
              prefix={<DatabaseOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card >
            <Statistic
              title="קטגוריות"
              value={categoryData.length}
              prefix={<FolderOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="מוצרים לפי קטגוריה" >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productsByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {productsByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="חומרי הגלם היקרים ביותר" >
            <Table
              dataSource={expensiveIngredients}
              columns={[
                { title: 'שם', dataIndex: 'name', key: 'name' },
                { title: 'מחיר ל-100 גרם/מ"ל', dataIndex: 'pricePerUnit', key: 'pricePerUnit', render: (text) => `₪${text}` }
              ]}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card title="מוצרים עם רווחיות נמוכה" >
            <Row gutter={[16, 16]}>
              {lowProfitProducts.map(product => (
                <Col key={product.key} xs={24} sm={8}>
                  <Card >
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