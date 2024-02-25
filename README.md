# Banking API

This project is the API to connect with Belvo

## Run Locally

Easily you con run this project following next steps:

1. Clone repository

```sh
git clone
```

2. Install packages

```sh
npm install
```

3. Create your `wrangler.toml` file, you can take a hint on `wrangler.example.toml` to know which variables you need

```sh
# Supabase
SUPABASE_PROJECT_URL=<SUPABASE_PROJECT_URL>
SUPABASE_API_KEY=<SUPABASE_API_KEY>
SUPABASE_DATABASE_PASSWORD=<SUPABASE_DATABASE_PASSWORD>
# Belvo
BELVO_SECRET_KEY_ID=<BELVO_SECRET_KEY_ID>
BELVO_SECRET_PASSWORD=<BELVO_SECRET_PASSWORD>
BELVO_BASE_URL=<BELVO_BASE_URL>
```

4. Run project

```sh
npm run dev
```

4. Now you can see on console which port is running your project

```sh
# Example
http://localhost:8787
```
