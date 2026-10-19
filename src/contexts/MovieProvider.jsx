import { useCallback, useEffect, useMemo, useState } from 'react';
import { MovieContext } from './MovieContext';

const WATCHLISTS_KEY = 'movieshelf-watchlists';

function createDefaultWatchlist() {
  return {
    watchlists: [{ id: 'default', name: 'My Watchlist', movies: [] }],
    currentWatchlistId: 'default',
    loaded: false,
    error: '',
  };
}

function loadWatchlists() {
  try {
    const saved = window.localStorage.getItem(WATCHLISTS_KEY);
    if (!saved) {
      return { ...createDefaultWatchlist(), loaded: true };
    }

    const data = JSON.parse(saved);
    const validWatchlists = data
      && Array.isArray(data.watchlists)
      && data.watchlists.length > 0
      && data.watchlists.every((watchlist) => (
        watchlist
        && typeof watchlist.id === 'string'
        && typeof watchlist.name === 'string'
        && watchlist.name.trim().length > 0
        && Array.isArray(watchlist.movies)
        && watchlist.movies.every((movie) => (
          movie
          && (typeof movie.id === 'number' || typeof movie.id === 'string')
          && typeof movie.title === 'string'
        ))
      ));

    if (!validWatchlists) {
      throw new Error('Saved watchlists are invalid. Clear the MovieShelf watchlists from local storage and try again.');
    }

    const currentWatchlistId = data.watchlists.some((watchlist) => (
      watchlist.id === data.currentWatchlistId
    ))
      ? data.currentWatchlistId
      : data.watchlists[0].id;

    return {
      watchlists: data.watchlists,
      currentWatchlistId,
      loaded: true,
      error: '',
    };
  } catch (error) {
    const fallback = createDefaultWatchlist();
    return {
      ...fallback,
      error: error instanceof Error ? error.message : 'Unable to load saved watchlists.',
    };
  }
}

export function MovieProvider({ children }) {
  const [initialState] = useState(loadWatchlists);
  const [watchlists, setWatchlists] = useState(initialState.watchlists);
  const [currentWatchlistId, setCurrentWatchlistId] = useState(initialState.currentWatchlistId);
  const [loaded, setLoaded] = useState(initialState.loaded);
  const [error, setError] = useState(initialState.error);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    try {
      window.localStorage.setItem(
        WATCHLISTS_KEY,
        JSON.stringify({ watchlists, currentWatchlistId }),
      );
      setError('');
    } catch (storageError) {
      setError(storageError instanceof Error ? storageError.message : 'Unable to save watchlists.');
    }
  }, [watchlists, currentWatchlistId, loaded]);

  const createWatchlist = useCallback((name) => {
    const normalizedName = name.trim();
    if (!normalizedName) {
      throw new Error('Enter a name for the watchlist.');
    }
    if (watchlists.some((watchlist) => watchlist.name.toLowerCase() === normalizedName.toLowerCase())) {
      throw new Error('A watchlist with that name already exists.');
    }

    const watchlist = {
      id: crypto.randomUUID(),
      name: normalizedName,
      movies: [],
    };
    setWatchlists((current) => [...current, watchlist]);
    setCurrentWatchlistId(watchlist.id);
    setLoaded(true);
    setError('');
  }, [watchlists]);

  const deleteWatchlist = useCallback((watchlistId) => {
    if (watchlists.length === 1) {
      throw new Error('MovieShelf must have at least one watchlist.');
    }

    const remainingWatchlists = watchlists.filter((watchlist) => watchlist.id !== watchlistId);
    setWatchlists(remainingWatchlists);
    if (currentWatchlistId === watchlistId) {
      setCurrentWatchlistId(remainingWatchlists[0].id);
    }
    setLoaded(true);
    setError('');
  }, [currentWatchlistId, watchlists]);

  const selectWatchlist = useCallback((watchlistId) => {
    if (!watchlists.some((watchlist) => watchlist.id === watchlistId)) {
      throw new Error('The selected watchlist could not be found.');
    }
    setCurrentWatchlistId(watchlistId);
    setLoaded(true);
    setError('');
  }, [watchlists]);

  const addMovieToWatchlist = useCallback((movie, watchlistId = currentWatchlistId) => {
    setWatchlists((current) => current.map((watchlist) => {
      if (watchlist.id !== watchlistId || watchlist.movies.some((item) => item.id === movie.id)) {
        return watchlist;
      }
      return { ...watchlist, movies: [...watchlist.movies, movie] };
    }));
    setLoaded(true);
    setError('');
  }, [currentWatchlistId]);

  const removeMovieFromWatchlist = useCallback((movieId, watchlistId = currentWatchlistId) => {
    setWatchlists((current) => current.map((watchlist) => (
      watchlist.id === watchlistId
        ? { ...watchlist, movies: watchlist.movies.filter((movie) => movie.id !== movieId) }
        : watchlist
    )));
    setLoaded(true);
    setError('');
  }, [currentWatchlistId]);

  const currentWatchlist = watchlists.find((watchlist) => watchlist.id === currentWatchlistId)
    ?? watchlists[0];
  const value = useMemo(() => ({
    watchlists,
    currentWatchlist,
    error,
    createWatchlist,
    deleteWatchlist,
    selectWatchlist,
    addMovieToWatchlist,
    removeMovieFromWatchlist,
  }), [
    watchlists,
    currentWatchlist,
    error,
    createWatchlist,
    deleteWatchlist,
    selectWatchlist,
    addMovieToWatchlist,
    removeMovieFromWatchlist,
  ]);

  return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>;
}
