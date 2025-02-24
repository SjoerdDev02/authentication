# NextJS/Rust Authentication

This project provides a simple authentication system using Next.js for the frontend, Rust for the backend, and MySQL for the database. Redis is used for session management, and Docker is used for containerizing the services.

## Technologies Used

- **Frontend**: Next.js
- **Backend**: Rust (with Axum for the server)
- **Database**: MySQL (with MySQL Workbench for management)
- **Session Management**: Redis
- **Package Manager**: Yarn (for frontend), Cargo (for backend)
- **Docker**: For containerization

## Prerequisites

Before you start, make sure you have the following installed on your machine:

- [Docker](https://www.docker.com/get-started) for containerizing the services.
- [Yarn](https://classic.yarnpkg.com/en/docs/install) for managing frontend dependencies.
- [Rust](https://www.rust-lang.org/tools/install) for the backend.
- [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) for managing the MySQL database.
- [SQLx CLI](https://github.com/launchbadge/sqlx#cli) for managing MySQL migrations.
- [Redis CLI](https://redis.io/docs/management/cli/) for managing Redis (optional, if working directly with Redis).

## Setup

### 1. Clone the repository

Clone the repository to your local machine:

```bash
git clone https://github.com/SjoerdDev02/authentication
cd authentication
```

### 2. Setup the MySQL Database

Ensure that your MySQL service is running. You can use MySQL Workbench to connect and manage the database.

1. Create a new database (e.g., `authentication`).
2. Configure your database connection in the backend Rust application (this typically involves setting up the database URL and credentials in `.env` or configuration files).
3. To manage the database schema and migrations, you can use SQLx CLI:

   ```bash
   # Install SQLx CLI if not installed
   cargo install sqlx-cli --no-default-features --features mysql

   # Run the migrations
   sqlx migrate run
   ```

3. Set Up Environment Variables

Create .env files in the root directories of both the frontend and backend projects. You can use the .env.example files as templates—simply copy their contents into new .env files and customize the values to suit your configuration. These environment variables are essential for configuring Docker images and are utilized throughout the application's execution.

### 4. Docker Setup

This project uses Docker for containerization. We have a `docker-compose.yml` to set up the services.

1. Build and start the services:

   ```bash
   docker-compose up --build
   ```

   This will start the MySQL, Redis, and your application containers.

2. Verify the services:
   - MySQL is available on port 3306.
   - Redis is available on port 6379.

### 5. Backend Setup (Rust)

The backend is built using Rust. To set up the backend:

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies and run the backend:

   ```bash
   cargo run
   ```

   This will start the Rust server, which listens for requests from the frontend.

### 6. Frontend Setup (Next.js)

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install frontend dependencies using Yarn:

   ```bash
   yarn install
   ```

3. Run the Next.js application:

   ```bash
   yarn dev
   ```

   The frontend will be available at [http://localhost:3000](http://localhost:3000).

### 7. Authentication & Cookies

- **Session Cookies**: Authentication is handled using cookies, which only work with HTTPS and SameSite domains for security reasons.
- If you're running locally, consider using a tool like [ngrok](https://ngrok.com/) to expose your local environment to HTTPS.

### 8. Redis CLI

If you want to interact with Redis, you can use the `redis-cli`:

```bash
redis-cli
```

### 9. Database Management with MySQL Workbench

- Connect to MySQL using the connection details from your `docker-compose.yml`.
- Use MySQL Workbench to query and manage the database.

## Environment Variables

The application uses the following environment variables:

### Backend (Rust):

- `DATABASE_URL`: The connection URL for MySQL (e.g., `mysql://user:password@localhost:3306/auth_db`).
- `REDIS_URL`: The connection URL for Redis (e.g., `redis://localhost:6379`).
- `JWT_SECRET`: The secret key used for JWT token generation.

### Frontend (Next.js):

- `NEXT_PUBLIC_API_URL`: The base URL for the API, typically `http://localhost:8080` in local development.

### Docker Compose:

The Docker Compose file will automatically set the environment variables for MySQL and Redis.

## Troubleshooting

- **Database connection issues**: Ensure that MySQL and Redis are running and accessible from both the frontend and backend containers.
- **Cookies not working**: Make sure you're running the app over HTTPS in production environments to ensure cookies are sent with the correct settings (`Secure`, `SameSite`).

## Useful Commands

- **Run SQL migrations**:

  ```bash
  sqlx migrate run
  ```

- **Start Docker services**:

  ```bash
  docker-compose up --build
  ```

- **Stop Docker services**:

  ```bash
  docker-compose down
  ```

- **Access Redis CLI**:

  ```bash
  redis-cli