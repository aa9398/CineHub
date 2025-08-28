import React, { useState } from 'react';
import { Trash2, Play, ShoppingCart, Search, Filter, Heart } from 'lucide-react';
import { useWatchlist } from '../../contexts/WatchlistContext';
import { useAuth } from '../../contexts/AuthContext';
import { Movie } from '../../data/movies';

interface WatchlistProps {
  onWatchTrailer: (movie: Movie) => void;
  onPurchase: (movie: Movie) => void;
}

const Watchlist: React.FC<WatchlistProps> = ({ onWatchTrailer, onPurchase }) => {
  const { user } = useAuth();
  const { watchlist, removeFromWatchlist, isPurchased, clearWatchlist } = useWatchlist();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  const genres = [...new Set(watchlist.map(movie => movie.genre))];

  const filteredWatchlist = watchlist.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = !selectedGenre || movie.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass rounded-2xl p-12 text-center max-w-md">
          <Heart className="w-16 h-16 text-netflix mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Sign In Required</h2>
          <p className="text-gray-400">
            Please sign in to view and manage your watchlist.
          </p>
        </div>
      </div>
    );
  }

  if (watchlist.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass rounded-2xl p-12 text-center max-w-md">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Your Watchlist is Empty</h2>
          <p className="text-gray-400 mb-6">
            Start adding movies and series to your watchlist to keep track of what you want to watch.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary px-6 py-3 text-white rounded-lg font-medium"
          >
            Browse Movies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass rounded-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">My Watchlist</h1>
            <p className="text-gray-400">
              {watchlist.length} {watchlist.length === 1 ? 'item' : 'items'} saved for later
            </p>
          </div>
          
          {watchlist.length > 0 && (
            <button
              onClick={clearWatchlist}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 search-container">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search your watchlist..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-netflix focus:border-transparent transition-all"
              />
            </div>
          </div>
          
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-netflix"
          >
            <option value="">All Genres</option>
            {genres.map(genre => (
              <option key={genre} value={genre} className="bg-dark-800">
                {genre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Watchlist Items */}
      <div className="space-y-6">
        {filteredWatchlist.map((movie) => (
          <div key={movie.id} className="glass rounded-xl p-6 animate-fade-in">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-48 flex-shrink-0">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-72 lg:h-64 object-cover rounded-lg"
                />
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{movie.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-3">
                      <span className="bg-white/10 text-white px-3 py-1 rounded-full">
                        {movie.genre}
                      </span>
                      <span>{movie.release_year}</span>
                      <span className="flex items-center gap-1">
                        ⭐ {movie.rating}/10
                      </span>
                      <span className="text-netflix font-semibold">${movie.price}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => removeFromWatchlist(movie.id)}
                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    title="Remove from Watchlist"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {movie.available_on.map((platform) => (
                    <span
                      key={platform}
                      className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium"
                    >
                      {platform}
                    </span>
                  ))}
                </div>

                <p className="text-gray-300 leading-relaxed">
                  {movie.description}
                </p>

                <div className="text-sm text-gray-400">
                  <p><strong>Director:</strong> {movie.director}</p>
                  <p><strong>Cast:</strong> {movie.cast.join(', ')}</p>
                  {movie.type === 'series' && (
                    <p><strong>Seasons:</strong> {movie.seasons} ({movie.episodes} episodes)</p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => onWatchTrailer(movie)}
                    className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    Watch Trailer
                  </button>
                  
                  <button
                    onClick={() => onPurchase(movie)}
                    disabled={isPurchased(movie.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                      isPurchased(movie.id)
                        ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                        : 'btn-primary text-white'
                    }`}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {isPurchased(movie.id) ? 'Already Owned' : `Buy for $${movie.price}`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredWatchlist.length === 0 && (searchTerm || selectedGenre) && (
        <div className="text-center py-16">
          <div className="glass rounded-2xl p-12 max-w-md mx-auto">
            <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">No Results Found</h3>
            <p className="text-gray-400 mb-6">
              No items in your watchlist match the current filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedGenre('');
              }}
              className="btn-primary px-6 py-3 text-white rounded-lg font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Watchlist;