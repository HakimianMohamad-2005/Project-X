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
import { UserExperiences } from './components/UserExperiences';
import { B2BSection } from './components/B2BSection';
import { AuthorBio } from './components/AuthorBio';
import { CartDrawer } from './components/CartDrawer';
import { SamplePdfModal } from './components/SamplePdfModal';
import { PaymentGatewayModal } from './components/PaymentGatewayModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { SeoManager } from './components/SeoManager';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';
import { VisitorProvider, useVisitor } from './context/VisitorContext';
import { HomeStory } from './components/experience/HomeStory';
import { IntroCurtain } from './components/experience/IntroCurtain';
import { AmbientLayer } from './components/experience/AmbientLayer';
import { Container } from './components/ui/kit';

import { CartItem, Order, OrderCustomerInfo, ActiveTab, ThemeMode } from './types';
import { BOOKS_DATA, BUNDLE_DATA } from './data/bookData';
import { motion, AnimatePresence } from 'motion/react';
import { saveOrderToApi, fetchRecentOrdersFromApi } from './lib/api';
import { computeCartTotals } from './lib/cart';

function parseRouteFromPath(pathname: string) {
  let targetLang = 'fa';
  if (pathname === '/ar' || pathname.startsWith('/ar/')) {
    targetLang = 'ar';
  } else if (pathname === '/hi' || pathname.startsWith('/hi/')) {
    targetLang = 'hi';
  } else if (pathname === '/ja' || pathname.startsWith('/ja/')) {
    targetLang = 'ja';
  } else if (pathname === '/zh' || pathname.startsWith('/zh/')) {
    targetLang = 'zh';
  } else if (pathname === '/fr' || pathname.startsWith('/fr/')) {
    targetLang = 'fr';
  } else if (pathname === '/de' || pathname.startsWith('/de/')) {
    targetLang = 'de';
  } else if (pathname === '/es' || pathname.startsWith('/es/')) {
    targetLang = 'es';
  } else if (pathname === '/en' || pathname.startsWith('/en/')) {
    targetLang = 'en';
  }

  let tab: ActiveTab = 'books';
  if (pathname.includes('/admin') || pathname.endsWith('/admin')) {
    tab = 'admin';
  } else if (pathname.includes('/manager-assessment') || pathname.includes('/quiz')) {
    tab = 'quiz';
  } else if (pathname.includes('/user-experiences') || pathname.includes('/reviews')) {
    tab = 'user-experiences';
  }

  return { targetLang, tab };
}

