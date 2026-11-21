import { ReactNode } from 'react';
import { useLocation } from 'wouter';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const isChatPage = location === '/chat';

  return (
    <div className={`flex flex-col ${isChatPage ? 'h-screen overflow-hidden' : 'min-h-screen'} font-sans bg-white text-gray-800`}>
      <Header />
      <main className={`flex-grow ${isChatPage ? 'h-[calc(100vh-64px)] overflow-hidden' : ''}`}>
        {children}
      </main>
      {!isChatPage && <Footer />}
    </div>
  );
}
