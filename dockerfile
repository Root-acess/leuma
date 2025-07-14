# Use Node base image
FROM node:20.19.0

# Set working directory in container
WORKDIR /app

# Copy only dependency definition files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app’s code
COPY . .

# Build your app
RUN npm run build

# Install static server for production
RUN npm install -g serve

# Expose production port
EXPOSE 3000

# Start the production server
CMD ["serve", "-s", "dist", "-l", "3000"]
