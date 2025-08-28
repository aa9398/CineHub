import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { WatchlistProvider } from './contexts/WatchlistContext';
import Header from './components/layout/Header';
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import MovieCatalog from './components/movies/MovieCatalog';
import Watchlist from './components/dashboard/Watchlist';
import Dashboard from './components/dashboard/Dashboard';
import TrailerModal from './components/movies/TrailerModal';
import { Movie } from './data/movies';

function App() {
  const [currentPage, setCurrentPage] = useState('catalog');
  const [selectedTrailer, setSelectedTrailer] = useState<Movie | null>(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const handleWatchTrailer = (movie: Movie) => {
    setSelectedTrailer(movie);
    setIsTrailerOpen(true);
  };

  const closeTrailer = () => {
    setIsTrailerOpen(false);
    setSelectedTrailer(null);
  };

  const handlePurchase = (movie: Movie) => {
    // This is where Stripe integration would go
    // For now, we'll show an alert with instructions
    const message = `
🎬 Ready to purchase "${movie.title}" for $${movie.price}?

To complete this purchase, you'll need to integrate Stripe:

1. Set up your Stripe account at https://stripe.com
2. Get your API keys from the Stripe Dashboard
3. Implement Stripe Checkout or Payment Elements
4. Set up webhooks to handle successful payments
5. Update the user's purchased movies list

This is a demo - no actual payment will be processed.
    `;
    
    alert(message);
    
    // In a real app, you would:
    // 1. Create a Stripe checkout session
    // 2. Redirect user to Stripe
    // 3. Handle the webhook to confirm payment
    // 4. Add movie to purchased list
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  const handleAuthSuccess = () => {
    setCurrentPage('catalog');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'login':
        return (
          <Login
            onSwitchToSignup={() => setCurrentPage('signup')}
            onSuccess={handleAuthSuccess}
          />
        );
      case 'signup':
        return (
          <Signup
            onSwitchToLogin={() => setCurrentPage('login')}
            onSuccess={handleAuthSuccess}
          />
        );
      case 'watchlist':
        return (
          <Watchlist
            onWatchTrailer={handleWatchTrailer}
            onPurchase={handlePurchase}
          />
        );
      case 'dashboard':
        return <Dashboard onNavigate={handlePageChange} />;
      case 'catalog':
      default:
        return <MovieCatalog onPurchase={handlePurchase} />;
    }
  };

  return (
    <AuthProvider>
      <WatchlistProvider>
        <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
          <Header currentPage={currentPage} onPageChange={handlePageChange} />
          <Layout>{renderCurrentPage()}</Layout>
          
          <TrailerModal
            movie={selectedTrailer}
            isOpen={isTrailerOpen}
            onClose={closeTrailer}
          />
        </div>
      </WatchlistProvider>
    </AuthProvider>
  );
}

export default App;