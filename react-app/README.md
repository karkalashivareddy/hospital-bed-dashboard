# Hospital Bed Dashboard — React migration

This folder contains a Vite + React migration of the original hospital-bed-dashboard UI.

How to run
1. cd react-app
2. npm install
3. npm run dev

Notes
- The React app is kept inside `react-app/` to avoid overwriting the original project files. If you'd like the React app moved to the repository root or replace the old UI, tell me and I can update the branch.
- `fetchBeds` in `src/services/api.js` tries to load `/beds.json`. You can add a `beds.json` file under `react-app/public/` or update the endpoint to match your backend.
