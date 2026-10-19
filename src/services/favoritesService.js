const FAVORITES_KEY = 'movieshelf-favorites';

export function getFavoriteMovies() {
  const storedMovies = window.localStorage.getItem(FAVORITES_KEY);

  if (!storedMovies) {
    return [];
  }

  const movies = JSON.parse(storedMovies);

  if (!Array.isArray(movies)) {
    throw new Error('Saved favorites are invalid. Clear the MovieShelf favorites from local storage and try again.');
  }

  return movies;
}

export function saveFavoriteMovies(movies) {
  window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(movies));
}
