import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import FullPageLayout from './components/FullPageLayout';
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
import AdminDashboardManagement from './pages/AdminDashboardManagement';
import ReportGeneration from './pages/ReportGeneration';

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
      <Route path="/admin/dashboard-management" element={
        <ProtectedRoute requireAdmin={true}>
          <FullPageLayout><AdminDashboardManagement /></FullPageLayout>
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
          <FullPageLayout><EggProduction /></FullPageLayout>
        </ProtectedRoute>
      } />
      <Route path="/sales-order" element={
        <ProtectedRoute>
          <FullPageLayout><SalesOrder /></FullPageLayout>
        </ProtectedRoute>
      } />
      <Route path="/feed-inventory" element={
        <ProtectedRoute>
          <FullPageLayout><FeedInventory /></FullPageLayout>
        </ProtectedRoute>
      } />
      <Route path="/task-scheduling" element={
        <ProtectedRoute>
          <FullPageLayout><TaskScheduling /></FullPageLayout>
        </ProtectedRoute>
      } />
      <Route path="/financial-management" element={
        <ProtectedRoute>
          <FullPageLayout><FinancialManagement /></FullPageLayout>
        </ProtectedRoute>
      } />
      <Route path="/about" element={
        <ProtectedRoute>
          <FullPageLayout><About /></FullPageLayout>
        </ProtectedRoute>
      } />
      <Route path="/services" element={
        <ProtectedRoute>
          <FullPageLayout><Services /></FullPageLayout>
        </ProtectedRoute>
      } />
      <Route path="/contact" element={
        <ProtectedRoute>
          <FullPageLayout><Contact /></FullPageLayout>
        </ProtectedRoute>
      } />
      <Route path="/user-management" element={
        <ProtectedRoute requireAdmin={true}>
          <FullPageLayout><UserManagement /></FullPageLayout>
        </ProtectedRoute>
      } />
      <Route path="/search" element={
        <ProtectedRoute>
          <FullPageLayout><SearchResults /></FullPageLayout>
        </ProtectedRoute>
      } />
      <Route path="/reports" element={
        <ProtectedRoute>
          <FullPageLayout><ReportGeneration /></FullPageLayout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;