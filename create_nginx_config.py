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

    # server {{
    #     listen 443 ssl;
    #     server_name {domain} {www_domain};
    #     client_max_body_size 250m;

    #     ssl_certificate     /etc/letsencrypt/live/{domain}/fullchain.pem;
    #     ssl_certificate_key /etc/letsencrypt/live/{domain}/privkey.pem;

    #     location / {{
    #         include proxy_params;
    #         proxy_set_header Host $http_host;
    #         proxy_set_header X-Real-IP $remote_addr;
    #         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    #         proxy_set_header X-Forwarded-Proto $scheme;
    #         proxy_pass http://127.0.0.1:{port};
    #     }}
    # }}
    """
    return config

def save_nginx_config(config, domain):
    file_path = f"/etc/nginx/sites-available/{domain}.conf"
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

def setup_ssl(domain):
    try:
        print("Setting up SSL certificate with Certbot...")
        subprocess.run(['sudo', 'apt', 'install', '-y', 'certbot', 'python3-certbot-nginx'], check=True)
        subprocess.run([
            'sudo', 'certbot', '--nginx', '-d', domain, '-m', f'info@{domain}', '--agree-tos', '--noninteractive'
        ], check=True)
        print(f"SSL setup completed for {domain}.")
    except subprocess.CalledProcessError as e:
        print(f"Error during Certbot SSL setup: {e}")

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
        subprocess.run(['sudo', 'ln', '-sf', 
                        f"/etc/nginx/sites-available/{domain}.conf", 
                        f"/etc/nginx/sites-enabled/{domain}.conf"], check=True)
        print(f"Site {domain} enabled.")
    except subprocess.CalledProcessError as e:
        print(f"Error creating symbolic link: {e}")
        sys.exit(1)

    try:
        subprocess.run(['sudo', 'nginx', '-t'], check=True)
        subprocess.run(['sudo', 'systemctl', 'restart', 'nginx'], check=True)
        print("Nginx restarted successfully.")
    except subprocess.CalledProcessError as e:
        print(f"Nginx configuration error: {e}")
        sys.exit(1)

    #setup_ssl(domain)

if __name__ == "__main__":
    main()