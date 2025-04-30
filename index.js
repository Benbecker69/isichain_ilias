const express = require('express');
const Blockchain = require('./blockchain');

const app = express();
const blockchain = new Blockchain();

app.use(express.json());

app.get('/blocks', (req, res) => {
  res.json(blockchain.chain);
});

app.post('/mine', (req, res) => {
  const { data } = req.body;
  const block = blockchain.addBlock(data);
  res.json({ message: 'Block added!', block });
});

const PORT = process.env.HTTP_PORT || 3001;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
