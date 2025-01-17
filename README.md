## Running the Server

- **Start the server normally**: `npm start`
- **Run in development mode (auto-restart)**: `npm run dev`
- **Run in debug mode (with debugger)**: `npm run debug`

## Health Check

Access the health check route at `http://localhost:8080`:

```bash
curl -s http://localhost:8080 | jq
```
