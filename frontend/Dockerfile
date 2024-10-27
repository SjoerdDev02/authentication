# Use Node image compatible with ARM (for M1/M2 Macs)
FROM --platform=linux/amd64 node:18-alpine

# Set working directory in container
WORKDIR /app

# Copy package.json and yarn.lock, install dependencies with Yarn
COPY package.json yarn.lock ./
RUN yarn install

# Copy the rest of the app
COPY . .

# Build the Next.js app
RUN yarn build

# Expose port 3000
EXPOSE 3000

# Start Next.js
CMD ["yarn", "start"]