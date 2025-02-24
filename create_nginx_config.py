import sys
import os
import subprocess

def generate_nginx_config(domain, port):
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

def save_nginx_config(config, domain):
    file_path = f"/etc/nginx/sites-available/{domain}"
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

def main():
    if len(sys.argv) != 3:
        print("Usage: python3 create_nginx_config.py <domain> <port>")
        sys.exit(1)

    domain = sys.argv[1]
    
    try:
        port = int(sys.argv[2])
    except ValueError:
        print("Port must be a valid number.")
        sys.exit(1)

    nginx_config = generate_nginx_config(domain, port)
    save_nginx_config(nginx_config, domain)

    try:
        # Remove default configuration
        remove_default_nginx()

        # Create symlink for the new site
        subprocess.run(['sudo', 'ln', '-sf', 
                        f"/etc/nginx/sites-available/{domain}", 
                        f"/etc/nginx/sites-enabled/{domain}"], check=True)
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

if __name__ == "__main__":
    main()