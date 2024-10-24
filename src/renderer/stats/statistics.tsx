import React from 'react';
import { Row, Col, Card } from 'antd';
import InventoryOverview from './inventory';
import Financials from './financials';
import Providers from './providers';
import ArticlesPerformanceBarChart from './articles';
import InvoiceStatusPieChart from './financials';

const Statistics: React.FC = () => {
  return (
    <div className="charts">
      <div className="bar-container">
        <h2>Inventory Overview</h2>
        <InventoryOverview />
      </div>

      <div className="line-container">
      <h2>Financial Snapshot</h2>
        <InvoiceStatusPieChart />
      </div>

      <div className="pie-container">
      <h2>Providers Overview (Invoices)</h2>
      <p>Pending Orders: 54</p>
        <Providers />
        
      </div>

      <div className="bar-container" id="articles">
        <h2>Articles Performance</h2>
        <ArticlesPerformanceBarChart />
      </div>
    </div>
  );
};

export default Statistics;
