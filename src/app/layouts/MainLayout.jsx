import { Outlet } from 'react-router-dom';
import Header from '../../shared/components/layout/Header';
import ScrollToTop from '../../shared/components/ScrollToTop';

const MainLayout = () => {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-4rem)]">
        <Outlet />
      </main>
      <ScrollToTop />
    </>
  );
};

export default MainLayout;