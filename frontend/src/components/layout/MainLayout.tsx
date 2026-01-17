// src/components/layout/MainLayout.tsx

import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { CartDrawer } from '../cart';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      <Footer />
      <CartDrawer />
    </div>
  );
};

export default MainLayout;