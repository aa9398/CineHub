import React, { useEffect } from 'react';
import { X, Star, Calendar, Clock, Users } from 'lucide-react';
import { Movie } from '../../data/movies';

interface TrailerModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

const TrailerModal: React.FC<TrailerModalProps> = ({ movie, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !movie) return null;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
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

  return (
    <div className="fixed inset-0 trailer-modal flex items-center justify-center z-50 p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative glass-dark rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-auto animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm p-2 rounded-full text-white hover:bg-netflix transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="aspect-video relative">
          <iframe
            src={movie.trailer_url}
            title={`${movie.title} Trailer`}
            className="w-full h-full rounded-t-2xl"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
        
        <div className="p-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full rounded-xl shadow-2xl"
              />
            </div>
            
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-white mb-4">{movie.title}</h1>
                
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-white font-semibold">{movie.rating}/10</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="w-5 h-5" />
                    <span>{movie.release_year}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-300">
                    <Clock className="w-5 h-5" />
                    <span>
                      {movie.type === 'series' 
                        ? `${movie.seasons} seasons, ${movie.episodes} episodes`
                        : formatDuration(movie.duration)
                      }
                    </span>
                  </div>
                  
                  <span className="bg-white/10 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {movie.genre}
                  </span>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Synopsis</h3>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {movie.description}
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Director</h3>
                <div className="flex items-center gap-2 text-gray-300">
                  <Users className="w-5 h-5" />
                  <span>{movie.director}</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Cast</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.cast.map((actor, index) => (
                    <span
                      key={index}
                      className="bg-white/10 text-gray-300 px-3 py-1 rounded-full text-sm"
                    >
                      {actor}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Available On</h3>
                <div className="flex flex-wrap gap-3">
                  {movie.available_on.map((platform) => (
                    <span
                      key={platform}
                      className={`${getPlatformColor(platform)} px-4 py-2 rounded-lg text-white font-semibold`}
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-6 border-t border-white/10">
                <div>
                  <span className="text-3xl font-bold text-netflix">${movie.price}</span>
                  <span className="text-gray-400 ml-2">to buy/rent</span>
                </div>
                
                <span className="premium-badge px-4 py-2 rounded-lg text-lg font-bold uppercase">
                  {movie.type}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;