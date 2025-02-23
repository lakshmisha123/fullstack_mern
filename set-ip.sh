#!/bin/bash

# Get Public IP Address
IP_ADDRESS=$(curl -s ifconfig.me)

# Ensure an IP address was found
if [ -z "$IP_ADDRESS" ]; then
    echo "Error: Could not determine public IP address."
    exit 1
fi

# Ensure .env file exists
if [ ! -f .env ]; then
    echo "Creating .env file..."
    touch .env
fi

# Update .env file with the public IP address
echo "REACT_APP_API_URL=http://$IP_ADDRESS:5003/api" > .env
echo "MONGO_URL=mongodb://$IP_ADDRESS:27017/test2" >> .env

# Allow required ports through ufw
echo "Allowing ports 3001, 5003, and 27017 through ufw..."
sudo ufw allow 3001
sudo ufw allow 5003
sudo ufw allow 27017

# Reload ufw to apply changes
sudo ufw reload

echo "Updated .env with Public IP: $IP_ADDRESS and allowed ports 3001, 5003, and 27017 through ufw."