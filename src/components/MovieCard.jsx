import { useMovies } from '../contexts/useMovies';

function MovieCard({
  movie,
  isFavorite,
  favoritesLoading,
  onToggleFavorite,
  onRemoveFromWatchlist,
}) {
  const { watchlist, addMovieToWatchlist, removeMovieFromWatchlist } = useMovies();
  const releaseYear = movie.release_date?.slice(0, 4);
  const isInWatchlist = watchlist.some((item) => item.id === movie.id);
  const handleWatchlistToggle = () => {
    if (onRemoveFromWatchlist) {
      onRemoveFromWatchlist(movie.id);
    } else if (isInWatchlist) {
      removeMovieFromWatchlist(movie.id);
    } else {
      addMovieToWatchlist(movie);
    }
  };

  return (
    <div className="movie-card">
      <div className="movie-poster">
        {movie.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={`${movie.title} poster`}
            loading="lazy"
          />
        ) : (
          <div className="movie-poster-placeholder">Poster unavailable</div>
        )}
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <div className="movie-details">
          <span className="movie-rating">
            {Number.isFinite(movie.vote_average) ? `⭐ ${movie.vote_average.toFixed(1)}` : 'Not rated'}
          </span>
          <span className="movie-year">{releaseYear || 'Release date unknown'}</span>
        </div>
        <button
          className={`favorite-button${isFavorite ? ' favorited' : ''}`}
          type="button"
          aria-pressed={isFavorite}
          disabled={favoritesLoading}
          onClick={() => onToggleFavorite(movie)}
        >
          {isFavorite ? '♥ Remove from Favorites' : '♡ Add to Favorites'}
        </button>
        <button
          className={`watchlist-button${isInWatchlist ? ' watchlisted' : ''}`}
          type="button"
          aria-pressed={isInWatchlist}
          onClick={handleWatchlistToggle}
        >
          {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
        </button>
      </div>
    </div>
  );
}

export default MovieCard;