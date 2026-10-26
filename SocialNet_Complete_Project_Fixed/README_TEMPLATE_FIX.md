# Fix for `jinja2.exceptions.TemplateNotFound: login.html`

This build configures Flask with an **absolute template directory based on `app.py`**, so its template lookup does not depend on the terminal's current directory.

## Important: extract the whole ZIP

1. Stop any currently running app with `Ctrl+C` in the terminal.
2. Extract this ZIP into a new folder (do not copy only `app.py`).
3. In VS Code, choose **File → Open Folder** and open `SocialNet_Complete_Project_Fixed` from the newly extracted folder.
4. Expand `templates` in Explorer and confirm it contains `login.html` and `admin_login.html`.
5. Run `START_SOCIALNET.bat`, or run:

   ```bash
   python -m pip install -r requirements.txt
   python verify_database.py
   python app.py
   ```

On startup the terminal prints the exact project folder, template folder, and whether `login.html` was found. If the path points to an old folder, stop that server and run the newly extracted project instead.

## Login URLs

- User login: `http://127.0.0.1:5000/login`
- Admin login: `http://127.0.0.1:5000/admin/login`

Demo admin credentials: `weno_007` / `weno123`.
