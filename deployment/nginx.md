## dev and prod shared the same nginx conf

```
upstream io_nodes {
     ip_hash;
     server www.syncollege.com;
}

server {
    listen 80;
    server_name www.syncollege.com;
    location /socket.io/{
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_http_version 1.1;
        proxy_pass http://io_nodes;
    }
    location /oauth/{
        proxy_pass http://localhost:3000/oauth/;
    }
    location /api/{
        proxy_pass http://localhost:3000/;
    }
    location /{
        proxy_pass http://localhost:8000/;
    }
}
```
