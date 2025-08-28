import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Movie } from '../data/movies';
import { useAuth } from './AuthContext';

interface WatchlistContextType {
  watchlist: Movie[];
  purchasedMovies: Movie[];
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (movieId: string) => void;
  addToPurchased: (movie: Movie) => void;
  isInWatchlist: (movieId: string) => boolean;
  isPurchased: (movieId: string) => boolean;
  clearWatchlist: () => void;
  getWatchlistByGenre: (genre: string) => Movie[];
  getTotalSpent: () => number;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};

interface WatchlistProviderProps {
  children: ReactNode;
}

export const WatchlistProvider: React.FC<WatchlistProviderProps> = ({ children }) => {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [purchasedMovies, setPurchasedMovies] = useState<Movie[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const savedWatchlist = localStorage.getItem(`cinehub_watchlist_${user.id}`);
      const savedPurchased = localStorage.getItem(`cinehub_purchased_${user.id}`);
      
      if (savedWatchlist) {
        try {
          setWatchlist(JSON.parse(savedWatchlist));
        } catch (error) {
          console.error('Error parsing watchlist:', error);
        }
      }
      
      if (savedPurchased) {
        try {
          setPurchasedMovies(JSON.parse(savedPurchased));
        } catch (error) {
          console.error('Error parsing purchased movies:', error);
        }
      }
    } else {
      setWatchlist([]);
      setPurchasedMovies([]);
    }
  }, [user]);

  const addToWatchlist = (movie: Movie) => {
    if (!user) return;
    
    const newWatchlist = [...watchlist, movie];
    setWatchlist(newWatchlist);
    localStorage.setItem(`cinehub_watchlist_${user.id}`, JSON.stringify(newWatchlist));
  };

  const removeFromWatchlist = (movieId: string) => {
    if (!user) return;
    
    const newWatchlist = watchlist.filter(movie => movie.id !== movieId);
    setWatchlist(newWatchlist);
    localStorage.setItem(`cinehub_watchlist_${user.id}`, JSON.stringify(newWatchlist));
  };

  const addToPurchased = (movie: Movie) => {
    if (!user) return;
    
    const newPurchased = [...purchasedMovies, movie];
    setPurchasedMovies(newPurchased);
    localStorage.setItem(`cinehub_purchased_${user.id}`, JSON.stringify(newPurchased));
  };

  const isInWatchlist = (movieId: string) => {
    return watchlist.some(movie => movie.id === movieId);
  };

  const isPurchased = (movieId: string) => {
    return purchasedMovies.some(movie => movie.id === movieId);
  };

  const clearWatchlist = () => {
    if (!user) return;
    
    setWatchlist([]);
    localStorage.removeItem(`cinehub_watchlist_${user.id}`);
  };

  const getWatchlistByGenre = (genre: string) => {
    return watchlist.filter(movie => movie.genre === genre);
  };

  const getTotalSpent = () => {
    return purchasedMovies.reduce((total, movie) => total + movie.price, 0);
  };

  const value: WatchlistContextType = {
    watchlist,
    purchasedMovies,
    addToWatchlist,
    removeFromWatchlist,
    addToPurchased,
    isInWatchlist,
    isPurchased,
    clearWatchlist,
    getWatchlistByGenre,
    getTotalSpent
  };

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
};