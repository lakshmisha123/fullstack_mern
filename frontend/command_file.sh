#!/bin/bash

cd frontend
# Upgrade packages
sudo apt upgrade -y

# Remove lock files
sudo rm /var/cache/apt/archives/lock
sudo rm /var/lib/dpkg/lock-frontend
sudo rm /var/lib/dpkg/lock

# Update package lists
sudo apt update

# Install Node.js and npm
sudo apt install -y nodejs npm

# Install dependencies
npm install

# Install and configure UFW
sudo apt install -y ufw
sudo ufw allow 3000
sudo ufw allow 5000
sudo ufw enable

# Start the application
npm run start
