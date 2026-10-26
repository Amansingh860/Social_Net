# SocialNet — Complete Flask + SQLite Project

This ZIP contains the **full application**, not just a repair kit: Python backend, SQLite database, every Jinja template, CSS, JavaScript, assets, dependency list, and database verification/launch helpers.

## Start on Windows (recommended)

1. Extract the ZIP into a new folder.
2. Open the extracted `new project file` folder in VS Code, or use File Explorer to open it.
3. Double-click `START_SOCIALNET.bat`. It installs dependencies, initializes/verifies the SQLite schema for this exact folder, and launches the app.
4. Visit `http://127.0.0.1:5000` for user login or `http://127.0.0.1:5000/admin/login` for administrator login.

## Start manually in VS Code

Open a terminal **in this folder** (the same folder that contains `app.py`), then run:

```bat
python -m pip install -r requirements.txt
python verify_database.py
python app.py
```

The application uses an absolute database path next to this `app.py` by default, so launching it from another current working directory won't silently select a different `database.db`. An intentional override is possible with `SOCIALNET_DB_PATH`.

## Local demo credentials

- Admin username: `weno_007`
- Admin password: `weno123`
- Demo user accounts are seeded by the app as `user01` through `user10`, password `user123`.

Change demo credentials before deploying this app publicly. Keep `SECRET_KEY` private and use environment variables for deployment.

## Database error: `no such table: users`

Run `python verify_database.py` from this folder. It imports the app, runs the schema initialization/migration, prints the exact database path it uses, and verifies that the required tables exist. If your browser is still running a traceback from `C:\Users\...\social-network\app.py`, stop that old server with Ctrl+C and launch `START_SOCIALNET.bat` or `python app.py` from the folder extracted from this ZIP. Do not run an old copy of `app.py` while testing this project.

The code creates missing tables with `CREATE TABLE IF NOT EXISTS` and adds the current profile-cover column if needed; it does not drop tables. Before replacing a database manually, make a backup of any old data you need to preserve.
