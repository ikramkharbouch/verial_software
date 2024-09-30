import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/signin';
import AuthProvider from '../auth/AuthProvider';
import PrivateRoute from '../auth/PrivateRoute';
import Dashboard from './pages/dashboard';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { ContextProvider } from '../context/Context';

const queryClient = new QueryClient();

function Hello() {
  return <Login />;
}

export default function App() {

  return (
    <>
      <Toaster />
      <Router>
        <ContextProvider>
          <AuthProvider>
            <QueryClientProvider client={queryClient}>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route element={<PrivateRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                </Route>
              </Routes>
            </QueryClientProvider>
          </AuthProvider>
        </ContextProvider>
      </Router>
    </>
  );
}
