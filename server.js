import { WebSocketServer } from 'ws';
import fetch from 'node-fetch';

const N8N_URL = process.env.N8N_URL;  // e.g. https://xyz.n8n.cloud/webhook/twilio-media
const PORT    = process.env.PORT || 8080;

// Create a WebSocket server using the WebSocketServer class
const wss = new WebSocketServer({ port: PORT });
console.log(`Bridge listening on ws://0.0.0.0:${PORT}`);

wss.on('connection', ws => {
  ws.on('message', async raw => {
    try {
      const data = JSON.parse(raw);
      // forward every media event to n8n via HTTP POST
      await fetch(N8N_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (e) {
      console.error('bridge error:', e);
    }
  });
});
