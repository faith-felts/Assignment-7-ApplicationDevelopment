import { useEffect, useState } from 'react';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import MovieGrid from '../components/MovieGrid';
import { getPopularMovies } from '../services/movieService';

function Home({
  searchResults,
  searchLoading,
  searchError,
  favorites,
  favoritesLoading,
  favoritesError,
  onToggleFavorite,
}) {
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularLoading, setPopularLoading] = useState(true);
  const [popularError, setPopularError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadPopularMovies() {
      try {
        const data = await getPopularMovies({ signal: controller.signal });
        setPopularMovies(data.results);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setPopularError(error.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setPopularLoading(false);
        }
      }
    }

    loadPopularMovies();
    return () => controller.abort();
  }, []);

  const showingSearchResults = searchResults !== null;
  const movies = showingSearchResults ? searchResults : popularMovies;
  const loading = showingSearchResults ? searchLoading : popularLoading;
  const error = showingSearchResults ? searchError : popularError;

  return (
    <main className="main-content">
      <div className="content-header">
        <h2>{showingSearchResults ? 'Search Results' : 'Popular Movies'}</h2>
        <p>{showingSearchResults ? 'Movies matching your search' : 'Discover and save your favorite films'}</p>
      </div>
      {favoritesError && <ErrorMessage message={favoritesError} />}
      {error && <ErrorMessage message={error} />}
      {loading ? (
        <LoadingSpinner />
      ) : movies.length > 0 ? (
        <MovieGrid
          movies={movies}
          favorites={favorites}
          favoritesLoading={favoritesLoading}
          onToggleFavorite={onToggleFavorite}
        />
      ) : !error ? (
        <div className="empty-state">
          <p>{showingSearchResults ? 'No movies found. Try another search.' : 'No popular movies are available.'}</p>
        </div>
      ) : null}
    </main>
  );
}

export default Home;