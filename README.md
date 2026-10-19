# MovieShelf

MovieShelf is a React application for browsing popular movies, searching TMDB, viewing movie details, and organizing movies into persistent watchlists and favorites.

## Getting started

1. Install dependencies with `npm install`.
2. Create a `.env` file in the project root:

   ```env
   VITE_TMDB_API_KEY=your_api_key_here
   VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
   ```

3. Start the development server with `npm run dev`.

The `.env` file is ignored by Git. Vite exposes `VITE_` variables to browser code, so use a TMDB key intended for client-side use and do not put privileged secrets in this file.

## Scripts

- `npm run dev` starts the development server.
- `npm run build` creates a production build.
- `npm run lint` runs ESLint.
- `npm run preview` previews the production build.

## Watchlists and movie details

Use **Watchlists** in the navigation to create, select, and delete named watchlists. Movie cards and movie detail pages add or remove movies from the currently selected list. Watchlists are shared through the Movie Context provider and saved in browser local storage, so they remain available across routes and browser refreshes.

Select a movie poster or title to open its details page. Favorites continue to be stored separately from watchlists.
