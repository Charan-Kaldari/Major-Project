name: Face Attendance CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.11"

      - name: Install system deps (cmake, dlib)
        run: |
          sudo apt-get update
          sudo apt-get install -y cmake libboost-all-dev

      - name: Install Python deps
        run: pip install -r requirements.txt

      - name: Run tests
        run: pytest backend/tests/ -v
        env:
          SECRET_KEY: test-secret
          DATABASE_URL: sqlite+aiosqlite:///./test.db

  frontend-build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: frontend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
          cache-dependency-path: frontend/package-lock.json

      - run: npm ci
      - run: npm run build
