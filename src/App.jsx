import { useCallback, useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Watchlist from './pages/Watchlist';
import MovieDetails from './pages/MovieDetails';
import { MovieProvider } from './contexts/MovieProvider';
import { useMovies } from './contexts/useMovies';
import ErrorMessage from './components/ErrorMessage';
import { getFavoriteMovies, saveFavoriteMovies } from './services/favoritesService';
import { searchMovies } from './services/movieService';
import './App.css';

function MovieContextError() {
  const { error } = useMovies();
  return error ? (
    <div className="main-content">
      <ErrorMessage message={error} />
    </div>
  ) : null;
}

function App() {
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(true);
  const [favoritesError, setFavoritesError] = useState('');
  const searchRequestId = useRef(0);

  useEffect(() => {
    try {
      setFavorites(getFavoriteMovies());
    } catch (error) {
      setFavoritesError(error.message);
    } finally {
      setFavoritesLoading(false);
    }
  }, []);

  const handleSearch = useCallback(async (query) => {
    const normalizedQuery = query.trim();
    const requestId = ++searchRequestId.current;

    if (!normalizedQuery) {
      setSearchResults(null);
      setSearchError('');
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);
    setSearchError('');

    try {
      const data = await searchMovies(normalizedQuery);
      if (requestId === searchRequestId.current) {
        setSearchResults(data.results);
      }
    } catch (error) {
      if (requestId === searchRequestId.current) {
        setSearchError(error.message);
      }
    } finally {
      if (requestId === searchRequestId.current) {
        setSearchLoading(false);
      }
    }
  }, []);

  const handleToggleFavorite = useCallback((movie) => {
    try {
      const isFavorite = favorites.some((favorite) => favorite.id === movie.id);
      const updatedFavorites = isFavorite
        ? favorites.filter((favorite) => favorite.id !== movie.id)
        : [...favorites, movie];

      saveFavoriteMovies(updatedFavorites);
      setFavorites(updatedFavorites);
      setFavoritesError('');
    } catch (error) {
      setFavoritesError(error.message);
    }
  }, [favorites]);

  return (
    <Router>
      <MovieProvider>
        <div className="app">
          <Header onSearch={handleSearch} />
          <MovieContextError />
          <Routes>
            <Route
              path="/"
              element={(
                <Home
                  searchResults={searchResults}
                  searchLoading={searchLoading}
                  searchError={searchError}
                  favorites={favorites}
                  favoritesLoading={favoritesLoading}
                  favoritesError={favoritesError}
                  onToggleFavorite={handleToggleFavorite}
                />
              )}
            />
            <Route
              path="/favorites"
              element={(
                <Favorites
                  movies={favorites}
                  loading={favoritesLoading}
                  error={favoritesError}
                  onToggleFavorite={handleToggleFavorite}
                />
              )}
            />
            <Route
              path="/watchlist"
              element={(
                <Watchlist
                  favorites={favorites}
                  favoritesLoading={favoritesLoading}
                  onToggleFavorite={handleToggleFavorite}
                  favoritesError={favoritesError}
                />
              )}
            />
            <Route
              path="/movies/:movieId"
              element={(
                <MovieDetails
                  favorites={favorites}
                  favoritesLoading={favoritesLoading}
                  onToggleFavorite={handleToggleFavorite}
                  favoritesError={favoritesError}
                />
              )}
            />
          </Routes>
        </div>
      </MovieProvider>
    </Router>
  );
}

export default App;