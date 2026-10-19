const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;

async function fetchMovies(path, params = {}, signal) {
  if (!API_KEY) {
    throw new Error('TMDB API key is missing. Add VITE_TMDB_API_KEY to your .env file.');
  }

  if (!API_BASE_URL) {
    throw new Error('TMDB base URL is missing. Add VITE_TMDB_BASE_URL to your .env file.');
  }

  const url = new URL(`${API_BASE_URL.replace(/\/+$/, '')}/${path}`);
  url.searchParams.set('api_key', API_KEY);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`TMDB request failed (${response.status} ${response.statusText}).`);
  }

  return response.json();
}

export function getPopularMovies({ signal } = {}) {
  return fetchMovies('movie/popular', {}, signal);
}

export function searchMovies(query, { signal } = {}) {
  return fetchMovies('search/movie', { query }, signal);
}
