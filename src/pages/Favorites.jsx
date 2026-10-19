import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import MovieGrid from '../components/MovieGrid';

function Favorites({ movies, loading, error, onToggleFavorite }) {
  return (
    <main className="main-content">
      <div className="content-header">
        <h2>My Favorites</h2>
        <p>Your saved movies collection</p>
      </div>
      {error && <ErrorMessage message={error} />}
      {loading ? (
        <LoadingSpinner />
      ) : movies.length > 0 ? (
        <MovieGrid
          movies={movies}
          favorites={movies}
          onToggleFavorite={onToggleFavorite}
        />
      ) : (
        <div className="empty-state">
          <p>No favorite movies yet. Start adding some from the home page!</p>
        </div>
      )}
    </main>
  );
}

export default Favorites;