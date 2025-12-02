# Swiss Outdoor Planner

Swiss Outdoor Planner is a SvelteKit prototype that helps hikers, runners, and cyclists plan Swiss routes, log real-world activities (with time, feeling, and image links), and review personal statistics. MongoDB stores all routes and activities so the primary workflow—plan → complete → reflect—works end-to-end.

## Main workflow
1. **Create a route** under `/routes/new` with title, type (hike/run/bike), region, distance, optional elevation, and difficulty.
2. **Open the route detail** page to review information and press **“Log activity”** once the outing is finished.
3. **Log the activity** with date, start time, duration, feeling, notes, and up to three image URLs. The activity appears immediately on the route page and on the global activities list.
4. **Review stats** on `/profile`, which aggregates activity counts, total distance per type, total duration per type, and how many activities include images.

## Pages and roles
- `/` – dashboard with the latest activities and quick links.
- `/routes` – overview with type filter; **admin** can delete any route.
- `/routes/new` – create new routes.
- `/routes/[id]` – show full route details, linked activities, and:
  - Users/admins can log new activities.
  - **Admin** can edit distance/difficulty, delete the route, or delete individual activities.
- `/routes/[id]/activities/new` – create an activity for a route.
- `/activities` – overview of every activity with optional type filter.
- `/profile` – summary metrics for the whole system.

There is no real authentication. Instead, the header contains a role selector (user/admin). The chosen role is stored in a cookie so that server actions can enforce permissions (e.g., only admins may delete or edit data).

## Getting started
```bash
npm install
```

Create a `.env` file:
```
MONGO_URI=your-mongodb-connection-string
```

Then run the SvelteKit dev server:
```bash
npm run dev
```

## Working with Git & GitHub
```bash
git init
git add .
git commit -m "Initial Swiss Outdoor Planner"
git remote add origin https://github.com/<username>/swiss-outdoor-planner.git
git push -u origin main
```

## Deployment (Netlify example)
1. Push the repo to GitHub.
2. In Netlify, create a new site from Git.
3. Set the environment variable `MONGO_URI` in the Netlify dashboard.
4. Build command: `npm run build`
5. Publish directory: `build`

## Possible extensions
- Additional filtering/sorting on routes or activities (e.g., distance, difficulty).
- Richer statistics or charts on the profile page.
- Map preview or elevation profile using Swisstopo or other APIs.
- File uploads for images instead of URLs.
- Sharing links or collaborative planning between multiple users.
