import { HashRouter as Router } from 'react-router-dom';
import { CartProvider } from './components/CartProvider';
import Header from './components/Header';
import RouterComponent from './components/Router';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton'; // Import the WhatsAppButton component

function App() {
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
