import { useEffect } from 'react';
import io from 'socket.io-client';

let socket;

export const useSocket = () => {
    useEffect(() => {
        socket = io();

        socket.on('receive_message', (data) => {
            console.log('Received message:', data);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const sendMessage = (data) => {
        socket.emit('send_message', data); // Emit the message to the server
    };

    return { sendMessage };
};
