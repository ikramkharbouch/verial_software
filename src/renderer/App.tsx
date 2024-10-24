import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/signin';
import AuthProvider, { useAuth } from '../auth/AuthProvider';
import PrivateRoute from '../auth/PrivateRoute';
import Dashboard from './pages/dashboard';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { ContextProvider } from '../context/Context';
import Clients from './pages/clients';
import Providers from './pages/providers';
import Articles from './pages/articles';
import Financials from './pages/financials';
import MainLayout from './components/layout';

const queryClient = new QueryClient();

function Hello() {
  return <Login />;
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster />
        <Wrapper />
        <ContextProvider>
          <QueryClientProvider client={queryClient}></QueryClientProvider>
        </ContextProvider>
      </AuthProvider>
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
        <Route path="/clients" element={<Clients />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="/providers" element={<Providers />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="/articles" element={<Articles />} />
      </Route>

      <Route path="/financials" element={<Financials />}>
        <Route path="/financials" element={<Financials />} />
      </Route>
    </Routes>
  );
};
