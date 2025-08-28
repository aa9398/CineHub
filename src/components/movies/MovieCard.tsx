import React from 'react';
import { Play, Plus, ShoppingCart, Check, Star, Clock, Calendar, Users } from 'lucide-react';
import { Movie } from '../../data/movies';
import { useAuth } from '../../contexts/AuthContext';
import { useWatchlist } from '../../contexts/WatchlistContext';

interface MovieCardProps {
  movie: Movie;
  onWatchTrailer: (movie: Movie) => void;
  onPurchase: (movie: Movie) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onWatchTrailer, onPurchase }) => {
  const { user } = useAuth();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist, isPurchased } = useWatchlist();
  const inWatchlist = isInWatchlist(movie.id);
  const purchased = isPurchased(movie.id);

  const handleWatchlistToggle = () => {
    if (!user) return;
    
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'Netflix': return 'platform-netflix';
      case 'Prime': return 'platform-prime';
      case 'Disney+': return 'platform-disney';
      case 'Hulu': return 'platform-hulu';
      default: return 'bg-gray-600';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="movie-card glass rounded-xl overflow-hidden group">
      <div className="relative">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Play Button */}
        <button
          onClick={() => onWatchTrailer(movie)}
          className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm p-3 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-netflix hover:scale-110"
          title="Watch Trailer"
        >
          <Play className="w-5 h-5" />
        </button>

        {/* Type Badge */}
        <div className="absolute top-4 left-4">
          <span className="premium-badge px-2 py-1 rounded-full text-xs font-semibold uppercase">
            {movie.type}
          </span>
        </div>

        {/* Rating */}
        <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-white text-sm font-medium">{movie.rating}</span>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{movie.title}</h3>
          
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{movie.release_year}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{movie.type === 'series' ? `${movie.seasons} seasons` : formatDuration(movie.duration)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <span className="bg-white/10 text-white px-3 py-1 rounded-full text-sm font-medium">
              {movie.genre}
            </span>
            <span className="text-2xl font-bold text-netflix">
              ${movie.price}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {movie.available_on.map((platform) => (
            <span
              key={platform}
              className={`${getPlatformColor(platform)} px-2 py-1 rounded text-xs font-semibold text-white`}
            >
              {platform}
            </span>
          ))}
        </div>

        <p className="text-gray-300 text-sm line-clamp-3 leading-relaxed">
          {movie.description}
        </p>

        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Users className="w-4 h-4" />
          <span>Directed by {movie.director}</span>
        </div>

        <div className="flex gap-2 pt-4">
          {user && (
            <button
              onClick={handleWatchlistToggle}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                inWatchlist 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              {inWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span className="text-sm">
                {inWatchlist ? 'Added' : 'My List'}
              </span>
            </button>
          )}
          
          <button
            onClick={() => onPurchase(movie)}
            disabled={purchased}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              purchased 
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                : 'btn-primary text-white'
            }`}
            title={purchased ? 'Already Purchased' : `Buy/Rent for $${movie.price}`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="text-sm">
              {purchased ? 'Owned' : 'Buy'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;