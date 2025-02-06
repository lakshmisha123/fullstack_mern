FROM node:16

# Install build tools required for bcrypt
RUN apt-get update && \
    apt-get install -y build-essential python3

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies but exclude bcrypt initially
RUN npm install && npm rebuild bcrypt --build-from-source

# Copy the rest of the application code
COPY . .

# Expose the port the app will run on
EXPOSE 5003

# Run the application when the container starts
CMD ["npm", "start"]
