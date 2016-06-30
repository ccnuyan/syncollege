# node

```
curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
sudo apt-get install -y nodejs
```

# git

```
sudo apt-get install -y git
sudo git clone http://github.com/ccnuyan/starc3_oauth2
```

# build-essential

```
sudo apt-get install -y build-essential
```

# node-sass

`sudo npm run itaobao node-sass --save`

# npm

```
sudo npm run itaobao
sudo npm run wp-build
```

# web

```
docker rm -f web
docker build -t web:0.0.1 -f Dockerfile.web .
docker run -d -p 8000:8000 -v /root/source:/etc/source --name web web:0.0.1
docker logs -f web
```

# api

```
docker rm -f api
docker build -t api:0.0.1 -f Dockerfile.api .
docker run -d -p 3000:3000 -v /root/source:/etc/source --name api api:0.0.1
docker logs -f api
```
