import Navigation from './Navigation';
import EggProductionSidebar from './EggProductionSidebar';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();
  
  // Only show sidebar on home page
  const showSidebar = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />
      <div className="flex">
        {showSidebar && <EggProductionSidebar />}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;