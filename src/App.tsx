import { HashRouter as Router } from 'react-router-dom';
import { CartProvider } from './components/CartProvider';
import Header from './components/Header';
import RouterComponent from './components/Router';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton'; // Import the WhatsAppButton component
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.dir();
  }, [i18n, i18n.language]);

  console.log("App component rendered");
  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="pt-16">
            <RouterComponent />
          </main>
          <Footer />
          <WhatsAppButton /> {/* Render the WhatsAppButton here */}
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
