import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header({ onSearch }) {
  const [query, setQuery] = useState('');
  const debounceTimer = useRef(null);
  const { pathname } = useLocation();
  const searchDisabled = pathname !== '/';

  useEffect(() => {
    if (searchDisabled) {
      return undefined;
    }

    debounceTimer.current = setTimeout(() => onSearch(query), 350);

    return () => clearTimeout(debounceTimer.current);
  }, [query, onSearch, searchDisabled]);

  function handleSubmit(event) {
    event.preventDefault();
    if (searchDisabled) {
      return;
    }

    clearTimeout(debounceTimer.current);
    onSearch(query);
  }

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="app-title">MovieShelf</Link>
        <nav className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/watchlist" className="nav-link">Watchlists</Link>
          <Link to="/favorites" className="nav-link">Favorites</Link>
        </nav>
        <form
          className={`search-container${searchDisabled ? ' search-container-disabled' : ''}`}
          onSubmit={handleSubmit}
        >
          <input 
            type="text" 
            placeholder="Search movies..."
            className="search-input"
            aria-label="Search movies"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            disabled={searchDisabled}
          />
          <button className="search-button" type="submit" disabled={searchDisabled}>Search</button>
        </form>
      </div>
    </header>
  );
}

export default Header;