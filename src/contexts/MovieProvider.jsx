import { useCallback, useEffect, useMemo, useState } from 'react';
import { MovieContext } from './MovieContext';

const WATCHLIST_KEY = 'movieshelf-watchlist';
const LEGACY_WATCHLISTS_KEY = 'movieshelf-watchlists';

function loadWatchlist() {
  try {
    const saved = window.localStorage.getItem(WATCHLIST_KEY);
    if (saved) {
      const movies = JSON.parse(saved);
      if (!isMovieList(movies)) {
        throw new Error('Saved watchlist is invalid. Clear the MovieShelf watchlist from local storage and try again.');
      }
      return { watchlist: movies, loaded: true, error: '' };
    }

    const legacySaved = window.localStorage.getItem(LEGACY_WATCHLISTS_KEY);
    if (!legacySaved) {
      return { watchlist: [], loaded: true, error: '' };
    }

    const legacyData = JSON.parse(legacySaved);
    const legacyWatchlists = Array.isArray(legacyData)
      ? legacyData
      : legacyData?.watchlists;

    if (!Array.isArray(legacyWatchlists) || !legacyWatchlists.every((watchlist) => (
      watchlist
      && Array.isArray(watchlist.movies)
      && isMovieList(watchlist.movies)
    ))) {
      throw new Error('Saved watchlists are invalid. Clear the MovieShelf watchlists from local storage and try again.');
    }

    const uniqueMovies = new Map();
    legacyWatchlists.flatMap((watchlist) => watchlist.movies).forEach((movie) => {
      uniqueMovies.set(movie.id, movie);
    });

    return { watchlist: [...uniqueMovies.values()], loaded: true, error: '' };
  } catch (error) {
    return {
      watchlist: [],
      loaded: false,
      error: error instanceof Error ? error.message : 'Unable to load saved watchlist.',
    };
  }
}

function isMovieList(value) {
  return Array.isArray(value) && value.every((movie) => (
    movie
    && (typeof movie.id === 'number' || typeof movie.id === 'string')
    && typeof movie.title === 'string'
  ));
}

export function MovieProvider({ children }) {
  const [initialState] = useState(loadWatchlist);
  const [watchlist, setWatchlist] = useState(initialState.watchlist);
  const [loaded, setLoaded] = useState(initialState.loaded);
  const [error, setError] = useState(initialState.error);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    try {
      window.localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
      setError('');
    } catch (storageError) {
      setError(storageError instanceof Error ? storageError.message : 'Unable to save watchlist.');
    }
  }, [watchlist, loaded]);

  const addMovieToWatchlist = useCallback((movie) => {
    setWatchlist((current) => (
      current.some((item) => item.id === movie.id) ? current : [...current, movie]
    ));
    setLoaded(true);
    setError('');
  }, []);

  const removeMovieFromWatchlist = useCallback((movieId) => {
    setWatchlist((current) => current.filter((movie) => movie.id !== movieId));
    setLoaded(true);
    setError('');
  }, []);

  const value = useMemo(() => ({
    watchlist,
    error,
    addMovieToWatchlist,
    removeMovieFromWatchlist,
  }), [watchlist, error, addMovieToWatchlist, removeMovieFromWatchlist]);

  return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>;
}
