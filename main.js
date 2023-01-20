const { createSocketServer } = require('./server');
const { createClient } = require('./client');

createSocketServer(process.env.PORT || 3000);
const client = createClient(process.env.PORT || 3000);

// Request to Server
client.emit('message', {type: 'Subscribe'});
client.emit('message', {type: 'Subscribe'});
client.emit('message', {type: 'Subscribe'});
client.emit('message', {type: 'Subscribe'});
client.emit('message', {type: 'Subscribe'});
client.emit('message', {type: 'Unsubscribe'});
client.emit('message', {type: 'Unsubscribe'});
client.emit('message', {type: 'CountSubscribers'});

setTimeout(()=>{
    client.close();
    process.exit();
}, 20000)
