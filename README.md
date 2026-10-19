# MovieShelf

MovieShelf is a React application for browsing popular movies, searching TMDB, and saving favorites in your browser.

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
