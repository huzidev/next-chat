import express from 'express';
import http from 'http';
import next from 'next';
import socketHandler from './socket/socket.js';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

console.log("Server request called");

app.prepare().then(() => {
    const server = express();
    const httpServer = http.createServer(server);

    console.log('Setting up socket handler...');
    socketHandler(httpServer); 

    server.all('*', (req, res) => {
        return handle(req, res);
    });

    console.log('Starting server on port 4000...');
    httpServer.listen(4000, (err) => {
        if (err) throw err;
        console.log('> Ready on http://localhost:4000');
    });
});
