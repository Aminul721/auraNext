# AURA HUMANOID TECH API

The Express API is a separate TypeScript application. It persists website
enquiries in MongoDB and serves a protected admin API. The Next.js app remains
the public frontend.

## Local setup

Use Node.js 22 LTS (or a supported current LTS) and npm. From the repository
root, use two terminals.

### Terminal 1 — MongoDB and API

1. Provide MongoDB. Either install MongoDB Community Server by following the
   [official installation guide](https://www.mongodb.com/docs/manual/installation/),
   then start its service, or create a free MongoDB Atlas cluster using the
   [Atlas getting-started guide](https://www.mongodb.com/docs/atlas/getting-started/).
2. For Atlas, create a database user, allow your development IP address in
   Network Access, and copy the cluster connection URI. Do not commit the URI.
3. Configure and start the API:

   ```sh
   cd backEnd
   npm install
   cp .env.example .env
   ```

   Edit `.env` and set `MONGODB_URI`. For a local MongoDB server, keep the
   example URI. For Atlas, use the private connection URI from Atlas.
   `JWT_ACCESS_SECRET` must be at least 32 characters. Generate one with:

   ```sh
   node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"
   ```

   Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` to create the initial admin account.
   The password must be at least 16 characters for account creation. Keep
   `.env` private and do not reuse this password.

   ```sh
   npm run create-admin
   npm run dev
   ```

   `create-admin` only creates an account if that email does not already exist.
   It hashes the password and offers no public registration route.

### Terminal 2 — Next.js frontend

```sh
cd frontEndNextJS
npm install
cp .env.local.example .env.local
npm run dev
```

The public API base URL defaults to `http://localhost:5000/api`; the example
sets `NEXT_PUBLIC_API_BASE_URL` explicitly. This `NEXT_PUBLIC_` value is visible
to browsers and must never contain a secret.

- Frontend: <http://localhost:3000>
- Backend: <http://localhost:5000>
- Health check: <http://localhost:5000/api/health>
- Admin login: <http://localhost:3000/admin/login>

The API will not listen until its environment is valid and MongoDB connects.
Health returns the MongoDB connectivity state and uses HTTP 503 when it is
disconnected.

## Configuration

`backend/.env.example` documents the variables. Required at API startup:

| Variable | Purpose |
|---|---|
| `NODE_ENV` | `development`, `test`, or `production` |
| `PORT` | Express listening port; defaults to `5000` |
| `MONGODB_URI` | Private MongoDB connection string |
| `FRONTEND_URL` | Exact allowed browser origin(s), comma-separated |
| `JWT_ACCESS_SECRET` | Private HMAC secret, at least 32 characters |
| `JWT_ACCESS_EXPIRES_IN` | Short access-token duration, default `15m` |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Initial-admin setup input; only required by the setup script |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM` | Optional SMTP configuration; supply all together |
| `ENQUIRY_NOTIFICATION_EMAIL` | Notification destination; defaults to the official admin email |

Never set secrets using `NEXT_PUBLIC_*`. Environment validation reports variable
names and safe messages, not configured values. SMTP is optional; when absent,
enquiries are still stored.

## API

All responses use JSON. Admin endpoints require
`Authorization: Bearer <accessToken>`. Login tokens are signed using HS256,
expire quickly, and are held in frontend memory only. They are not written to
local or session storage; refreshing the admin page requires signing in again.
There are no auth cookies, so the API does not rely on cookie-based
authentication or CSRF tokens. Client logout clears the in-memory token; a
copied token remains usable until its short expiry.

| Method | Path | Access | Purpose |
|---|---|---|---|
| `GET` | `/api/health` | Public | API and MongoDB status |
| `POST` | `/api/enquiries` | Public, rate-limited | Validate and save an enquiry |
| `POST` | `/api/auth/login` | Public, rate-limited | Admin login |
| `POST` | `/api/auth/logout` | Public | Logout acknowledgement; client clears its in-memory token |
| `GET` | `/api/auth/me` | Admin | Verify token and active admin |
| `GET` | `/api/admin/dashboard` | Admin | Status counts and five recent enquiries |
| `GET` | `/api/admin/enquiries` | Admin | Filter/search/paginate enquiries |
| `GET` | `/api/admin/enquiries/:id` | Admin | Read one enquiry |
| `PATCH` | `/api/admin/enquiries/:id` | Admin | Update only its `status` |
| `DELETE` | `/api/admin/enquiries/:id` | Admin | Soft-delete an enquiry from admin results |

Enquiry status values are `new`, `contacted`, `in_progress`, `completed`, and
`spam`. The admin search matches name, email, or company. Page size is limited
to 100. Delete is soft: the record remains in MongoDB with a deletion timestamp
and is hidden from admin results and dashboard totals.

### Submit an enquiry

```sh
curl -X POST http://localhost:5000/api/enquiries \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Example Visitor",
    "email": "visitor@example.com",
    "service": "Corporate Events",
    "message": "Please contact me about an upcoming event."
  }'
```

A `201` means the application saved the enquiry in MongoDB. It does not claim
that a notification email was delivered. If SMTP is configured, the API attempts
a notification after saving; mail-provider failures are logged without losing
the enquiry or changing the successful save response.

## Data models

- **Enquiry:** name, normalized email, optional phone/company/service/date/
  location, message, status, source, soft-delete timestamp, and timestamps.
  Indexes cover creation date, status/date, email, and soft deletion.
- **Admin:** unique normalized email, bcrypt password hash, fixed `admin` role,
  active flag, last-login timestamp, and timestamps. Password hashes are
  excluded from normal reads and never returned.

## Admin frontend

- `/admin/login`: admin-only sign-in form.
- `/admin/dashboard`: status totals and recent enquiries.
- `/admin/enquiries`: search, status filter, and pagination.
- `/admin/enquiries/:id`: enquiry details, status updates, and confirmed
  soft-delete.

The browser stores the short-lived bearer token only in React memory. Hiding
admin pages is not the security boundary: every admin API route independently
verifies the token and role.

## Checks

Run from `backEnd`:

```sh
npm run typecheck
npm run lint
npm test
npm run build
```

The API tests use an isolated `mongodb-memory-server` database and do not touch
local or production data.

## Production deployment

Deploy Next.js and Express separately, use MongoDB Atlas with a least-privilege
database user, and configure HTTPS on both public services. Set
`NEXT_PUBLIC_API_BASE_URL` to the public API origin plus `/api`, and configure
backend `FRONTEND_URL` to the exact frontend origin. Set backend secrets only
in the backend hosting provider's secret manager. Configure SMTP only if
notifications are required. Enable backups and monitor API, database, and mail
provider health. Do not deploy, provision paid services, or change DNS as part
of this setup.

The in-memory rate limiter is process-local. For multi-instance production
deployment, use a shared rate-limit store before scaling the API horizontally.
