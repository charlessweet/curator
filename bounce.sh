pm2 stop curator
pm2 delete curator
pm2 start server.js --name curator -i max
