const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const b_Parser = require('body-parser');

// my codes
const router = require('./res/router.js')

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files
app.use(express.static('public'));

// handle APIs
app.use(b_Parser.json())

app.use((req, res, next) => {
    if(req.path.startsWith("/api_")){
        console.log('API attempt detected!');

        console.log(router);

        router.handlereq(req.originalUrl,req.body,(m) => {
            res.json(m);
        })
    }
})

// create a websocket listener
wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        // Broadcast message to all clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    });
});

server.listen(3000, () => console.log('Server running on http://localhost:3000'));
