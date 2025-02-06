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
            return 301 https://$host$request_uri;
        }}
    }}

    server {{
        listen 443 ssl;
        server_name {domain} {www_domain};
        client_max_body_size 250m;
        

        location / {{
            proxy_set_header Host $http_host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_pass http://127.0.0.1:{port};
        }}

        #ssl_certificate     /etc/letsencrypt/live/{domain}/fullchain.pem;
        #ssl_certificate_key /etc/letsencrypt/live/{domain}/privkey.pem;
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
        print("Permission denied: You need sudo privileges to write to this directory.")
    except Exception as e:
        print(f"An error occurred while saving config: {e}")

def setup_ssl(domain):
    # Set up SSL with Certbot (assuming Certbot is installed)
    try:
        print("Setting up SSL certificate with Certbot...")
        
        # Install certbot and dependencies
        subprocess.run(['sudo', 'apt', 'install', '-y', 'certbot', 'python3-certbot-nginx'], check=True)
        
        # Generate SSL certificate
        subprocess.run([
            'sudo', 'certbot', 'certonly', '--standalone', '-d', domain, 
            '--staple-ocsp', '-m', f'info@{domain}', '--agree-tos', '--noninteractive'
        ], check=True)

        print(f"SSL setup completed for {domain}.")
    except subprocess.CalledProcessError as e:
        print(f"Error during Certbot SSL setup: {e}")

def main():
    if len(sys.argv) != 3:
        print("Usage: python3 create_nginx_config.py <domain> <port>")
        sys.exit(1)
    
    domain = sys.argv[1]
    port = sys.argv[2]

    if not domain or not port:
        print("Both domain and port must be provided.")
        sys.exit(1)

    # Generate the nginx configuration
    nginx_config = generate_nginx_config(domain, port)

    # Save the config to the appropriate Nginx directory
    save_nginx_config(nginx_config, domain)

    # Optionally create a symbolic link to enable the site
    try:
        os.symlink(f"/etc/nginx/sites-available/{domain}", f"/etc/nginx/sites-enabled/{domain}")
        print(f"Site {domain} enabled.")
    except FileExistsError:
        print(f"Site {domain} is already enabled.")
    except Exception as e:
        print(f"Error creating symbolic link: {e}")

    # Restart Nginx to apply changes
    try:
        subprocess.run(['sudo', 'systemctl', 'restart', 'nginx'], check=True)
        print("Nginx restarted successfully.")
    except subprocess.CalledProcessError as e:
        print(f"Error restarting Nginx: {e}")
    
    # Set up SSL using Certbot
    setup_ssl(domain)

if __name__ == "__main__":
    main()
