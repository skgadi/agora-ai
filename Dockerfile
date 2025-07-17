# Stage 1: Build the Quasar Client (No change needed here)
#------------------------------------
FROM node:20-alpine AS client-builder
WORKDIR /app/client
COPY client/ ./
RUN yarn install --frozen-lockfile
RUN yarn quasar build


# Stage 2: Build the Node.js TypeScript Server (No change needed here)
#------------------------------------
FROM node:20-alpine AS server-builder
WORKDIR /app/server
COPY server/package.json ./
RUN npm install
COPY server/ ./
RUN npm run build


# Stage 3: Final Production Image
#------------------------------------
FROM node:20-alpine AS production

WORKDIR /app

# Create the /app/dist directory first
RUN mkdir -p /app/dist

# Copy the compiled server code from the server-builder stage into /app/dist
COPY --from=server-builder /app/server/dist /app/dist

# IMPORTANT: Copy server dependency manifests into /app/dist
# So npm install runs *inside* the folder where the app will effectively run.
COPY server/package.json server/package-lock.json /app/dist/

# Set WORKDIR to /app/dist for installing dependencies
WORKDIR /app/dist

# Install ONLY production dependencies in /app/dist
RUN npm install --omit=dev

# Change back to /app to copy client files to /app/public
WORKDIR /app

# Copy the built client code from the client-builder stage into the server's public folder
COPY --from=client-builder /app/client/dist/spa ./public

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application.
# Note: The server entry file is now relative to /app/dist
CMD ["node", "dist/server.js"] 