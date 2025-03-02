import sys
import os
import subprocess

def generate_nginx_config(domain, port):
    """Generate an Nginx configuration file for the given domain and port."""
    www_domain = f"www.{domain}"
    
    config = f"""
    server {{
        listen 80;
        client_max_body_size 250m;
        server_name {domain} {www_domain};
        
        location ^~ /.well-known {{
            root /etc/nginx/ssl/bot;
        }}
        
        location / {{
            include proxy_params;
            proxy_pass http://127.0.0.1:{port};
        }}
    }}
    """
    return config

def ensure_directory_exists(directory):
    """Ensure that the given directory exists."""
    if not os.path.exists(directory):
        try:
            os.makedirs(directory)
            print(f"Created directory: {directory}")
        except PermissionError:
            print(f"Permission denied: Cannot create {directory}. Run with sudo.")
            sys.exit(1)

def save_nginx_config(config, domain):
    """Save the Nginx configuration file to /etc/nginx/sites-available/."""
    file_path = f"/etc/nginx/sites-available/{domain}"
    
    ensure_directory_exists("/etc/nginx/sites-available")
    ensure_directory_exists("/etc/nginx/sites-enabled")
    ensure_directory_exists("/etc/nginx/ssl/bot")  # Ensuring SSL directory exists

    try:
        with open(file_path, 'w') as file:
            file.write(config)
        print(f"Configuration saved to {file_path}.")
    except PermissionError:
        print("Permission denied: You need sudo privileges.")
        sys.exit(1)
    except Exception as e:
        print(f"Error saving config: {e}")
        sys.exit(1)

def enable_firewall():
    """Allow only HTTP (port 80) through the firewall."""
    try:
        subprocess.run(["sudo", "ufw", "allow", "80"], check=True)
        print("Firewall updated: Allowed HTTP (80) only.")
    except subprocess.CalledProcessError as e:
        print(f"Error configuring firewall: {e}")

def remove_default_nginx():
    """Remove the default Nginx configuration if it exists."""
    default_site = "/etc/nginx/sites-enabled/default"
    if os.path.exists(default_site):
        try:
            subprocess.run(["sudo", "rm", "-f", default_site], check=True)
            print("Default Nginx configuration removed.")
        except subprocess.CalledProcessError as e:
            print(f"Error removing default Nginx configuration: {e}")

def stop_container_on_port(port):
    """Stops the Docker container running on the given port, if any."""
    try:
        # Find container using the given port
        result = subprocess.run(
            ["sudo", "docker", "ps", "--format", "{{.ID}}", "--filter", f"publish={port}"],
            capture_output=True, text=True, check=True
        )
        container_id = result.stdout.strip()

        if container_id:
            print(f"Stopping container {container_id} running on port {port}...")
            subprocess.run(["sudo", "docker", "stop", container_id], check=True)
            print(f"Container {container_id} stopped.")
            return container_id
        else:
            print(f"No container found running on port {port}.")
            return None
    except subprocess.CalledProcessError as e:
        print(f"Error stopping container: {e}")
        return None

def restart_container(container_id):
    """Restarts the Docker container after Nginx setup."""
    if container_id:
        try:
            print(f"Restarting container {container_id}...")
            subprocess.run(["sudo", "docker", "start", container_id], check=True)
            print(f"Container {container_id} restarted.")
        except subprocess.CalledProcessError as e:
            print(f"Error restarting container: {e}")

def main():
    """Main function to configure Nginx and restart necessary services."""
    if len(sys.argv) != 3:
        print("Usage: python3 create_nginx_config.py <domain> <port>")
        sys.exit(1)

    domain = sys.argv[1]
    
    try:
        port = int(sys.argv[2])
    except ValueError:
        print("Port must be a valid number.")
        sys.exit(1)

    # Stop container running on the specified port
    container_id = stop_container_on_port(port)

    # Generate Nginx configuration
    nginx_config = generate_nginx_config(domain, port)
    save_nginx_config(nginx_config, domain)

    try:
        # Remove default configuration
        remove_default_nginx()

        # Create symlink for the new site
        symlink_path = f"/etc/nginx/sites-enabled/{domain}"
        subprocess.run(['sudo', 'ln', '-sf', f"/etc/nginx/sites-available/{domain}", symlink_path], check=True)
        print(f"Site {domain} enabled.")
    except subprocess.CalledProcessError as e:
        print(f"Error enabling site: {e}")
        sys.exit(1)

    try:
        # Reload firewall rules
        enable_firewall()

        # Test Nginx configuration before restarting
        subprocess.run(['sudo', 'nginx', '-t'], check=True)
        subprocess.run(['sudo', 'systemctl', 'restart', 'nginx'], check=True)
        print("Nginx restarted successfully.")
    except subprocess.CalledProcessError as e:
        print(f"Nginx configuration error: {e}")
        sys.exit(1)

    # Restart the container after Nginx setup
    restart_container(container_id)

if __name__ == "__main__":
    main()