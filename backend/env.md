# get current environment config
firebase functions:config:get

#setting firebase env variables
firebase functions:config:set mysql.user="MYSQL_USER" mysql.password="MYSQL_PASSWORD" mysql.database="MYSQL_DATABASE" mysql.host="MYSQL_HOST" mysql.port="MYSQL_PORT" mysql.socketpath="MYSQL_SOCKETPATH"

#if socketpath is provided, that one will be used

#write the config variables to a local env file
firebase functions:config:get > ./env.json