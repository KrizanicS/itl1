# ITL1 - Ionic React Project

## Project Initialization

This project was created using the Ionic CLI with React and TypeScript.

### Prerequisites

- Node.js (v12 or higher)
- npm or yarn
- Ionic CLI
- Docker Desktop (for database)

### Installation of Ionic CLI

```bash
npm install -g @ionic/cli
```

### Project Creation

The project was initialized with:

```bash
ionic start ionic blank --type=react --capacitor
```

---

# Laborbericht

## 1. Database Connection

### 1.1 Übersicht

Die Ionic App verbindet sich über eine PHP REST-API mit einer MySQL-Datenbank. Die Kommunikation erfolgt über HTTP-Requests.

### 1.2 Architektur

```
┌─────────────────┐     HTTP      ┌─────────────────┐     PDO       ┌─────────────────┐
│   Ionic App     │ ──────────▶  │    PHP API      │ ──────────▶  │     MySQL       │
│   (Frontend)    │   JSON       │   (Backend)     │              │   (Database)    │
│   Port: 8100    │ ◀──────────  │   Port: 8081    │ ◀──────────  │   Port: 3306    │
└─────────────────┘              └─────────────────┘              └─────────────────┘
```

### 1.3 API Service (Frontend)

Die Verbindung zur API wird über den `ApiService` in TypeScript hergestellt:

**Datei:** `ionic/src/services/ApiService.ts`

```typescript
const API_BASE_URL = 'http://localhost:8081';

export interface Item {
  id: number;
  name: string;
  created_at?: string;
}

export const ApiService = {
  // Alle Items abrufen
  async getItems(): Promise<Item[]> {
    const response = await fetch(`${API_BASE_URL}/items`);
    return response.json();
  },

  // Neues Item erstellen
  async createItem(name: string): Promise<Item> {
    const response = await fetch(`${API_BASE_URL}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    return response.json();
  },

  // Item löschen
  async deleteItem(id: number): Promise<void> {
    await fetch(`${API_BASE_URL}/items/${id}`, { method: 'DELETE' });
  },
};
```

### 1.4 PHP API (Backend)

Die API stellt die Verbindung zur Datenbank über PDO her:

**Datei:** `api/index.php`

```php
$host = 'mysql';
$dbname = 'itl1_db';
$username = 'itl1_user';
$password = 'itl1_password';

$pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
```

### 1.5 Datenbank Schema

**Datei:** `database/init.sql`

```sql
CREATE TABLE IF NOT EXISTS items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 1.6 Docker Konfiguration

Alle Services werden über Docker Compose orchestriert:

| Service | Container | Port | Beschreibung |
|---------|-----------|------|--------------|
| MySQL | itl1_mysql | 3307 (extern) | Datenbank |
| phpMyAdmin | itl1_phpmyadmin | 8080 | DB-Administration |
| PHP API | itl1_api | 8081 | REST-Schnittstelle |

### 1.7 Verbindung testen

1. Docker-Services starten:
   ```bash
   docker-compose up -d
   ```

2. Health-Check der API:
   ```bash
   curl http://localhost:8081/health
   ```
   Erwartete Antwort: `{"status":"ok","database":"connected"}`

3. Items abrufen:
   ```bash
   curl http://localhost:8081/items
   ```

---

## 2. Node.js Backend mit JWT Authentifizierung

### 2.1 Übersicht

Umstellung des Backends von PHP auf **Node.js mit Express, Sequelize und Passport JWT**. Das System ermöglicht Benutzerregistrierung, Login und geschützte Routen.

### 2.2 Architektur

```
┌─────────────────┐     HTTP      ┌─────────────────┐   Sequelize   ┌─────────────────┐
│   Ionic App     │ ──────────▶  │  Node.js API    │ ──────────▶  │     MySQL       │
│   (React/TSX)   │   JWT Token  │  (Express)      │              │   (Database)    │
│   Port: 8100    │ ◀──────────  │   Port: 8081    │ ◀──────────  │   Port: 3306    │
└─────────────────┘              └─────────────────┘              └─────────────────┘
```

### 2.3 Backend Struktur

```
api/
├── index.js              # Express Server
├── package.json          # Dependencies
├── config/
│   ├── database.js       # Sequelize Konfiguration
│   └── passport.js       # JWT Strategie
├── models/
│   └── User.js           # User Model mit bcrypt
└── routes/
    └── auth.js           # Auth Endpoints
```

### 2.4 API Endpoints

| Methode | Endpoint | Beschreibung |
|---------|----------|--------------|
| POST | /api/auth/register | Benutzer registrieren |
| POST | /api/auth/login | Anmelden (JWT Token erhalten) |
| GET | /api/auth/profile | Profil abrufen (JWT geschützt) |
| PUT | /api/auth/profile | Profil aktualisieren (JWT geschützt) |

### 2.5 Verwendete Technologien

- **Express** - Web Framework
- **Sequelize** - ORM für MySQL
- **Passport + JWT** - Authentifizierung
- **bcryptjs** - Passwort-Hashing

### 2.6 Frontend Seiten (TSX)

| Datei | Beschreibung |
|-------|--------------|
| Login.tsx | Login-Formular |
| Register.tsx | Registrierungs-Formular |
| Profile.tsx | Profil-Seite (geschützt) |
| ApiService.ts | API-Kommunikation mit Token |

### 2.7 Testen

1. Docker starten:
   ```bash
   docker-compose up --build
   ```

2. Registrieren unter `http://localhost:8100/register`

3. Login unter `http://localhost:8100/login`

---

## 3. (Nächster Abschnitt)

---

# Referenz

## Getting Started

1. **Start the database services** (from the project root):
   ```bash
   docker-compose up -d
   ```

2. **Navigate to the Ionic app**:
   ```bash
   cd ionic
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the development server**:
   ```bash
   ionic serve
   ```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Runs the app in development mode |
| `npm run build` | Builds the app for production |
| `npm test` | Runs the test suite |
| `npm run lint` | Lints the source code |

## Tech Stack

- **Framework:** Ionic 7
- **UI Library:** React 18
- **Language:** TypeScript
- **Routing:** React Router 5
- **PWA Support:** Workbox (service worker)
- **Backend:** PHP API with MySQL
- **Database:** MySQL 8.0
- **Admin:** phpMyAdmin

## Docker Services

### Starting Services

```bash
docker-compose up -d
```

This starts:
- **MySQL** on port `3307`
- **phpMyAdmin** on port `8080` → [http://localhost:8080](http://localhost:8080)
- **PHP API** on port `8081` → [http://localhost:8081](http://localhost:8081)

### Database Credentials

| Setting | Value |
|---------|-------|
| Host | localhost |
| Database | itl1_db |
| User | itl1_user |
| Password | itl1_password |
| Root Password | rootpassword |

### Stopping Services

```bash
docker-compose down
```

To also remove the database volume:

```bash
docker-compose down -v
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Health check |
| GET | /items | Get all items |
| POST | /items | Create a new item |
| DELETE | /items/:id | Delete an item |
