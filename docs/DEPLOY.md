# Deploying Lontar Digital Archive on Hostinger

Standalone Laravel 13 / PHP 8.4 site for `lontar.rinjanilombok.org` — the digital
manuscript (lontar) archive of the Rinjani Lombok family, sharing the rinjanilombok.org
design system.

## How a release reaches the server

1. Merge to `main`.
2. `.github/workflows/build-deploy-branch.yml` builds Vite assets and `vendor/` (no dev
   packages), runs the full test suite, serves the tree with real Apache to test the
   web-root rules, then force-pushes **one orphan commit** to the `deploy` branch.
3. Hostinger pulls `deploy` into `public_html`. The repository root is the web root:
   the root `.htaccess` refuses every framework path, dotfile and data file before any
   rewrite; everything else is handed to `public/`.
4. A cron job runs `php artisan app:post-deploy` once per new release (migrate, clear
   and rebuild caches).

**Never push directly to `deploy`** — CI is the only builder.

## One-time setup in hPanel

1. **Domain.** Add the subdomain `lontar.rinjanilombok.org`, with SSL.
2. **Database.** Create a MySQL database + user. The app's migration creates all tables
   (`admin_user`, `categories`, `readers`, `lontars`, `lontar_pages`). Seed only if you
   want the clearly-labelled sample manuscript:
   `php artisan db:seed --class=SampleContentSeeder`.
3. **Uploads.** Uploaded scans/audio live OUTSIDE the web root, e.g.
   `~/lontar-data/uploads`, referenced by `UPLOADS_PATH` in `.env`. The controller serves
   them by basename only (`/media/{name}`) — no path traversal possible.
4. **.env.** In the web root, from `.env.example`, set: `APP_KEY`
   (`php artisan key:generate --show`), `APP_ENV=production`, `APP_DEBUG=false`,
   `APP_URL=https://lontar.rinjanilombok.org`, the `DB_*` values, and
   `UPLOADS_PATH=/home/<user>/lontar-data/uploads`.
5. **Git.** Hostinger → Advanced → Git: repository `kuartal-id/rinjani-lontar`,
   branch `deploy`, auto-deploy on.
6. **Cron** (every minute): `cd /home/<user>/domains/lontar.rinjanilombok.org/public_html && /opt/alt/php84/usr/bin/php artisan app:post-deploy`
7. **Admin password.** Set once: `php artisan lontar:admin admin` (minimum 10
   characters). Without SSH, set `--password` in a one-off cron command and remove it
   afterwards.

## Checking a deployment

`bin/check-webroot.sh https://lontar.rinjanilombok.org` confirms that `.env`, `.git`,
`storage/`, `database/`, `vendor/` and the other private paths answer 403/404 while `/`,
`/api/health`, `/about` and the login page answer 200. Run after every hosting change.

## Rollback

Re-run the workflow for an earlier commit (Actions → Build deploy branch → Run workflow
on that ref). The uploads folder and database are outside git and are not affected.

## Notes

- Sessions and cache use files; the admin session lasts 7 days.
- Indonesian-first UI; every content field has an optional `*_en` translation.
- `/api/lontars` and `/api/health` return public JSON (no auth).
- Sample content is always flagged "Contoh/Sample" and `is_sample = true`; delete it
  from the admin panel once real manuscripts are imported.
