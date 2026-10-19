import ErrorMessage from '../components/ErrorMessage';
import MovieGrid from '../components/MovieGrid';
import { useMovies } from '../contexts/useMovies';

function Watchlist({ favorites, favoritesLoading, onToggleFavorite, favoritesError }) {
  const { watchlist, removeMovieFromWatchlist } = useMovies();

  return (
    <main className="main-content">
      <div className="content-header">
        <h2>My Watchlist</h2>
        <p>Your saved movies to watch</p>
      </div>
      {favoritesError && <ErrorMessage message={favoritesError} />}
      {watchlist.length > 0 ? (
        <MovieGrid
          movies={watchlist}
          favorites={favorites}
          favoritesLoading={favoritesLoading}
          onToggleFavorite={onToggleFavorite}
          onRemoveFromWatchlist={removeMovieFromWatchlist}
        />
      ) : (
        <div className="empty-state">
          <p>No movies in your watchlist yet. Add movies from Home or a movie details page.</p>
        </div>
      )}
    </main>
  );
}

export default Watchlist;
