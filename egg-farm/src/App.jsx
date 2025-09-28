import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import EggProduction from './pages/EggProduction';
import SalesOrder from './pages/SalesOrder';
import FeedInventory from './pages/FeedInventory';
import TaskScheduling from './pages/TaskScheduling';
import FinancialManagement from './pages/FinancialManagement';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import SignIn from './pages/SignIn';
import Register from './pages/Register';
import UserManagement from './pages/UserManagement';
import SearchResults from './pages/SearchResults';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Routes>
      {/* Auth pages without layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/register" element={<Register />} />
      
      {/* Admin pages */}
      <Route path="/admin" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      
      {/* Main app pages with layout - protected */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout><Home /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/egg-production" element={
        <ProtectedRoute>
          <Layout><EggProduction /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/sales-order" element={
        <ProtectedRoute>
          <Layout><SalesOrder /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/feed-inventory" element={
        <ProtectedRoute>
          <Layout><FeedInventory /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/task-scheduling" element={
        <ProtectedRoute>
          <Layout><TaskScheduling /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/financial-management" element={
        <ProtectedRoute>
          <Layout><FinancialManagement /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/about" element={
        <ProtectedRoute>
          <Layout><About /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/services" element={
        <ProtectedRoute>
          <Layout><Services /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/contact" element={
        <ProtectedRoute>
          <Layout><Contact /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/user-management" element={
        <ProtectedRoute requireAdmin={true}>
          <Layout><UserManagement /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/search" element={
        <ProtectedRoute>
          <Layout><SearchResults /></Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;