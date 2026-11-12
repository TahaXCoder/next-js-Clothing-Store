import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import MobileMenuOverlay from '@/components/MobileMenuOverlay';
import SearchOverlay from '@/components/SearchOverlay';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'ZIPUP | Fashion Store',
  description: 'Shop the latest fashion at ZipUp',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <MobileMenuOverlay />
            <SearchOverlay />
            <CartDrawer />
            {children}
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}