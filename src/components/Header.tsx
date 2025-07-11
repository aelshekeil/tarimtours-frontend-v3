import { useState, FC, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, ShoppingCart, Globe, ChevronDown, LogOut, UserCircle, Sparkles, MapPin } from 'lucide-react';
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
    return `relative font-semibold transition-all duration-500 group ${
      location.pathname === path 
        ? 'text-blue-600' 
        : 'text-gray-700 hover:text-blue-700'
    }`;
  };

  const getActiveLinkUnderline = (path: string) => {
    return location.pathname === path 
      ? 'absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-100 rounded-full shadow-sm' 
      : 'absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-full shadow-sm';
  };

  return (
    <>
      <header className={`fixed w-full top-0 z-50 transition-all duration-700 ${
        isScrolled 
          ? 'bg-white/98 backdrop-blur-2xl shadow-2xl border-b border-gray-200/50' 
          : 'bg-white/90 backdrop-blur-xl shadow-lg'
      }`}>
      
        <div className="container-custom">
          <div className="flex items-center justify-between h-20">
            {/* Enhanced Logo */}
            <Link 
              to="/" 
              className="text-2xl font-bold text-blue-600 cursor-pointer flex items-center hover:text-blue-700 transition-all duration-500 transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2 rounded-xl p-2 group" 
              onClick={handleCloseMenus}
            >
              <div className="relative mr-3">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500 blur-sm scale-110"></div>
                <Globe className="relative transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" size={32} />
              </div>
              <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent font-extrabold tracking-tight">
                {t("common.tarim_tours")}
              </span>
            </Link>

            {/* Enhanced Desktop Navigation */}
            <nav className={`hidden lg:flex items-center ${i18n.language === 'ar' ? 'flex-row-reverse space-x-reverse space-x-10' : 'space-x-10'}`}>
              <Link to="/" className={`${getLinkClass('/')} py-3 px-2 text-lg`}>
                {t("common.home")}
                <span className={getActiveLinkUnderline('/')}></span>
              </Link>

              {/* Enhanced Shop Dropdown */}
              <div className="relative group">
                <button
                  onMouseEnter={() => setIsShopMenuOpen(true)}
                  onMouseLeave={() => setIsShopMenuOpen(false)}
                  className={`font-semibold transition-all duration-500 flex items-center py-3 px-2 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2 rounded-xl text-lg ${
                    location.pathname.startsWith('/shop') || location.pathname.startsWith('/esim') || location.pathname.startsWith('/accessories')
                      ? 'text-blue-600' : 'text-gray-700'
                  }`}
                >
                  {t("common.shop")}
                  <ChevronDown className={`${i18n.language === 'ar' ? 'mr-2' : 'ml-2'} h-5 w-5 transition-transform duration-500 ${
                    isShopMenuOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {isShopMenuOpen && (
                  <div 
                    className={`absolute top-full ${i18n.language === 'ar' ? 'right-0' : 'left-0'} mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 py-4 z-50 transform transition-all duration-500 opacity-100 scale-100`}
                    onMouseEnter={() => setIsShopMenuOpen(true)}
                    onMouseLeave={() => setIsShopMenuOpen(false)}
                  >
                    <div className="absolute -top-2 left-10 w-4 h-4 bg-white transform rotate-45 border-l border-t border-gray-100"></div>
                    <div className="px-4 py-2">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Shop Products</h3>
                    </div>
                    <Link 
                      to="/esim" 
                      className={`block w-full ${i18n.language === 'ar' ? 'text-right' : 'text-left'} px-6 py-4 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 transition-all duration-500 group border-l-4 border-transparent hover:border-blue-500`} 
                      onClick={handleCloseMenus}
                    >
                      <div className="font-semibold flex items-center">
                        <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mr-4 transition-all duration-500 group-hover:scale-125 group-hover:shadow-lg"></div>
                        {t("common.esim_data")}
                      </div>
                      <div className="text-sm text-gray-500 ml-7 mt-1">Global connectivity solutions</div>
                    </Link>
                    <Link 
                      to="/accessories" 
                      className={`block w-full ${i18n.language === 'ar' ? 'text-right' : 'text-left'} px-6 py-4 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 transition-all duration-500 group border-l-4 border-transparent hover:border-blue-500`} 
                      onClick={handleCloseMenus}
                    >
                      <div className="font-semibold flex items-center">
                        <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mr-4 transition-all duration-500 group-hover:scale-125 group-hover:shadow-lg"></div>
                        {t("common.travel_accessories")}
                      </div>
                      <div className="text-sm text-gray-500 ml-7 mt-1">Essential travel gear</div>
                    </Link>
                  </div>
                )}
              </div>

              <Link to="/enhanced-travel-packages" className={`${getLinkClass('/enhanced-travel-packages')} py-3 px-2 text-lg`}>
                {t("common.travel_packages")}
                <span className={getActiveLinkUnderline('/enhanced-travel-packages')}></span>
              </Link>

              {/* Enhanced Services Dropdown */}
              <div className="relative group">
                <button
                  onMouseEnter={() => setIsServicesMenuOpen(true)}
                  onMouseLeave={() => setIsServicesMenuOpen(false)}
                  className={`font-semibold transition-all duration-500 flex items-center py-3 px-2 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2 rounded-xl text-lg ${
                    location.pathname.startsWith('/visa-services') || location.pathname.startsWith('/international-driving-license') || location.pathname.startsWith('/business-incorporation')
                      ? 'text-blue-600' : 'text-gray-700'
                  }`}
                >
                  {t("common.services")}
                  <ChevronDown className={`${i18n.language === 'ar' ? 'mr-2' : 'ml-2'} h-5 w-5 transition-transform duration-500 ${
                    isServicesMenuOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {isServicesMenuOpen && (
                  <div 
                    className={`absolute top-full ${i18n.language === 'ar' ? 'right-0' : 'left-0'} mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 py-4 z-50 transform transition-all duration-500 opacity-100 scale-100`}
                    onMouseEnter={() => setIsServicesMenuOpen(true)}
                    onMouseLeave={() => setIsServicesMenuOpen(false)}
                  >
                    <div className="absolute -top-2 left-10 w-4 h-4 bg-white transform rotate-45 border-l border-t border-gray-100"></div>
                    <div className="px-4 py-2">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Our Services</h3>
                    </div>
                    <Link 
                      to="/visa-services" 
                      className={`block w-full ${i18n.language === 'ar' ? 'text-right' : 'text-left'} px-6 py-4 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 transition-all duration-500 group border-l-4 border-transparent hover:border-blue-500`} 
                      onClick={handleCloseMenus}
                    >
                      <div className="font-semibold flex items-center">
                        <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mr-4 transition-all duration-500 group-hover:scale-125 group-hover:shadow-lg"></div>
                        {t("common.visa_services")}
                      </div>
                      <div className="text-sm text-gray-500 ml-7 mt-1">Streamlined visa processing</div>
                    </Link>
                    <Link 
                      to="/international-driving-license" 
                      className={`block w-full ${i18n.language === 'ar' ? 'text-right' : 'text-left'} px-6 py-4 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 transition-all duration-500 group border-l-4 border-transparent hover:border-blue-500`} 
                      onClick={handleCloseMenus}
                    >
                      <div className="font-semibold flex items-center">
                        <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mr-4 transition-all duration-500 group-hover:scale-125 group-hover:shadow-lg"></div>
                        {t("common.international_driving_license")}
                      </div>
                      <div className="text-sm text-gray-500 ml-7 mt-1">Drive legally worldwide</div>
                    </Link>
                    <Link 
                      to="/business-incorporation" 
                      className={`block w-full ${i18n.language === 'ar' ? 'text-right' : 'text-left'} px-6 py-4 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 transition-all duration-500 group border-l-4 border-transparent hover:border-blue-500`} 
                      onClick={handleCloseMenus}
                    >
                      <div className="font-semibold flex items-center">
                        <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mr-4 transition-all duration-500 group-hover:scale-125 group-hover:shadow-lg"></div>
                        {t("common.business_incorporation")}
                      </div>
                      <div className="text-sm text-gray-500 ml-7 mt-1">Start your business globally</div>
                    </Link>
                  </div>
                )}
              </div>

              <Link to="/tracking" className={`${getLinkClass('/tracking')} py-3 px-2 text-lg`}>
                {t("common.track_application")}
                <span className={getActiveLinkUnderline('/tracking')}></span>
              </Link>

              <button
                onClick={() => scrollToSection('contact')}
                className="text-gray-700 hover:text-blue-700 font-semibold transition-all duration-500 py-3 px-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2 rounded-xl relative group text-lg"
              >
                {t("common.contact")}
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-full shadow-sm"></span>
              </button>
            </nav>
            
            {/* Enhanced Desktop Right Section */}
            <div className="hidden lg:flex items-center space-x-6">
              {/* Enhanced Language Switcher */}
              <div className="flex items-center space-x-1 bg-gradient-to-r from-gray-50 to-gray-100 rounded-full p-1 border border-gray-300 hover:border-blue-300 transition-all duration-500 shadow-sm hover:shadow-md">
                <button
                  onClick={() => { i18n.changeLanguage("en"); localStorage.setItem('i18nextLng', 'en'); }}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-500 ${
                    i18n.language === "en" 
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105" 
                      : "text-gray-600 hover:text-blue-600 hover:bg-white hover:shadow-sm"
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => { i18n.changeLanguage("ar"); localStorage.setItem('i18nextLng', 'ar'); }}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-500 ${
                    i18n.language === "ar" 
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105" 
                      : "text-gray-600 hover:text-blue-600 hover:bg-white hover:shadow-sm"
                  }`}
                >
                  عربي
                </button>
              </div>

              {/* Enhanced Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-3 text-gray-600 hover:text-blue-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 rounded-full transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2 group shadow-sm hover:shadow-md"
              >
                <ShoppingCart size={24} className="transition-transform duration-500 group-hover:scale-110" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full h-7 w-7 flex items-center justify-center shadow-lg animate-pulse border-2 border-white">
                    {getTotalItems()}
                  </span>
                )}
              </button>

              {/* Enhanced User Section */}
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-3 text-gray-700 hover:text-blue-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 px-4 py-2 rounded-full transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2 shadow-sm hover:shadow-md"
                  >
                    <UserCircle className="w-9 h-9 text-blue-600" />
                    <span className="font-semibold">{user?.username}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-500 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-50 transform transition-all duration-500">
                      <div className="absolute -top-2 right-6 w-4 h-4 bg-white transform rotate-45 border-l border-t border-gray-100"></div>
                      <div className="px-4 py-2">
                        <p className="text-sm font-semibold text-gray-900">Welcome back!</p>
                        <p className="text-xs text-gray-500">{user?.username}</p>
                      </div>
                      <hr className="my-2 border-gray-100" />
                      <Link 
                        to="/profile" 
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 transition-all duration-500 group"
                        onClick={handleCloseMenus}
                      >
                        <User className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                        <span className="font-medium">Profile</span>
                      </Link>
                      <hr className="my-2 border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 transition-all duration-500 group"
                      >
                        <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                        <span className="font-medium">{t("common.logout")}</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white px-8 py-3 rounded-full hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 transition-all duration-500 text-sm font-bold shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2 border border-blue-500 hover:border-blue-600"
                >
                  {t("common.login")}
                </button>
              )}
            </div>

          {/* Mobile Right Section */}
            <div className="flex lg:hidden items-center space-x-4">
              {/* Mobile Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2"
              >
                <ShoppingCart size={22} className="transition-transform duration-300" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg animate-pulse">
                    {getTotalItems()}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2"
              >
                {isMenuOpen ? (
                  <X size={24} className="transition-transform duration-300 rotate-0" />
                ) : (
                  <Menu size={24} className="transition-transform duration-300" />
                )}
              </button>
            </div>
          </div>

          {/* Enhanced Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden fixed inset-0 bg-white/98 backdrop-blur-xl border-t border-gray-200 shadow-2xl animate-slide-down overflow-y-auto pt-20 pb-8">
              <div className="px-6 space-y-2">
                {/* Home Link */}
                <Link 
                  to="/" 
                  className={`block px-6 py-4 text-lg font-semibold rounded-xl transition-all duration-500 ${
                    location.pathname === '/' 
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-l-4 border-blue-600 shadow-sm' 
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 hover:shadow-sm'
                  } ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`} 
                  onClick={handleCloseMenus}
                >
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 opacity-70"></div>
                    {t("common.home")}
                  </div>
                </Link>

                {/* Shop Section */}
                <div className="px-6 py-3 bg-gray-50 rounded-xl">
                  <div className={`text-lg font-bold text-gray-800 mb-4 ${i18n.language === 'ar' ? 'text-right' : 'text-left'} flex items-center`}>
                    <ShoppingCart className="w-5 h-5 mr-2 text-blue-600" />
                    {t("common.shop")}
                  </div>
                  <div className="ml-4 space-y-2">
                    <Link 
                      to="/esim" 
                      className={`block px-5 py-3 text-base font-medium rounded-lg transition-all duration-500 ${
                        location.pathname === '/esim' 
                          ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-l-4 border-blue-600 shadow-sm' 
                          : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 hover:shadow-sm'
                      } ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`} 
                      onClick={handleCloseMenus}
                    >
                      <div className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                        {t("common.esim_data")}
                      </div>
                    </Link>
                    <Link 
                      to="/accessories" 
                      className={`block px-5 py-3 text-base font-medium rounded-lg transition-all duration-500 ${
                        location.pathname === '/accessories' 
                          ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-l-4 border-blue-600 shadow-sm' 
                          : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 hover:shadow-sm'
                      } ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`} 
                      onClick={handleCloseMenus}
                    >
                      <div className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                        {t("common.travel_accessories")}
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Travel Packages Link */}
                <Link 
                  to="/enhanced-travel-packages" 
                  className={`block px-6 py-4 text-lg font-semibold rounded-xl transition-all duration-500 ${
                    location.pathname === '/enhanced-travel-packages' 
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-l-4 border-blue-600 shadow-sm' 
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 hover:shadow-sm'
                  } ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`} 
                  onClick={handleCloseMenus}
                >
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 opacity-70"></div>
                    {t("common.travel_packages")}
                  </div>
                </Link>

                {/* Services Section */}
                <div className="px-6 py-3 bg-gray-50 rounded-xl">
                  <div className={`text-lg font-bold text-gray-800 mb-4 ${i18n.language === 'ar' ? 'text-right' : 'text-left'} flex items-center`}>
                    <User className="w-5 h-5 mr-2 text-blue-600" />
                    {t("common.services")}
                  </div>
                  <div className="ml-4 space-y-2">
                    <Link 
                      to="/visa-services" 
                      className={`block px-5 py-3 text-base font-medium rounded-lg transition-all duration-500 ${
                        location.pathname === '/visa-services' 
                          ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-l-4 border-blue-600 shadow-sm' 
                          : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 hover:shadow-sm'
                      } ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`} 
                      onClick={handleCloseMenus}
                    >
                      <div className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                        {t("common.visa_services")}
                      </div>
                    </Link>
                    <Link 
                      to="/international-driving-license" 
                      className={`block px-5 py-3 text-base font-medium rounded-lg transition-all duration-500 ${
                        location.pathname === '/international-driving-license' 
                          ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-l-4 border-blue-600 shadow-sm' 
                          : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 hover:shadow-sm'
                      } ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`} 
                      onClick={handleCloseMenus}
                    >
                      <div className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                        {t("common.international_driving_license")}
                      </div>
                    </Link>
                    <Link 
                      to="/business-incorporation" 
                      className={`block px-5 py-3 text-base font-medium rounded-lg transition-all duration-500 ${
                        location.pathname === '/business-incorporation' 
                          ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-l-4 border-blue-600 shadow-sm' 
                          : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 hover:shadow-sm'
                      } ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`} 
                      onClick={handleCloseMenus}
                    >
                      <div className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                        {t("common.business_incorporation")}
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Tracking Link */}
                <Link 
                  to="/tracking" 
                  className={`block px-6 py-4 text-lg font-semibold rounded-xl transition-all duration-500 ${
                    location.pathname === '/tracking' 
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-l-4 border-blue-600 shadow-sm' 
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 hover:shadow-sm'
                  } ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`} 
                  onClick={handleCloseMenus}
                >
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 opacity-70"></div>
                    {t("common.track_application")}
                  </div>
                </Link>

                {/* Contact Button */}
                <button
                  onClick={() => scrollToSection('contact')}
                  className={`block w-full px-6 py-4 text-lg font-semibold text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 rounded-xl transition-all duration-500 hover:shadow-sm ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}
                >
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 opacity-70"></div>
                    {t("common.contact")}
                  </div>
                </button>
                
                {/* Enhanced Mobile Language Switcher */}
                <div className="flex justify-center py-6">
                  <div className="flex items-center space-x-1 bg-gradient-to-r from-gray-50 to-gray-100 rounded-full p-2 border border-gray-300 shadow-sm">
                    <button
                      onClick={() => { i18n.changeLanguage("en"); localStorage.setItem('i18nextLng', 'en'); }}
                      className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-500 ${
                        i18n.language === "en" 
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105" 
                          : "text-gray-600 hover:text-blue-600 hover:bg-white hover:shadow-sm"
                      }`}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => { i18n.changeLanguage("ar"); localStorage.setItem('i18nextLng', 'ar'); }}
                      className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-500 ${
                        i18n.language === "ar" 
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105" 
                          : "text-gray-600 hover:text-blue-600 hover:bg-white hover:shadow-sm"
                      }`}
                    >
                      عربي
                    </button>
                  </div>
                </div>

                {/* Enhanced User Section */}
                {isLoggedIn ? (
                  <div className="border-t border-gray-200 pt-6 mt-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
                    <div className="text-center mb-4">
                      <UserCircle className="w-16 h-16 mx-auto text-blue-600 mb-2" />
                      <p className="text-lg font-semibold text-gray-800">Welcome back!</p>
                      <p className="text-sm text-gray-600">{user?.username}</p>
                    </div>
                    <Link 
                      to="/profile" 
                      className="flex items-center justify-center space-x-3 w-full px-6 py-4 mb-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 rounded-xl transition-all duration-500 font-medium shadow-sm hover:shadow-md"
                      onClick={handleCloseMenus}
                    >
                      <User className="w-5 h-5" />
                      <span>View Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center space-x-3 w-full px-6 py-4 text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 rounded-xl transition-all duration-500 font-medium shadow-sm hover:shadow-md"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>{t("common.logout")}</span>
                    </button>
                  </div>
                ) : (
                  <div className="pt-6 px-2">
                    <button
                      onClick={() => {
                        setIsAuthModalOpen(true);
                        handleCloseMenus();
                      }}
                      className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 transition-all duration-500 text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 border border-blue-500"
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
