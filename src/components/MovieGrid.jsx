import MovieCard from './MovieCard';

function MovieGrid({
  movies,
  favorites = [],
  favoritesLoading = false,
  onToggleFavorite,
  onRemoveFromWatchlist,
}) {
  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isFavorite={favorites.some((favorite) => favorite.id === movie.id)}
          favoritesLoading={favoritesLoading}
          onToggleFavorite={onToggleFavorite}
          onRemoveFromWatchlist={onRemoveFromWatchlist}
        />
      ))}
    </div>
  );
}

export default MovieGrid;