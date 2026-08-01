import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { syncDocumentDirAndLang } from './i18n/config';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FrameworkExplorer } from './components/FrameworkExplorer';
import { OrangutanQuiz } from './components/OrangutanQuiz';
import { CaseStudies } from './components/CaseStudies';
import { DecisionCards } from './components/DecisionCards';
import { MistakesAndLessons } from './components/MistakesAndLessons';
import { FAQSection } from './components/FAQSection';
import { ProductPricing } from './components/ProductPricing';
import { B2BSection } from './components/B2BSection';
import { AuthorBio } from './components/AuthorBio';
import { CartDrawer } from './components/CartDrawer';
import { SamplePdfModal } from './components/SamplePdfModal';
import { PaymentGatewayModal } from './components/PaymentGatewayModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { Footer } from './components/Footer';

import { CartItem, Order, OrderCustomerInfo, ActiveTab, ThemeMode } from './types';
import { BOOKS_DATA, BUNDLE_DATA } from './data/bookData';
import { motion, AnimatePresence } from 'motion/react';
import { saveOrderToApi, fetchRecentOrdersFromApi } from './lib/api';

export default function App() {
  const { i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<ActiveTab>('books');
  const [theme, setTheme] = useState<ThemeMode>('light');

  // Handle popstate for / /en /es /de navigation
  useEffect(() => {
    const handlePopState = () => {
      const pathname = window.location.pathname;
      let targetLang = 'fa';
      if (pathname === '/de' || pathname.startsWith('/de/')) {
        targetLang = 'de';
      } else if (pathname === '/es' || pathname.startsWith('/es/')) {
        targetLang = 'es';
      } else if (pathname === '/en' || pathname.startsWith('/en/')) {
        targetLang = 'en';
      }
      if (i18n.language !== targetLang) {
        i18n.changeLanguage(targetLang);
        syncDocumentDirAndLang(targetLang);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [i18n]);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSamplePdfOpen, setIsSamplePdfOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  // Toggle Theme Function
  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    // Update HTML root attributes for dark/light mode background
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }, [theme]);

  // Sync orders from MySQL API on app mount
  useEffect(() => {
    fetchRecentOrdersFromApi().then((orders) => {
      if (orders && orders.length > 0) {
        setRecentOrders(orders);
      }
    });
  }, []);

  // Checkout State
  const [pendingCustomerInfo, setPendingCustomerInfo] = useState<OrderCustomerInfo>({
    fullName: '',
    phone: '',
    province: 'تهران',
    city: 'تهران',
    address: '',
    postalCode: '',
    invoiceType: 'real'
  });
  const [payableAmount, setPayableAmount] = useState(0);

  // Orders History
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  // Add Item to Cart
  const handleAddToCart = (bookId: string, customAuthorSignature = false, recipientName = '') => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex((item) => item.bookId === bookId);

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += 1;
        if (customAuthorSignature) {
          updated[existingIdx].authorSignatureRequested = true;
          updated[existingIdx].recipientName = recipientName;
        }
        return updated;
      }

      let newCartItem: CartItem;

      if (bookId === 'bundle-full') {
        newCartItem = {
          id: `bundle-${Date.now()}`,
          bookId: 'bundle-full',
          title: BUNDLE_DATA.title,
          price: BUNDLE_DATA.bundlePrice,
          originalPrice: BUNDLE_DATA.originalPrice,
          quantity: 1,
          authorSignatureRequested: customAuthorSignature,
          recipientName: recipientName
        };
      } else if (bookId === 'vol-1') {
        newCartItem = {
          id: `vol1-${Date.now()}`,
          bookId: 'vol-1',
          title: BOOKS_DATA[0].title,
          price: BOOKS_DATA[0].price,
          originalPrice: BOOKS_DATA[0].originalPrice,
          quantity: 1,
          authorSignatureRequested: false
        };
      } else {
        newCartItem = {
          id: `vol2-${Date.now()}`,
          bookId: 'vol-2',
          title: BOOKS_DATA[1].title,
          price: BOOKS_DATA[1].price,
          originalPrice: BOOKS_DATA[1].originalPrice,
          quantity: 1,
          authorSignatureRequested: false
        };
      }

      return [...prev, newCartItem];
    });

    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleProceedToPayment = (customerInfo: OrderCustomerInfo, promoDiscountPercent: number) => {
    const rawTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const promoDiscountAmount = Math.round(rawTotal * (promoDiscountPercent / 100));
    const hasBundle = cartItems.some((item) => item.bookId === 'bundle-full');
    const shippingCost = hasBundle || rawTotal > 600000 ? 0 : 35000;
    const finalTotal = Math.max(0, rawTotal - promoDiscountAmount + shippingCost);

    setPayableAmount(finalTotal);
    setPendingCustomerInfo(customerInfo);
    setIsCartOpen(false);
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = (newOrder: Order) => {
    saveOrderToApi(newOrder);
    setRecentOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    setIsPaymentOpen(false);
    setIsTrackingOpen(true);
  };

  const isLight = theme === 'light';

  return (
    <div className={`min-h-screen w-full max-w-full overflow-x-hidden transition-colors duration-300 selection:bg-[#B87333] selection:text-white antialiased ${
      isLight ? 'bg-[#FAF8F5] text-stone-900' : 'bg-[#121314] text-[#FAF7F2]'
    }`}>
      
      {/* Sticky Top Navigation with Theme Toggle and Tab Switcher */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        cartCount={cartItems.reduce((a, b) => a + b.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenSamplePdf={() => setIsSamplePdfOpen(true)}
      />

      {/* Hero Section Banner - Rendered on main books tab */}
      {activeTab === 'books' && (
        <Hero
          theme={theme}
          onAddToCart={handleAddToCart}
          onOpenSamplePdf={() => setIsSamplePdfOpen(true)}
          onTabChange={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* Main Tabbed Content Area with Smooth Motion Transitions */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === 'books' && (
              <ProductPricing onAddToCart={handleAddToCart} theme={theme} />
            )}

            {activeTab === 'framework' && (
              <FrameworkExplorer theme={theme} />
            )}

            {activeTab === 'case-studies' && (
              <CaseStudies theme={theme} />
            )}

            {activeTab === 'quiz' && (
              <OrangutanQuiz onAddToCart={handleAddToCart} theme={theme} />
            )}

            {activeTab === 'cards' && (
              <DecisionCards theme={theme} />
            )}

            {activeTab === 'mistakes-lessons' && (
              <MistakesAndLessons theme={theme} />
            )}

            {activeTab === 'faq' && (
              <FAQSection
                theme={theme}
                onSelectTab={(tab) => {
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenSamplePdf={() => setIsSamplePdfOpen(true)}
              />
            )}

            {activeTab === 'b2b' && (
              <B2BSection theme={theme} />
            )}

            {activeTab === 'author' && (
              <AuthorBio theme={theme} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer
        theme={theme}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToPayment={handleProceedToPayment}
        theme={theme}
      />

      {/* Sample PDF Download Modal */}
      <SamplePdfModal
        isOpen={isSamplePdfOpen}
        onClose={() => setIsSamplePdfOpen(false)}
        theme={theme}
      />

      {/* Payment Gateway Simulator */}
      <PaymentGatewayModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        amount={payableAmount}
        customerInfo={pendingCustomerInfo}
        cartItems={cartItems}
        onPaymentSuccess={handlePaymentSuccess}
        theme={theme}
      />

      {/* Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        recentOrders={recentOrders}
        theme={theme}
      />

    </div>
  );
}
