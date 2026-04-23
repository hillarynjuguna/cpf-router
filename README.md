# CPF Router

**τ-Node Handoff Protocol & CPF Export Pipeline**

CPF Router is a Progressive Web App (PWA) designed to manage context handoffs between AI nodes (τ-nodes). It provides a structured interface for routing context, analyzing source outputs, tracking risk indicators, and exporting formal Context Preservation Format (CPF) packets.

## Features

- **PWA Ready**: Installable as a standalone app on desktop and mobile.
- **Offline Capable**: Uses a Service Worker for offline functionality and caching.
- **Local Storage**: Persists state locally so you don't lose your work between sessions.
- **Visual Risk Indicators**: Track the risk level of different context layers (Critical, High, Medium, Low, τ).
- **CPF Auto-Structurer**: Helps format the objective, current state, key insights, unresolved questions, and next tasks for clean handoffs.

## Architecture

The project is built using vanilla web technologies for maximum performance and portability:
- `index.html`: The main UI shell.
- `app.js`: Handles UI wiring, DOM manipulation, and state binding.
- `rules.js`: Contains the core routing engine and export pipeline as pure functions (isolated for testing).
- `storage.js`: Abstracts `localStorage` behind a simple API for persistence.
- `sw.js`: The Service Worker for caching and offline support.
- `manifest.webmanifest`: Defines the PWA installation properties and assets.

## Development

Since this is a vanilla web application, no build steps are required. 

To run it locally, you can use any local web server. For example, using Python:
```bash
python -m http.server 8000
```
Or using Node.js (`serve`):
```bash
npx serve .
```

Then open `http://localhost:8000` (or the provided port) in your browser.

## License

MIT
