const { createSocketServer } = require('./server');
const { createClient } = require('./client');

describe(`Integration Test Suite`, () => {
    let server, client;

    beforeAll(async () => {
        server = await createSocketServer(process.env.PORT || 3000);
    });

    beforeEach((done)=>{
        client = createClient(process.env.PORT || 3000);
        client.on('connect', done);
    });

    it(`should subscribe in 4 secs`, (done) => {
        const now = Math.round(Date.now()/1000);
        client.emit('message', { type: 'Subscribe' });
        client.on('Subscribe', (data) => {
            const updatedAt = Math.round(new Date(data.updatedAt).getTime()/1000);
            expect(data.status).toBe('Subscribed');
            expect(updatedAt - now).toBe(4);
            done();
        })
    });

    it(`should subscribe in 4 secs`, (done) => {
        const now = Math.round(Date.now()/1000);
        client.emit('message', { type: 'Subscribe' });
        client.on('Subscribe', (data) => {
            const updatedAt = Math.round(new Date(data.updatedAt).getTime()/1000);
            expect(data.status).toBe('Subscribed');
            expect(updatedAt - now).toBe(4);
            done();
        })
    });

    it(`should unsubscribe in 8 secs`, (done) => {
        const now = Math.round(Date.now()/1000);
        client.emit('message', { type: 'Unsubscribe' });
        client.on('Unsubscribe', (data) => {
            const updatedAt = Math.round(new Date(data.updatedAt).getTime()/1000);
            expect(data.status).toBe('Unsubscribed');
            expect(updatedAt - now).toBe(8);
            done();
        })
    });

    it(`should return the subscribers count`, (done) => {
        client.emit('message', { type: 'CountSubscribers' });
        client.on('CountSubscribers', (data) => {
            expect(data.count).toBe(1);
            done();
        })
    });

    it(`should see heartbeat`, (done) => {
        client.on('heartbeat', (data) => {
            expect(data.type).toBe('HeartBeat');
            done();
        })
    });

    it(`should return data error: Non JSON payload`, (done) => {
        client.emit('message', null);
        client.on('data_error', (data) => {
            expect(data.error).toBe('Bad formatted payload, non JSON');
            done();
        })
    });

    it(`should return data error: Invalid method`, (done) => {
        client.emit('message', { type: 'GET_COUNT'});
        client.on('data_error', (data) => {
            expect(data.error).toBe('Requested method not implemented');
            done();
        });
    });
});