import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
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

const queryClient = new QueryClient();

function Hello() {
  return <Login />;
}

export default function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
          <ContextProvider>
            <AuthProvider>
              <Toaster />
              <Wrapper />
              <webview allowpopups />
            </AuthProvider>
          </ContextProvider>
      </QueryClientProvider>
    </Router>
  );
}

const Wrapper = () => {
  const { user } = useAuth();

  return (
    <div>
      {user ? (
        <MainLayout>
          <AppRoutes />
        </MainLayout>
      ) : (
        <AppRoutes />
      )}
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="/clients" element={<Provider store={store}><Clients /></Provider>} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="/client-docs" element={<ClientDocs />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="/providers" element={<Providers />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="/providers-docs" element={<ProvidersDocs />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="/articles" element={<Articles />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="/charges" element={<Charges />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="/payments" element={<Payments />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="/made-bills" element={<MadeBills />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="/received-bills" element={<ReceivedBills />} />
      </Route>

    </Routes>
  );
};
