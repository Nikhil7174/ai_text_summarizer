# Use an official Node.js runtime as a parent image
FROM node:latest

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Set environment variables
ENV PORT=5000
ENV AZURE_OPENAI_KEY=<>
ENV AZURE_OPENAI_ENDPOINT=https://ping.openai.azure.com/

# Expose the port the app runs on
EXPOSE $PORT

# Command to run the application
CMD ["node", "server.js"]