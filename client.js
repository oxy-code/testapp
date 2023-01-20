const { io } = require("socket.io-client");

function createClient(port) {
    const socket = io(`http://localhost:${port}`);
    socket.on('connect', () => {
        console.log('Client connected: '+ socket.id);
    });
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    })
    socket.on('heartbeat', (data) => {
        console.log(`EVENT(HeartBeat) DATA ==> ${JSON.stringify(data)}`);
    })
    socket.on('Subscribe', (data) => {
        console.log(`EVENT(Subscribe) DATA ==> ${JSON.stringify(data)}`);
    })
    socket.on('Unsubscribe', (data) => {
        console.log(`EVENT(Unsubscribe) DATA ==> ${JSON.stringify(data)}`);
    })
    socket.on('CountSubscribers', (data) => {
        console.log(`EVENT(CountSubscribers) DATA ==> ${JSON.stringify(data)}`);
    })
    return socket;
}

module.exports = {
    createClient
};