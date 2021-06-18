const express = require('express');
const favicon = require('serve-favicon')
const app = express();
const http = require('http');
const fs = require('fs');
var cookieParser = require('cookie-parser');

const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

var debug = fs.createWriteStream('./!logs/errors.log');
process.stdout.write = debug.write.bind(debug);

app.use(cookieParser());



server.listen(3000, () => {
    console.log('listening on *:3000');
});