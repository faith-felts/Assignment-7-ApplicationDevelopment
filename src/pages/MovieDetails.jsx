import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { useMovies } from '../contexts/useMovies';
import { getMovieDetails } from '../services/movieService';

function MovieDetails({ favorites, favoritesLoading, onToggleFavorite, favoritesError }) {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const {
    currentWatchlist,
    addMovieToWatchlist,
    removeMovieFromWatchlist,
  } = useMovies();

  useEffect(() => {
    const controller = new AbortController();

    async function loadMovie() {
      setLoading(true);
      setError('');
      try {
        const data = await getMovieDetails(movieId, { signal: controller.signal });
        setMovie(data);
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadMovie();
    return () => controller.abort();
  }, [movieId]);

  const isInWatchlist = movie
    ? currentWatchlist.movies.some((item) => item.id === movie.id)
    : false;
  const isFavorite = movie
    ? favorites.some((favorite) => favorite.id === movie.id)
    : false;

  return (
    <main className="main-content">
      <Link className="back-link" to="/">← Back to movies</Link>
      {favoritesError && <ErrorMessage message={favoritesError} />}
      {loading ? <LoadingSpinner /> : null}
      {error && <ErrorMessage message={error} />}
      {!loading && movie && (
        <article className="movie-detail">
          <div className="movie-detail-poster">
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={`${movie.title} poster`}
              />
            ) : (
              <div className="movie-poster-placeholder">Poster unavailable</div>
            )}
          </div>
          <div className="movie-detail-content">
            <h2>{movie.title}</h2>
            {movie.tagline && <p className="movie-tagline">{movie.tagline}</p>}
            <div className="movie-detail-meta">
              <span>{movie.release_date || 'Release date unknown'}</span>
              <span>{Number.isFinite(movie.vote_average) ? `⭐ ${movie.vote_average.toFixed(1)}` : 'Not rated'}</span>
              {movie.runtime > 0 && <span>{movie.runtime} min</span>}
            </div>
            {movie.genres?.length > 0 && (
              <p className="movie-genres">{movie.genres.map((genre) => genre.name).join(' · ')}</p>
            )}
            <h3>Overview</h3>
            <p className="movie-overview">{movie.overview || 'No overview is available for this movie.'}</p>
            <div className="detail-actions">
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
                onClick={() => (
                  isInWatchlist
                    ? removeMovieFromWatchlist(movie.id)
                    : addMovieToWatchlist(movie)
                )}
              >
                {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
              </button>
            </div>
          </div>
        </article>
      )}
    </main>
  );
}

export default MovieDetails;
