# Use the latest Rust image as the build stage
FROM rust:latest as builder

# Set up the Rust workspace and copy dependencies
WORKDIR /backend
COPY Cargo.toml Cargo.lock ./

# Copy source files
COPY src ./src
COPY migrations ./migrations

# Build the project in release mode
RUN cargo build --release

# Use a small base image to run the binary
FROM debian:bookworm-slim
WORKDIR /app

# Update packages and install OpenSSL 3
RUN apt-get update && apt-get install -y libssl3 && rm -rf /var/lib/apt/lists/*

# Copy the built binary from the builder stage explicitly
COPY --from=builder /backend/target/release/auth_server /app/auth_server

# Expose the backend server port
EXPOSE 8080

# Run the Rust binary
CMD ["/app/auth_server"]

