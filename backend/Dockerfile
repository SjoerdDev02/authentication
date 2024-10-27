# Use the latest Rust image as the build stage
FROM --platform=linux/amd64 rust:latest as builder

# Set up the Rust workspace and copy dependencies
WORKDIR /backend
COPY Cargo.toml Cargo.lock ./

# Copy source files
COPY src ./src

# Build the project in release mode
RUN cargo build --release

# List the contents of the target/release directory to check for the binary
RUN ls -l /backend/target/release/

# Use a small base image to run the binary
FROM --platform=linux/amd64 debian:buster-slim
WORKDIR /app

# Copy the built binary from the builder stage
COPY --from=builder /backend/target/release/auth_server .

# Expose the backend server port
EXPOSE 8080

# Run the Rust binary
CMD ["./auth_server"]  # Update to your binary name
