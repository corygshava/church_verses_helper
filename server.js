const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const b_Parser = require('body-parser');

// my codes
const router = require('./res/router.js')

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const portno = 55771;

// Serve static files
app.use(express.static('public'));

// handle APIs
app.use(b_Parser.json())

app.use((req, res, next) => {
    let callid = Number(Math.random().toFixed(7).toString().replaceAll("0.","")).toString(30);

    if(req.path.startsWith("/api_")){
        console.log(`[${callid} | ${req.path}] -> API attempt detected!`);
        // console.log(req.body);

        router.handlereq(req.originalUrl,req.body,(m) => {
            res.json(m);
        })
        .then((rr) => {
            console.log(`[${callid} | ${req.path}] -> done with API call -> ${/*JSON.stringify(rr)*/"we good!"}`);
        })
    } else {
        console.log(`[${callid} | ${req.path}] -> Calling static asset!`);
    }
})

// create a websocket listener
wss.on('connection', (ws) => {
    let callid = "SOC_" + Number(Math.random().toFixed(7).toString().replaceAll("0.","")).toString(30);
    console.log(`[${callid}] -> Connection established!`);

    ws.on('message', (message) => {
        // Broadcast message to all clients
        console.log(`[${callid}] -> Message recieved!`);

        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    });
});

server.listen(portno, () => console.log(`Server running on http://localhost:${portno}`));
