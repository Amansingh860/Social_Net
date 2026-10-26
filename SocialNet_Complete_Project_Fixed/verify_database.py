"""Initialize and verify the SQLite database for this exact SocialNet folder."""
import sqlite3
import app as socialnet_app  # import initializes/migrates this project's database

socialnet_app.init_db()
db_path = socialnet_app.DB_PATH
with sqlite3.connect(db_path) as con:
    tables = {row[0] for row in con.execute("SELECT name FROM sqlite_master WHERE type='table'")}
    required = {"users", "admin", "friend_requests", "friendships", "favourites", "messages"}
    missing = sorted(required - tables)
    admins = con.execute("SELECT username FROM admin ORDER BY username").fetchall() if "admin" in tables else []
    users = con.execute("SELECT COUNT(*) FROM users").fetchone()[0] if "users" in tables else 0
print("SocialNet project folder:", socialnet_app.BASE_DIR)
print("SQLite database used:", db_path)
print("Tables found:", ", ".join(sorted(tables)))
if missing:
    raise SystemExit("ERROR: Missing required tables: " + ", ".join(missing))
print("Users table: OK ({} accounts)".format(users))
print("Admin account(s):", ", ".join(row[0] for row in admins) or "none")
print("Database verification passed.")
