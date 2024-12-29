import { Server } from 'socket.io';

let io;

const socketHandler = (httpServer) => {
    if (httpServer.io) {
        console.log('Socket is already running');
        return;
    }

    io = new Server(httpServer);

    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.on('send_message', (data) => {
            const { senderId, receiverId, content } = data;
            io.emit('receive_message', { senderId, receiverId, content });
        });

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });

    console.log('Setting up socket...');
    httpServer.io = io;
};

export default socketHandler;
