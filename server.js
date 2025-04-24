import WebSocket from 'ws'
import fetch from 'node-fetch'

const N8N_URL = process.env.N8N_URL
const PORT    = process.env.PORT || 8080

const wss = new WebSocket.Server({ port: PORT })
console.log(`Bridge listening on ws://0.0.0.0:${PORT}`)

wss.on('connection', ws => {
  ws.on('message', async raw => {
    try {
      const data = JSON.parse(raw)
      await fetch(N8N_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    } catch (e) {
      console.error('bridge error:', e)
    }
  })
})
