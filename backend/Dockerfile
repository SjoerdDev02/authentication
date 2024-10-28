# Use the latest Rust image as the build stage
FROM rust:latest as builder

# Set up the Rust workspace and copy dependencies
WORKDIR /backend
COPY Cargo.toml Cargo.lock ./

# Install SQLx CLI
RUN cargo install sqlx-cli --no-default-features --features mysql

# Copy source files and migrations
COPY src ./src
COPY migrations ./migrations

# Build the project in release mode
RUN cargo build --release

# Use a small base image to run the binary
FROM debian:bookworm-slim
WORKDIR /app

# Update packages and install OpenSSL 3
RUN apt-get update && apt-get install -y libssl3 && rm -rf /var/lib/apt/lists/*

# Copy the built binary and migration files from the builder stage
COPY --from=builder /backend/target/release/auth_server /app/auth_server
COPY --from=builder /backend/migrations /app/migrations
COPY --from=builder /usr/local/cargo/bin/sqlx /usr/local/bin/sqlx
COPY src/static/images /app/src/static/images

# Expose the backend server port
EXPOSE 8080

# Run the Rust binary
CMD ["sh", "-c", "sqlx migrate run && /app/auth_server"]
