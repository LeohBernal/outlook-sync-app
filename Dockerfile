# Use a base image
FROM node:20-alpine3.18

# Set the working directory
WORKDIR /app

# Copy the application files to the container
COPY . .

# Install dependencies (if any)
RUN npm install

# Expose the necessary ports
EXPOSE 3000

# Define the command to run the application
CMD ["npm", "start"]