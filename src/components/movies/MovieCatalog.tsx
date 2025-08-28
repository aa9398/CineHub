import React, { useState, useMemo } from 'react';
import { Search, Filter, Grid, List, TrendingUp } from 'lucide-react';
import { movies, Movie, genres, platforms } from '../../data/movies';
import MovieCard from './MovieCard';
import TrailerModal from './TrailerModal';

interface MovieCatalogProps {
  onPurchase: (movie: Movie) => void;
}

const MovieCatalog: React.FC<MovieCatalogProps> = ({ onPurchase }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'movie' | 'series'>('all');
  const [sortBy, setSortBy] = useState<'title' | 'year' | 'rating' | 'price'>('rating');
  const [selectedTrailer, setSelectedTrailer] = useState<Movie | null>(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredAndSortedMovies = useMemo(() => {
    let filtered = movies.filter(movie => {
      const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           movie.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           movie.cast.some(actor => actor.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           movie.director.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = !selectedGenre || movie.genre === selectedGenre;
      const matchesPlatform = !selectedPlatform || movie.available_on.includes(selectedPlatform);
      const matchesType = selectedType === 'all' || movie.type === selectedType;
      
      return matchesSearch && matchesGenre && matchesPlatform && matchesType;
    });

    // Sort movies
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'year':
          return b.release_year - a.release_year;
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          return a.price - b.price;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedGenre, selectedPlatform, selectedType, sortBy]);

  const handleWatchTrailer = (movie: Movie) => {
    setSelectedTrailer(movie);
    setIsTrailerOpen(true);
  };

  const closeTrailer = () => {
    setIsTrailerOpen(false);
    setSelectedTrailer(null);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedGenre('');
    setSelectedPlatform('');
    setSelectedType('all');
    setSortBy('rating');
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="hero-gradient rounded-2xl p-8 text-center">
        <h1 className="text-5xl font-bold text-white mb-4">
          Discover Amazing <span className="gradient-text">Movies & Series</span>
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Stream thousands of movies and TV shows from top platforms. Find your next favorite watch.
        </p>
        <div className="flex items-center justify-center gap-4 text-gray-300">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            <span>{movies.length} titles available</span>
          </div>
          <span>•</span>
          <span>HD & 4K Quality</span>
          <span>•</span>
          <span>Multiple Platforms</span>
        </div>
      </div>

      {/* Filters */}
      <div className="glass rounded-xl p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 search-container">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search movies, series, actors, directors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-netflix focus:border-transparent transition-all"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              title={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
            >
              {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {/* Type Filter */}
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'All' },
              { value: 'movie', label: 'Movies' },
              { value: 'series', label: 'Series' }
            ].map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value as any)}
                className={`genre-pill px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedType === type.value
                    ? 'active text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Genre Filter */}
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-netflix"
          >
            <option value="">All Genres</option>
            {genres.map(genre => (
              <option key={genre} value={genre} className="bg-dark-800">
                {genre}
              </option>
            ))}
          </select>

          {/* Platform Filter */}
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-netflix"
          >
            <option value="">All Platforms</option>
            {platforms.map(platform => (
              <option key={platform} value={platform} className="bg-dark-800">
                {platform}
              </option>
            ))}
          </select>

          {/* Sort Filter */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 bg-white/10 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-netflix"
          >
            <option value="rating" className="bg-dark-800">Highest Rated</option>
            <option value="year" className="bg-dark-800">Newest First</option>
            <option value="title" className="bg-dark-800">A-Z</option>
            <option value="price" className="bg-dark-800">Price: Low to High</option>
          </select>

          {/* Clear Filters */}
          {(searchTerm || selectedGenre || selectedPlatform || selectedType !== 'all') && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-300">
          Showing <span className="text-white font-semibold">{filteredAndSortedMovies.length}</span> results
        </p>
      </div>

      {/* Movies Grid */}
      {filteredAndSortedMovies.length > 0 ? (
        <div className={viewMode === 'grid' ? 'movie-grid' : 'space-y-6'}>
          {filteredAndSortedMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onWatchTrailer={handleWatchTrailer}
              onPurchase={onPurchase}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="glass rounded-2xl p-12 max-w-md mx-auto">
            <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">No Results Found</h3>
            <p className="text-gray-400 mb-6">
              No movies or series match your current filters. Try adjusting your search criteria.
            </p>
            <button
              onClick={clearFilters}
              className="btn-primary px-6 py-3 text-white rounded-lg font-medium"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      <TrailerModal
        movie={selectedTrailer}
        isOpen={isTrailerOpen}
        onClose={closeTrailer}
      />
    </div>
  );
};

export default MovieCatalog;