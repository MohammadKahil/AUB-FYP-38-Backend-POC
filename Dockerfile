# Use the official Node.js base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

ENV NODE_PATH=/app/dist
ENV CORS_DOMAINS = http://frontend:3000, http://frontend:3001, https://example.com
ENV DB_HOST=db
ENV DB_USER=root
ENV DB_PASS=Password123fds.
ENV DB_NAME=jobs
ENV ACCESS_TOKEN_SECRET=brother
ENV REFRESH_TOKEN_SECRET=brother
ENV ADMIN_PASSWORD=Password@123

# Copy package.json and package-lock.json to the container's working directory
COPY package*.json ./
RUN npm cache clean --force

# Install project dependencies
RUN npm install
RUN npm rebuild bcrypt --build-from-source


# Copy the rest of your application files to the container's working directory
COPY . .

# Build the TypeScript project
RUN npm run build

# Expose the port your Node.js application is running on (replace 3000 with your desired port)
EXPOSE 8000

# Start your Node.js application
CMD ["npm", "start"]