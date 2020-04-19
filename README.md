# habla

## live api endpoint: https://mighty-taiga-42387.herokuapp.com/

## Local dev setup

If using user `dunder-mifflin`:

```bash
mv example.env .env
createdb -U dunder-mifflin spaced-repetition
createdb -U dunder-mifflin spaced-repetition-test
```

If your `dunder-mifflin` user has a password be sure to set it in `.env` for all appropriate fields. Or if using a different user, update appropriately.

```bash
npm install
npm run migrate
env MIGRATION_DB_NAME=spaced-repetition-test npm run migrate
```

And `npm test` should work at this point

## Configuring Postgres

For tests involving time to run properly, configure your Postgres database to run in the UTC timezone.

1. Locate the `postgresql.conf` file for your Postgres installation.
   1. E.g. for an OS X, Homebrew install: `/usr/local/var/postgres/postgresql.conf`
   2. E.g. on Windows, _maybe_: `C:\Program Files\PostgreSQL\11.2\data\postgresql.conf`
   3. E.g  on Ubuntu 18.04 probably: '/etc/postgresql/10/main/postgresql.conf'
2. Find the `timezone` line and set it to `UTC`:

```conf
# - Locale and Formatting -

datestyle = 'iso, mdy'
#intervalstyle = 'postgres'
timezone = 'UTC'
#timezone_abbreviations = 'Default'     # Select the set of available time zone
```

## Overview

- Stack:
  - Client: React.js, HTML5, CSS3
  - Web Server: Node and Express with PostgreSQL 
  - Database: Locally hosted PostgreSQL 
  - Tests: Supertest, Chai, Mocha

## Endpoints
- /api/language
    - /api/language retrieves the words of the language Spanish.
    - /api/language/head retrieves the head of the words list.
    - /api/language/guess sends the user's response to the server,
    then the answer is checked. If the answer is true, the server will send a message indicating it & if the answer is false the server will send a message indicating it. The current word will then be moved M spaces back (1 space if guess was incorrect & 2 spaces if guess was correct) in the database. The word's correct/incorrect score will be updated, along with the user's total score.

- /api/auth
    - /api/auth/login endpoint is used to verify a user has an existing account and to sign in to his / her account.

- /api/user
    - /api/user endpoint is used to create an account for the user. Verifies that the user has input a valid username and password.

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests mode `npm test`

Run the migrations up `npm run migrate`

Run the migrations down `npm run migrate -- 0`
