import React, { useEffect } from 'react';
import { Row, Col, Card } from 'antd';
import InventoryOverview from './inventory';
import Financials from './financials';
import Providers from './providers';
import ArticlesPerformanceBarChart from './articles';
import InvoiceStatusPieChart from './financials';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchInventory,
  fetchFinance,
  fetchProviders,
  fetchArticles,
  fetchInvoicesOverview,
  fetchRevenueExpenses
} from '../../store/slices/dashboardSlice';

import type { RootState, AppDispatch } from '../../store/store'; // Adjust path to your store

const Statistics: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    inventory,
    finance,
    providers,
    articles,
    invoicesOverview,
    revenueExpenses,
    loading,
    error,
  } = useSelector((state: any) => state.dashboard);

  useEffect(() => {
    dispatch(fetchInventory());
    dispatch(fetchFinance());
    dispatch(fetchProviders());
    dispatch(fetchArticles());
    dispatch(fetchInvoicesOverview());
    dispatch(fetchRevenueExpenses());


    console.log("Revenueeee", revenueExpenses);

    console.log(providers);
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Ikram: {error}</p>;

  return (
    <div className="charts">
      <div className="bar-container">
        <h2>Inventory Overview</h2>
        <InventoryOverview data={inventory} />
      </div>

      <div className="line-container">
        <h2>Financial Snapshot</h2>
        <InvoiceStatusPieChart data={revenueExpenses} />
      </div>

      <div className="pie-container">
        <h2>Providers Overview (Invoices)</h2>
        <p>Pending Orders: 54</p>
        <Providers data={providers} />
      </div>

      <div className="bar-container" id="articles">
        <h2>Articles Performance</h2>
        <ArticlesPerformanceBarChart data={articles} />
      </div>
    </div>
  );
};

export default Statistics;
