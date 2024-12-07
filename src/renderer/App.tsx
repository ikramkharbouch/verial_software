import {
  MemoryRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import './App.css';
import Login from './pages/signin';
import AuthProvider, { useAuth } from '../auth/AuthProvider';
import PrivateRoute from '../auth/PrivateRoute';
import Dashboard from './pages/dashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ContextProvider } from '../context/Context';
import Clients from './pages/clients';
import Providers from './pages/providers';
import Articles from './pages/articles';
import MainLayout from './components/layout';
import ClientDocs from './pages/client-docs';
import ProvidersDocs from './pages/providers-docs';
import Charges from './components/financials/charges';
import Payments from './components/financials/payments';
import MadeBills from './components/financials/made-bills';
import ReceivedBills from './components/financials/received-bills';
import { Provider } from 'react-redux';
import { store } from '@store/store';
import ProfilePage from './pages/profile';
import SignupPage from './pages/signup';
import SignIn from './pages/signin';
import React, { useEffect, useState } from 'react';

const queryClient = new QueryClient();

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <QueryClientProvider client={queryClient}>
          <ContextProvider>
            <AuthProvider>
              <Toaster />
              {/* <Route element={<PrivateRoute />}> */}
              <Routes>
                {/* Public Routes */}
                {/* <Route path="/" element={<SignIn />} /> */}
                <Route path="/login" element={<SignIn />} />

                {/* Private Routes */}
                <Route element={<PrivateRoute />}>
                  {/* MainLayout wrapping all private routes */}
                  <Route element={<MainLayout />}>
                  <Route path="/" element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/clients" element={<Clients />} />
                    <Route path="/client-docs" element={<ClientDocs />} />
                    <Route path="/providers" element={<Providers />} />
                    <Route path="/providers-docs" element={<ProvidersDocs />} />
                    <Route path="/articles" element={<Articles />} />
                    <Route path="/charges" element={<Charges />} />
                    <Route path="/payments" element={<Payments />} />
                    <Route path="/made-bills" element={<MadeBills />} />
                    <Route path="/received-bills" element={<ReceivedBills />} />
                    <Route path="/profile" element={<ProfilePage />} />
                  </Route>
                </Route>
              </Routes>
              {/* </Route> */}
              <webview allowpopups />
            </AuthProvider>
          </ContextProvider>
        </QueryClientProvider>
      </Router>
    </Provider>
  );
}

const Wrapper = ({ items }: any) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Add a spinner or styled loader if needed
  }

  console.log('Wrapper debug:', isAuthenticated);

  return (
    <>
      {/* Always render children */}
      {items}
    </>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Private Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/client-docs" element={<ClientDocs />} />
        <Route path="/providers" element={<Providers />} />
        <Route path="/providers-docs" element={<ProvidersDocs />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/charges" element={<Charges />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/made-bills" element={<MadeBills />} />
        <Route path="/received-bills" element={<ReceivedBills />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Catch-All Route */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};
