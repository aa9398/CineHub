import React from 'react';
import { Film, ShoppingBag, User, LogOut, TrendingUp, Clock, Star, Calendar } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useWatchlist } from '../../contexts/WatchlistContext';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const { watchlist, purchasedMovies, getTotalSpent } = useWatchlist();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass rounded-2xl p-12 text-center max-w-md">
          <User className="w-16 h-16 text-netflix mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Sign In Required</h2>
          <p className="text-gray-400">
            Please sign in to view your dashboard.
          </p>
        </div>
      </div>
    );
  }

  const totalSpent = getTotalSpent();
  const joinDate = new Date(user.joinDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  });

  const recentPurchases = purchasedMovies.slice(-3);
  const favoriteGenres = watchlist.reduce((acc, movie) => {
    acc[movie.genre] = (acc[movie.genre] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topGenre = Object.entries(favoriteGenres).sort(([,a], [,b]) => b - a)[0];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="glass rounded-2xl p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="user-avatar w-20 h-20 rounded-full text-2xl">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome back, {user.name}!
              </h1>
              <p className="text-gray-400 text-lg">{user.email}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Member since {joinDate}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  user.subscription === 'premium' 
                    ? 'premium-badge' 
                    : 'bg-gray-600 text-white'
                }`}>
                  {user.subscription.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-blue-600 p-3 rounded-lg">
              <Film className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Watchlist</h3>
              <p className="text-gray-400 text-sm">Items saved</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{watchlist.length}</p>
        </div>

        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-green-600 p-3 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Purchased</h3>
              <p className="text-gray-400 text-sm">Movies & Series</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{purchasedMovies.length}</p>
        </div>

        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-netflix p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Total Spent</h3>
              <p className="text-gray-400 text-sm">All purchases</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-white">${totalSpent.toFixed(2)}</p>
        </div>

        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-purple-600 p-3 rounded-lg">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Favorite Genre</h3>
              <p className="text-gray-400 text-sm">Most watched</p>
            </div>
          </div>
          <p className="text-xl font-bold text-white">
            {topGenre ? topGenre[0] : 'None yet'}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div 
          className="glass rounded-xl p-8 cursor-pointer hover:bg-white/5 transition-all duration-300 group"
          onClick={() => onNavigate('watchlist')}
        >
          <div className="flex items-center gap-6 mb-6">
            <div className="bg-blue-600 p-4 rounded-xl group-hover:scale-110 transition-transform">
              <Film className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">My Watchlist</h2>
              <p className="text-gray-400">
                Movies and series you want to watch
              </p>
            </div>
          </div>
          
          <div className="text-center py-6 border-t border-white/10">
            <span className="text-4xl font-bold text-blue-400">
              {watchlist.length}
            </span>
            <p className="text-gray-400 mt-2">
              {watchlist.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
          
          <div className="text-center">
            <span className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
              View Watchlist
            </span>
          </div>
        </div>

        <div className="glass rounded-xl p-8">
          <div className="flex items-center gap-6 mb-6">
            <div className="bg-green-600 p-4 rounded-xl">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">My Library</h2>
              <p className="text-gray-400">
                Movies and series you own
              </p>
            </div>
          </div>
          
          <div className="text-center py-6 border-t border-white/10">
            <span className="text-4xl font-bold text-green-400">
              {purchasedMovies.length}
            </span>
            <p className="text-gray-400 mt-2">
              {purchasedMovies.length === 1 ? 'title' : 'titles'} owned
            </p>
          </div>

          {recentPurchases.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white mb-3">Recent Purchases</h3>
              {recentPurchases.map((movie) => (
                <div key={movie.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-12 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-white font-medium truncate">
                      {movie.title}
                    </p>
                    <p className="text-gray-400 text-sm">
                      ${movie.price} • {movie.genre}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-400">
                No purchases yet. Start building your library!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Account Settings */}
      <div className="glass rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Account Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <span className="text-gray-300">Account Type</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                user.subscription === 'premium' 
                  ? 'premium-badge' 
                  : 'bg-gray-600 text-white'
              }`}>
                {user.subscription.toUpperCase()}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <span className="text-gray-300">Member Since</span>
              <span className="text-white font-medium">{joinDate}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <span className="text-gray-300">Total Spent</span>
              <span className="text-netflix font-bold">${totalSpent.toFixed(2)}</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <span className="text-gray-300">Favorite Genre</span>
              <span className="text-white font-medium">
                {topGenre ? `${topGenre[0]} (${topGenre[1]} items)` : 'None yet'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;