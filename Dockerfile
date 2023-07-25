# Stage 1: Build the Vite.js project
FROM node:16 as builder

WORKDIR /app

# Copy package.json and yarn.lock (or package-lock.json if using npm)
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the entire project to the container
COPY . .

# Build the Vite.js project
RUN yarn build

# Stage 2: Create a lightweight container for serving the static files
FROM nginx:alpine

# Remove default nginx configuration
RUN rm -rf /etc/nginx/conf.d

# Copy the built Vite.js project from the previous stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose the default HTTP port (change this if needed)
EXPOSE 80

# Start the nginx server
CMD ["nginx", "-g", "daemon off;"]
