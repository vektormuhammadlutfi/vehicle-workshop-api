# Use the official Bun image from the Docker Hub
FROM oven/bun:1.1-debian

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy app files
COPY . .

# Install app dependencies
RUN bun install

# Run migrations
RUN bun migrate

# Run the application
CMD ["bun", "start"]
