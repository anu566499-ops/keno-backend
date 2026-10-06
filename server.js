const express = require('express');
const { Server } = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

let drawId = 890777374;
let history = [];

function draw() {
  const balls = [];
  while (balls.length < 20) {
    const n = Math.floor(Math.random() * 80) + 1;
    if (!balls.includes(n)) balls.push(n);
  }
  return balls;
}

function newRound() {
  drawId++;
  const balls = draw();
  const entry = { id: drawId, time: new Date().toISOString().slice(11, 19), balls };
  history.unshift(entry);
  if (history.length > 100) history.pop();
  io.emit('draw', entry);
  console.log('draw', entry.id);
}

setInterval(newRound, 90000);
newRound();

app.get('/history', (req, res) => res.json(history));
app.get('/current', (req, res) => res.json(history[0]));

server.listen(3000, () => console.log('mock keno backend on :3000'));
