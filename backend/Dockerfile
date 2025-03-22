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

# Build the project
RUN cargo build --release

# Use a small base image to run the binary
FROM debian:bookworm-slim
WORKDIR /app

# Update packages, install CA certificates, and OpenSSL 3
RUN apt-get update && apt-get install -y libssl3 ca-certificates && rm -rf /var/lib/apt/lists/*

# Configure SSL certificates
RUN update-ca-certificates

# Copy the built binary and migration files from the builder stage
COPY --from=builder /backend/target/release/api /app/api_server
COPY --from=builder /backend/migrations /app/migrations
COPY --from=builder /usr/local/cargo/bin/sqlx /usr/local/bin/sqlx
COPY src/static/images /app/src/static/images
COPY src/translations /app/src/translations

# Expose the backend server port
EXPOSE 8080

# Run the Rust binary
CMD ["sh", "-c", "sqlx migrate run && /app/api_server"]
