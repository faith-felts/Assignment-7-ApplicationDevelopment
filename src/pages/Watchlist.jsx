import { useState } from 'react';
import ErrorMessage from '../components/ErrorMessage';
import MovieGrid from '../components/MovieGrid';
import { useMovies } from '../contexts/useMovies';

function Watchlist({ favorites, favoritesLoading, onToggleFavorite, favoritesError }) {
  const {
    watchlists,
    currentWatchlist,
    createWatchlist,
    deleteWatchlist,
    selectWatchlist,
  } = useMovies();
  const [name, setName] = useState('');
  const [pageError, setPageError] = useState('');

  function handleCreate(event) {
    event.preventDefault();
    try {
      createWatchlist(name);
      setName('');
      setPageError('');
    } catch (error) {
      setPageError(error.message);
    }
  }

  function handleDelete() {
    try {
      deleteWatchlist(currentWatchlist.id);
      setPageError('');
    } catch (error) {
      setPageError(error.message);
    }
  }

  return (
    <main className="main-content">
      <div className="content-header">
        <h2>My Watchlists</h2>
        <p>Organize movies you want to watch into separate lists.</p>
      </div>
      {favoritesError && <ErrorMessage message={favoritesError} />}
      {pageError && <ErrorMessage message={pageError} />}
      <section className="watchlist-controls" aria-label="Manage watchlists">
        <label className="watchlist-picker-label" htmlFor="watchlist-picker">Selected watchlist</label>
        <select
          id="watchlist-picker"
          className="watchlist-picker"
          value={currentWatchlist.id}
          onChange={(event) => {
            try {
              selectWatchlist(event.target.value);
              setPageError('');
            } catch (error) {
              setPageError(error.message);
            }
          }}
        >
          {watchlists.map((watchlist) => (
            <option key={watchlist.id} value={watchlist.id}>{watchlist.name}</option>
          ))}
        </select>
        <form className="create-watchlist-form" onSubmit={handleCreate}>
          <label className="visually-hidden" htmlFor="new-watchlist-name">New watchlist name</label>
          <input
            id="new-watchlist-name"
            className="watchlist-name-input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="New watchlist name"
            maxLength={60}
          />
          <button className="secondary-button" type="submit">Create Watchlist</button>
        </form>
        <button
          className="secondary-button delete-watchlist-button"
          type="button"
          onClick={handleDelete}
          disabled={watchlists.length === 1}
        >
          Delete Selected
        </button>
      </section>
      <h3 className="watchlist-heading">{currentWatchlist.name}</h3>
      {currentWatchlist.movies.length > 0 ? (
        <MovieGrid
          movies={currentWatchlist.movies}
          favorites={favorites}
          favoritesLoading={favoritesLoading}
          onToggleFavorite={onToggleFavorite}
        />
      ) : (
        <div className="empty-state">
          <p>This watchlist is empty. Add movies from Home or a movie details page.</p>
        </div>
      )}
    </main>
  );
}

export default Watchlist;
