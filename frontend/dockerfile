# Use the official Node.js image
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Install build dependencies required for compiling native modules (bcrypt in this case)
RUN apt-get update && apt-get install -y build-essential python3

# Copy the package.json and package-lock.json first
COPY package*.json ./

# Install app dependencies, which should now rebuild bcrypt from source
RUN npm install

# Copy the rest of the application code
COPY . .

# Declare expected arguments
ARG MONGO_URI
ARG PORT

# Set environment variables from arguments
ENV MONGO_URI=$MONGO_URI
env PORT=$PORT

# Expose the port the app will run on (use ENV variable)
EXPOSE $PORT

# Run the app when the container starts
CMD ["npm", "start"]