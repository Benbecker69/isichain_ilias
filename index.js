const express = require('express');
const Blockchain = require('./blockchain');
const P2PServer = require('./app/p2p-server');

const app = express();
const blockchain = new Blockchain();
const p2pServer = new P2PServer(blockchain);

app.use(express.json());

app.get('/blocks', (req, res) => {
  res.json(blockchain.chain);
});

app.post('/mine', (req, res) => {
  const { data } = req.body;
  const block = blockchain.addBlock(data);
  p2pServer.syncChains(); // <- synchronisation après ajout
  res.json({ message: 'Block added!', block });
});

const PORT = process.env.HTTP_PORT || 3001;
app.listen(PORT, () => {
  console.log(`HTTP server listening on port ${PORT}`);
});

p2pServer.listen();
