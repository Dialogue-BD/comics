# Durable classroom data on Replit

Replit Autoscale deployment files reset whenever the app is published. The
classroom backend therefore uses Replit Database (managed PostgreSQL) whenever
`DATABASE_URL` is available and keeps SQLite only as a local-development
fallback.

## One-time Replit setup

1. Open the project in Replit.
2. Open **All tools → Database** and create the project database.
3. Confirm Replit added the `DATABASE_URL` secret. Replit wires the production
   database credentials into the published deployment.
4. Publish the app again.
5. Open `https://dialogue-bd.com/api/health` and confirm the response contains
   `"database": "PostgreSQL"` and `"durable": true`.

The published server deliberately refuses to start without `DATABASE_URL` so
classroom sessions cannot silently fall back to disposable deployment files.
Data from the old deployment-local `poll.db` is not copied automatically; make
the replacement FGD session after the PostgreSQL-backed version is live.

References:

- https://docs.replit.com/build/add-database
- https://docs.replit.com/build/troubleshooting
