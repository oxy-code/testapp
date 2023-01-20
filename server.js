const { Server } = require("socket.io");
const { createServer } = require('http');

let subscribersCount = 0;

function handleSubscribe(socket) {
    subscribersCount++;
    setTimeout(() => {
        socket.emit('Subscribe', {
            type: "Subscribe",
            status: "Subscribed",
            updatedAt: (new Date()).toISOString()
        });
    }, 4000)
}

function handleUnsubscribe(socket) {
    subscribersCount--;
    setTimeout(() => {
        socket.emit('Unsubscribe', {
            type: "Unsubscribe",
            status: "Unsubscribed",
            updatedAt: (new Date()).toISOString()
        });
    }, 8000)
}

function handleCountSubscribers(socket) {
    socket.emit('CountSubscribers', {
        type: "CountSubscribers",
        count: subscribersCount,
        updatedAt: (new Date()).toISOString()
    });
}

function handleRequest(socket) {
    socket.on('message', (data) => {
        if (typeof data === 'object' && !Array.isArray(data) && data !== null && data.type) {
            console.log(`Input Method: ${data.type}`)
            switch(data.type) {
                case 'Subscribe':
                    handleSubscribe(socket)
                    break;
                case 'Unsubscribe':
                    handleUnsubscribe(socket)
                    break;
                case 'CountSubscribers':
                    handleCountSubscribers(socket)
                    break;
                default:
                    console.log({
                        type: 'Error',
                        error: "Requested method not implemented",
                        updatedAt: (new Date()).toISOString()
                    });
                    socket.emit('data_error', {
                        type: 'Error',
                        error: "Requested method not implemented",
                        updatedAt: (new Date()).toISOString()
                    });
                    break;
            }
        }
        else {
            socket.emit('data_error', {
                type: 'Error',
                error: "Bad formatted payload, non JSON",
                updatedAt: (new Date()).toISOString()
            });
            console.log({
                type: 'Error',
                error: "Bad formatted payload, non JSON",
                updatedAt: (new Date()).toISOString()
            });
        }
    })
}

function createSocketServer(port) {
    const httpServer = createServer();
    const serverIO = new Server(httpServer);
    serverIO.on('connection', (socket) => {
        console.log(`connection established -- ${socket.id}`);
    
        setInterval(()=>{
            socket.emit('heartbeat', {
                type: "HeartBeat",
                updatedAt: (new Date()).toISOString()
            })
        }, 1000);
    
        handleRequest(socket);
    });
    return new Promise(resolve => {
        httpServer.listen(port, () => resolve(serverIO));
    });
}

module.exports = {
    createSocketServer
};