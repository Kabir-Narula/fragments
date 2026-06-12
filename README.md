# Fragments API

Back-end API for **BSD Cloud Computing** at Seneca — a microservice for storing and converting text and image fragments.

## Features

- REST API for fragment CRUD
- Text and image fragment types with conversion
- JWT authentication
- Integration and unit tests (Jest, Hurl)

## Stack

Node.js · Express · AWS S3 · Jest

## Run locally

```bash
npm install
cp .env.example .env   # configure AWS and auth secrets
npm run dev
npm test
```

## Author

Kabir Narula — [GitHub](https://github.com/Kabir-Narula)
