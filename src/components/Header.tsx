import { useState, FC, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, ShoppingCart, Globe, ChevronDown, LogOut, UserCircle } from 'lucide-react';
import AuthModal from './AuthModal';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import CartSidebar from './CartSidebar';

const Header: FC = () => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false);
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isLoggedIn, user } = useAuth();
  const { getTotalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleCloseMenus = () => {
    setIsMenuOpen(false);
    setIsShopMenuOpen(false);
    setIsServicesMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const scrollToSection = (sectionId: string) => {
    handleCloseMenus();
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('jwt');
    window.dispatchEvent(new CustomEvent('authChange'));
    setIsUserMenuOpen(false);
  };

  const getLinkClass = (path: string) => {
    return `relative font-medium transition-all duration-300 group ${
      location.pathname === path 
        ? 'text-blue-600' 
        : 'text-gray-700 hover:text-blue-700'
    }`;
  };

  const getActiveLinkUnderline = (path: string) => {
    return location.pathname === path 
      ? 'absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-100' 
      : 'absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300';
  };

  return (
    <>
      <header className={`fixed w-full top-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100' 
          : 'bg-white/80 backdrop-blur-md shadow-md'
      }`}>
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link 
              to="/" 
              className="text-2xl font-bold text-blue-600 cursor-pointer flex items-center hover:text-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2 rounded-md" 
              onClick={handleCloseMenus}
            >
              <div className="relative">
                <Globe className="mr-2 transition-transform duration-300 group-hover:rotate-12" size={28} />
                <div className="absolute inset-0 bg-blue-600 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                {t("common.tarim_tours")}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className={`hidden md:flex items-center ${i18n.language === 'ar' ? 'flex-row-reverse space-x-reverse space-x-8' : 'space-x-8'}`}>
              <Link to="/" className={`${getLinkClass('/')} py-2 px-1`}>
                {t("common.home")}
                <span className={getActiveLinkUnderline('/')}></span>
              </Link>

              {/* Shop Dropdown */}
              <div className="relative group">
                <button
                  onMouseEnter={() => setIsShopMenuOpen(true)}
                  onMouseLeave={() => setIsShopMenuOpen(false)}
                  className={`font-medium transition-all duration-300 flex items-center py-2 px-1 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2 rounded-md ${
                    location.pathname.startsWith('/shop') || location.pathname.startsWith('/esim') || location.pathname.startsWith('/accessories')
                      ? 'text-blue-600' : 'text-gray-700'
                  }`}
                >
                  {t("common.shop")}
                  <ChevronDown className={`${i18n.language === 'ar' ? 'mr-1' : 'ml-1'} h-4 w-4 transition-transform duration-300 ${
                    isShopMenuOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {isShopMenuOpen && (
                  <div 
                    className={`absolute top-full ${i18n.language === 'ar' ? 'right-0' : 'left-0'} mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 py-3 z-50 transform transition-all duration-300 opacity-100 scale-100`}
                    onMouseEnter={() => setIsShopMenuOpen(true)}
                    onMouseLeave={() => setIsShopMenuOpen(false)}
                  >
                    <div className="absolute -top-2 left-8 w-4 h-4 bg-white transform rotate-45 border-l border-t border-gray-100"></div>
                    <Link 
                      to="/esim" 
                      className={`block w-full ${i18n.language === 'ar' ? 'text-right' : 'text-left'} px-5 py-4 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 transition-all duration-300 group`} 
                      onClick={handleCloseMenus}
                    >
                      <div className="font-medium flex items-center">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 transition-all duration-300 group-hover:scale-125"></span>
                        {t("common.esim_data")}
                      </div>
                      <div className="text-sm text-gray-500 ml-5 mt-1">Global connectivity solutions</div>
                    </Link>
                    <Link 
                      to="/accessories" 
                      className={`block w-full ${i18n.language === 'ar' ? 'text-right' : 'text-left'} px-5 py-4 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 transition-all duration-300 group`} 
                      onClick={handleCloseMenus}
                    >
                      <div className="font-medium flex items-center">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 transition-all duration-300 group-hover:scale-125"></span>
                        {t("common.travel_accessories")}
                      </div>
                      <div className="text-sm text-gray-500 ml-5 mt-1">Essential travel gear</div>
                    </Link>
                  </div>
                )}
              </div>

              <Link to="/enhanced-travel-packages" className={`${getLinkClass('/enhanced-travel-packages')} py-2 px-1`}>
                {t("common.travel_packages")}
                <span className={getActiveLinkUnderline('/enhanced-travel-packages')}></span>
              </Link>

              {/* Services Dropdown */}
              <div className="relative group">
                <button
                  onMouseEnter={() => setIsServicesMenuOpen(true)}
                  onMouseLeave={() => setIsServicesMenuOpen(false)}
                  className={`font-medium transition-all duration-300 flex items-center py-2 px-1 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2 rounded-md ${
                    location.pathname.startsWith('/visa-services') || location.pathname.startsWith('/international-driving-license') || location.pathname.startsWith('/business-incorporation')
                      ? 'text-blue-600' : 'text-gray-700'
                  }`}
                >
                  {t("common.services")}
                  <ChevronDown className={`${i18n.language === 'ar' ? 'mr-1' : 'ml-1'} h-4 w-4 transition-transform duration-300 ${
                    isServicesMenuOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {isServicesMenuOpen && (
                  <div 
                    className={`absolute top-full ${i18n.language === 'ar' ? 'right-0' : 'left-0'} mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 py-3 z-50 transform transition-all duration-300 opacity-100 scale-100`}
                    onMouseEnter={() => setIsServicesMenuOpen(true)}
                    onMouseLeave={() => setIsServicesMenuOpen(false)}
                  >
                    <div className="absolute -top-2 left-8 w-4 h-4 bg-white transform rotate-45 border-l border-t border-gray-100"></div>
                    <Link 
                      to="/visa-services" 
                      className={`block w-full ${i18n.language === 'ar' ? 'text-right' : 'text-left'} px-5 py-4 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 transition-all duration-300 group`} 
                      onClick={handleCloseMenus}
                    >
                      <div className="font-medium flex items-center">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 transition-all duration-300 group-hover:scale-125"></span>
                        {t("common.visa_services")}
                      </div>
                      <div className="text-sm text-gray-500 ml-5 mt-1">Streamlined visa processing</div>
                    </Link>
                    <Link 
                      to="/international-driving-license" 
                      className={`block w-full ${i18n.language === 'ar' ? 'text-right' : 'text-left'} px-5 py-4 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 transition-all duration-300 group`} 
                      onClick={handleCloseMenus}
                    >
                      <div className="font-medium flex items-center">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 transition-all duration-300 group-hover:scale-125"></span>
                        {t("common.international_driving_license")}
                      </div>
                      <div className="text-sm text-gray-500 ml-5 mt-1">Drive legally worldwide</div>
                    </Link>
                    <Link 
                      to="/business-incorporation" 
                      className={`block w-full ${i18n.language === 'ar' ? 'text-right' : 'text-left'} px-5 py-4 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 transition-all duration-300 group`} 
                      onClick={handleCloseMenus}
                    >
                      <div className="font-medium flex items-center">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 transition-all duration-300 group-hover:scale-125"></span>
                        {t("common.business_incorporation")}
                      </div>
                      <div className="text-sm text-gray-500 ml-5 mt-1">Start your business globally</div>
                    </Link>
                  </div>
                )}
              </div>

              <Link to="/tracking" className={`${getLinkClass('/tracking')} py-2 px-1`}>
                {t("common.track_application")}
                <span className={getActiveLinkUnderline('/tracking')}></span>
              </Link>

              <button
                onClick={() => scrollToSection('contact')}
                className="text-gray-700 hover:text-blue-700 font-medium transition-all duration-300 py-2 px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2 rounded-md relative group"
              >
                {t("common.contact")}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </button>
            </nav>
            
            {/* Desktop Right Section */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Language Switcher */}
              <div className="flex items-center space-x-2 bg-gray-50 rounded-full p-1.5 border border-gray-200 hover:border-gray-300 transition-all duration-300">
                <button
                  onClick={() => { i18n.changeLanguage("en"); localStorage.setItem('i18nextLng', 'en'); }}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    i18n.language === "en" 
                      ? "bg-blue-600 text-white shadow-md" 
                      : "text-gray-600 hover:text-blue-600 hover:bg-white"
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => { i18n.changeLanguage("ar"); localStorage.setItem('i18nextLng', 'ar'); }}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    i18n.language === "ar" 
                      ? "bg-blue-600 text-white shadow-md" 
                      : "text-gray-600 hover:text-blue-600 hover:bg-white"
                  }`}
                >
                  عربي
                </button>
              </div>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-3 text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2 group"
              >
                <ShoppingCart size={22} className="transition-transform duration-300 group-hover:scale-110" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg animate-pulse">
                    {getTotalItems()}
                  </span>
                )}
              </button>

              {/* User Section */}
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-700 hover:bg-blue-50 px-3 py-2 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2"
                  >
                    <UserCircle className="w-8 h-8" />
                    <span className="font-medium">{user?.username}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 transform transition-all duration-300">
                      <div className="absolute -top-2 right-4 w-4 h-4 bg-white transform rotate-45 border-l border-t border-gray-100"></div>
                      <Link 
                        to="/profile" 
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300"
                        onClick={handleCloseMenus}
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      <hr className="my-2 border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-all duration-300"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t("common.logout")}</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2"
                >
                  {t("common.login")}
                </button>
              )}
            </div>

            {/* Mobile Right Section */}
            <div className="md:hidden flex items-center space-x-3">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2"
              >
                <ShoppingCart size={22} />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg animate-pulse">
                    {getTotalItems()}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2"
              >
                <div className="relative w-6 h-6">
                  <Menu 
                    size={24} 
                    className={`absolute transition-all duration-300 transform ${
                      isMenuOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'
                    }`} 
                  />
                  <X 
                    size={24} 
                    className={`absolute transition-all duration-300 transform ${
                      isMenuOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'
                    }`} 
                  />
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-white/95 backdrop-blur-sm border-t border-gray-200 animate-slide-down">
              <div className="px-4 pt-4 pb-6 space-y-3">
                <Link 
                  to="/" 
                  className={`block px-4 py-3 text-base font-medium rounded-lg transition-all duration-300 ${
                    location.pathname === '/' 
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' 
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                  } ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`} 
                  onClick={handleCloseMenus}
                >
                  {t("common.home")}
                </Link>

                <div className="px-4 py-2">
                  <div className={`text-base font-semibold text-gray-800 mb-3 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>
                    {t("common.shop")}
                  </div>
                  <div className="ml-4 space-y-2">
                    <Link 
                      to="/esim" 
                      className={`block px-4 py-2.5 text-sm rounded-md transition-all duration-300 ${
                        location.pathname === '/esim' 
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' 
                          : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                      } ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`} 
                      onClick={handleCloseMenus}
                    >
                      {t("common.esim_data")}
                    </Link>
                    <Link 
                      to="/accessories" 
                      className={`block px-4 py-2.5 text-sm rounded-md transition-all duration-300 ${
                        location.pathname === '/accessories' 
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' 
                          : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                      } ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`} 
                      onClick={handleCloseMenus}
                    >
                      {t("common.travel_accessories")}
                    </Link>
                  </div>
                </div>

                <Link 
                  to="/enhanced-travel-packages" 
                  className={`block px-4 py-3 text-base font-medium rounded-lg transition-all duration-300 ${
                    location.pathname === '/enhanced-travel-packages' 
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' 
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                  } ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`} 
                  onClick={handleCloseMenus}
                >
                  {t("common.travel_packages")}
                </Link>

                <div className="px-4 py-2">
                  <div className={`text-base font-semibold text-gray-800 mb-3 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>
                    {t("common.services")}
                  </div>
                  <div className="ml-4 space-y-2">
                    <Link 
                      to="/visa-services" 
                      className={`block px-4 py-2.5 text-sm rounded-md transition-all duration-300 ${
                        location.pathname === '/visa-services' 
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' 
                          : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                      } ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`} 
                      onClick={handleCloseMenus}
                    >
                      {t("common.visa_services")}
                    </Link>
                    <Link 
                      to="/international-driving-license" 
                      className={`block px-4 py-2.5 text-sm rounded-md transition-all duration-300 ${
                        location.pathname === '/international-driving-license' 
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' 
                          : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                      } ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`} 
                      onClick={handleCloseMenus}
                    >
                      {t("common.international_driving_license")}
                    </Link>
                    <Link 
                      to="/business-incorporation" 
                      className={`block px-4 py-2.5 text-sm rounded-md transition-all duration-300 ${
                        location.pathname === '/business-incorporation' 
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' 
                          : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                      } ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`} 
                      onClick={handleCloseMenus}
                    >
                      {t("common.business_incorporation")}
                    </Link>
                  </div>
                </div>

                <Link 
                  to="/tracking" 
                  className={`block px-4 py-3 text-base font-medium rounded-lg transition-all duration-300 ${
                    location.pathname === '/tracking' 
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' 
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                  } ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`} 
                  onClick={handleCloseMenus}
                >
                  {t("common.track_application")}
                </Link>

                <button
                  onClick={() => scrollToSection('contact')}
                  className={`block w-full px-4 py-3 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-300 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}
                >
                  {t("common.contact")}
                </button>
                
                {/* Mobile Language Switcher */}
                <div className="flex justify-center space-x-4 py-4">
                  <div className="flex items-center space-x-2 bg-gray-50 rounded-full p-1.5">
                    <button
                      onClick={() => { i18n.changeLanguage("en"); localStorage.setItem('i18nextLng', 'en'); }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        i18n.language === "en" 
                          ? "bg-blue-600 text-white shadow-md" 
                          : "text-gray-600 hover:text-blue-600"
                      }`}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => { i18n.changeLanguage("ar"); localStorage.setItem('i18nextLng', 'ar'); }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        i18n.language === "ar" 
                          ? "bg-blue-600 text-white shadow-md" 
                          : "text-gray-600 hover:text-blue-600"
                      }`}
                    >
                      عربي
                    </button>
                  </div>
                </div>

                {isLoggedIn ? (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <Link 
                      to="/profile" 
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-300"
                      onClick={handleCloseMenus}
                    >
                      <UserCircle className="w-6 h-6" />
                      <span className="font-medium">{user?.username}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
                    >
                      <LogOut className="w-6 h-6" />
                      <span>{t("common.logout")}</span>
                    </button>
                  </div>
                ) : (
                  <div className="pt-6">
                    <button
                      onClick={() => {
                        setIsAuthModalOpen(true);
                        handleCloseMenus();
                      }}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      {t("common.login_signup")}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
      
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
      />
    </>
  );
};

export default Header;
