> docker mongodb [https://hub.docker.com/r/library/mongo](https://hub.docker.com/r/library/mongo)

>built-in roles [https://docs.mongodb.org/manual/reference/built-in-roles/](https://docs.mongodb.org/manual/reference/built-in-roles/)

# start a server
> 1 dev && test

```
docker run -p 27017:27017 -d --name mongo mongo:3 --auth
```

> 2 prod

```
docker run -p 30000:27017 -d --name mongo mongo:3 --auth
```

# connect to it

```
docker exec -it mongo mongo admin
```

## create userAdmin
> 1 dev && test

```
//create admin
use admin
db.createUser({user:'dbadmin',pwd:'adminpass',roles:['userAdminAnyDatabase','dbAdminAnyDatabase']})

db.auth('dbadmin','adminpass')

//create user
//dev test 的用户名与密码应该一致
use syncollege_dev
db.createUser({user:'user',pwd:'pass',roles:['dbAdmin','readWrite']})

use syncollege_test
db.createUser({user:'user',pwd:'pass',roles:['dbAdmin','readWrite']})

db.auth('user','pass')
```

> 2 prod

```
//create admin

use admin
db.createUser({user:'ccnuyan',pwd:'h6b8r4l6',roles:['userAdminAnyDatabase','dbAdminAnyDatabase']})
db.auth('ccnuyan','h6b8r4l6')

//create user

use syncollege
db.createUser({user:'syncollege',pwd:'bx6ht',roles:['dbAdmin','readWrite']})
```
# backup & restore

## backup
```
mongodump --host $MONGO_PROD_HOST -u $MONGO_PROD_ADMIN_USER -p $MONGO_PROD_ADMIN_PASS --out ./backup/starc3_db
```

## restore
```
mongorestore --host $MONGO_PROD_HOST -u $MONGO_PROD_ADMIN_USER -p $MONGO_PROD_ADMIN_PASS --drop ./backup/starc3_db
```

# CONFIDENTIAL

## Syncollege Server Side
- userAdmin : ccnuyan/h6b8r4l6
- dbAdmin : syncollege/bx6ht

## Local Side
- userAdmin : dbadmin/adminpass
- dbAdmin : user/pass