function MainAppContent() {
  const { i18n } = useTranslation();
  const { recordNavigation } = useVisitor();

  // Initialize tab and language from URL pathname
  const initialRoute = parseRouteFromPath(typeof window !== 'undefined' ? window.location.pathname : '/');
  const [activeTab, setActiveTab] = useState<ActiveTab>(initialRoute.tab);
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = window.localStorage.getItem('og3-theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      // Storage unavailable (private mode) — fall back to the brand default.
    }
    return 'dark';
  });

  // Opening title plays once per browser session, only when landing on the homepage.
  const [introState, setIntroState] = useState<'playing' | 'opening' | 'done'>(() => {
    try {
      const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (initialRoute.tab !== 'books' || reduced || window.sessionStorage.getItem('og3-intro-seen')) return 'done';
      return 'playing';
    } catch {
      return 'done';
    }
  });

  useEffect(() => {
    if (introState !== 'done') return;
    try {
      window.sessionStorage.setItem('og3-intro-seen', '1');
    } catch {
      // Without storage the intro simply plays again next time.
    }
  }, [introState]);

  // Handle popstate for / /en /es /de /fr /zh /ja /hi /ar and /manager-assessment /admin navigation
  useEffect(() => {
    const handlePopState = () => {
      const { targetLang, tab } = parseRouteFromPath(window.location.pathname);
      if (i18n.language !== targetLang) {
        i18n.changeLanguage(targetLang);
        syncDocumentDirAndLang(targetLang);
      }
      setActiveTab(tab);
      recordNavigation(window.location.pathname, tab);
    };

    // Also sync on initial mount if URL had language prefix
    if (initialRoute.targetLang !== i18n.language) {
      i18n.changeLanguage(initialRoute.targetLang);
      syncDocumentDirAndLang(initialRoute.targetLang);
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [i18n, recordNavigation, initialRoute.targetLang]);

  const handleTabSelect = (tab: ActiveTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const currentLang = i18n.language || 'fa';
    const langPrefix = currentLang === 'fa' ? '' : `/${currentLang}`;
    let newPath = langPrefix || '/';
    if (tab === 'admin') {
      newPath = currentLang === 'fa' ? '/admin' : `${langPrefix}/admin`;
    } else if (tab === 'quiz') {
      newPath = currentLang === 'fa' ? '/manager-assessment' : `${langPrefix}/manager-assessment`;
    } else if (tab === 'user-experiences') {
      newPath = currentLang === 'fa' ? '/user-experiences' : `${langPrefix}/user-experiences`;
    }

    if (window.location.pathname !== newPath) {
      window.history.pushState({}, '', newPath);
    }
    recordNavigation(newPath, tab);
  };

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSamplePdfOpen, setIsSamplePdfOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  // Toggle Theme Function
  const handleToggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try {
        window.localStorage.setItem('og3-theme', next);
      } catch {
        // Ignore storage failures; the toggle still works for this visit.
      }
      return next;
    });
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
        // Immutable update: the updater may run twice under StrictMode.
        return prev.map((item, idx) =>
          idx !== existingIdx
            ? item
            : {
                ...item,
                quantity: item.quantity + 1,
                ...(customAuthorSignature ? { authorSignatureRequested: true, recipientName } : {}),
              }
        );
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

  const handleUpdateCartQuantity = (id: string, delta: number) => {
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

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCheckout = (customerInfo: OrderCustomerInfo, promoPercent: number) => {
    // Same pricing the drawer showed, including promo and shipping.
    setPayableAmount(computeCartTotals(cartItems, promoPercent).total);
    setPendingCustomerInfo(customerInfo);
    setIsCartOpen(false);
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = (newOrder: Order) => {
    // The payment window stays open on its receipt; the cart is emptied now.
    saveOrderToApi(newOrder);
    setRecentOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip bg-canvas text-ink transition-colors duration-300 selection:bg-[#B87333] selection:text-white antialiased">

      {introState !== 'done' && (
        <IntroCurtain
          onOpening={() => setIntroState('opening')}
          onDone={() => setIntroState('done')}
        />
      )}
      <AmbientLayer theme={theme} />

      {/* Dynamic SEO Manager for Title, Meta, Canonical & Open Graph */}
      <SeoManager activeTab={activeTab} />

      {/* Sticky Top Navigation with Theme Toggle and Tab Switcher */}
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabSelect}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        cartCount={cartItems.reduce((a, b) => a + b.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenSamplePdf={() => setIsSamplePdfOpen(true)}
      />

      {/* Cinematic homepage: hero + the 97% / 3% story */}
      {activeTab === 'books' && (
        <>
          <Hero
            theme={theme}
            onAddToCart={handleAddToCart}
            onOpenSamplePdf={() => setIsSamplePdfOpen(true)}
            onTabChange={handleTabSelect}
            revealed={introState !== 'playing'}
          />
          <HomeStory onTabChange={handleTabSelect} theme={theme} />
        </>
      )}

      {/* Main Tabbed Content Area with Smooth Motion Transitions */}
      {/* Each page brings its own header and container. */}
      <main className="min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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

            {activeTab === 'user-experiences' && (
              <UserExperiences theme={theme} />
            )}

            {activeTab === 'faq' && (
              <FAQSection
                theme={theme}
                onSelectTab={handleTabSelect}
                onOpenSamplePdf={() => setIsSamplePdfOpen(true)}
              />
            )}

            {activeTab === 'b2b' && (
              <B2BSection theme={theme} />
            )}

            {activeTab === 'author' && (
              <AuthorBio theme={theme} />
            )}

            {/* Confidential Admin Telemetry Dashboard */}
            {activeTab === 'admin' && (
              <Container className="py-10">
                <AdminDashboard
                  onBackToSite={() => handleTabSelect('books')}
                  theme={theme}
                />
              </Container>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer with Public-Only Visitor Counter and Secret Admin Gate */}
      <Footer
        theme={theme}
        onTabChange={handleTabSelect}
        onOpenAdmin={() => handleTabSelect('admin')}
      />

      {/* Global Interactive Modals & Drawers */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={handleCheckout}
        onBrowseBooks={() => {
          setIsCartOpen(false);
          handleTabSelect('books');
        }}
      />

      <SamplePdfModal
        isOpen={isSamplePdfOpen}
        onClose={() => setIsSamplePdfOpen(false)}
      />

      <PaymentGatewayModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        amount={payableAmount}
        customerInfo={pendingCustomerInfo}
        cartItems={cartItems}
        onPaymentSuccess={handlePaymentSuccess}
        onViewTracking={() => {
          setIsPaymentOpen(false);
          setIsTrackingOpen(true);
        }}
      />

      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        recentOrders={recentOrders}
      />

    </div>
  );
}

export default function App() {
  return (
    <VisitorProvider>
      <MainAppContent />
    </VisitorProvider>
  );
}
