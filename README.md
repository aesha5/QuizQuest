# QuizQuest

 A small interactive web quiz about Indian history. This repository contains a static frontend (HTML/CSS/JS) and a simple Node/Express backend for saving quiz results.

 Contents
- `index.html`, `style.css`, `script.js` — frontend static files
- `server.js` — Node/Express backend (uses MongoDB in `server/` variant or local JSON storage in another variant)
- `package.json` — Node backend dependencies and scripts

 Quick local run (frontend + backend)
 1. Open a terminal in the `QuizQuest` folder.
 2. Install backend dependencies:

 ```powershell
 cd QuizQuest
 npm install
 ```

 3. Start the backend (runs on port 3000 by default):

 ```powershell
 npm run dev
 # or
 npm start
 ```

 4. Open `index.html` in your browser (or visit `http://localhost:3000` once the server serves the static files).

 Notes about deployment
- Frontend: This is a static site (HTML/CSS/JS). You can deploy the frontend to GitHub Pages. A workflow is included to automatically publish the repo root to GitHub Pages on pushes to `main`.
- Backend: `server.js` is a Node/Express app that requires Node and (optionally) a MongoDB instance. GitHub cannot host the backend itself — consider using Render, Heroku, Railway, or a VPS. The README includes a short sample for Render/Heroku.

 CI & Deployment
- A GitHub Actions workflow (`.github/workflows/nodejs.yml`) will run Node CI for pushes and PRs.
- Another workflow (`.github/workflows/deploy-pages.yml`) will publish the frontend to GitHub Pages when you push to `main`.

 Security
- Add any secret keys (database URIs, API keys) to repository secrets in GitHub (Settings → Secrets) and reference them in workflows. Do not commit `.env` files.

 Next steps
- Update `server.js` to use `process.env.MONGODB_URI` if you plan to deploy the backend with a hosted DB.
- If you want an automated server deployment, tell me which provider (Render / Heroku / Railway / Docker host) and I can add a deploy workflow.

Deploying to Render (web service + Postgres 17)
1. Create a free Render account at https://render.com and connect your GitHub repository.
2. Place `render.yaml` at the repository root (already included). When you connect the repo, Render will read `render.yaml` and can create the declared services (a web service and a managed Postgres 17 database named `quizquest-db`).
3. Render will set an environment variable `DATABASE_URL` for your web service that points to the managed Postgres instance. `server.js` reads `process.env.DATABASE_URL` automatically.
4. If you want to test locally:

```powershell
# install dependencies
cd QuizQuest
npm install

# Start a local Postgres instance (or set DATABASE_URL to a running Postgres)
# Example with psql locally (create DB and user as needed):
# createdb quizquestdb

# Start server in dev mode:
npm run dev
```

Notes about Postgres 17
- `render.yaml` requests Postgres version `17` for the managed database. If you prefer another plan or version, edit `render.yaml` before connecting the repo to Render.

Render automatic deploy flow summary
- Connect your GitHub repo to Render.
- Render inspects `render.yaml` and will offer to create the web service and the Postgres instance declared there.
- After creation, push to `main` and Render will build & deploy the web service. The web service will have `DATABASE_URL` set and `server.js` will create the `results` table automatically on first run.

Security & environment
- Do not commit a real `.env` with secrets. Use Render's dashboard to set/override environment variables if needed.

If you'd like, I can also:
- Add a sample Render Health check and a small `render` health endpoint (e.g., `/health`) to be used by Render's health checks.
- Add a GitHub Action that triggers a redeploy on Render via the Render API (requires an API key stored in Secrets).
 - Added a `/health` endpoint to `server.js` for Render's health checks.