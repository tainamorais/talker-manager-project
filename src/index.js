const express = require('express');
const readFile = require('./utils/readFile');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

// REQ. 02: LISTAR TALKER PELO ID
app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talkers = await readFile();
  const talkerId = talkers.find((talker) => talker.id === Number(id));
  if (!talkerId) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  return res.status(200).json(talkerId);
});

// REQ. 01: LISTAR TODOS OS TALKERS
app.get('/talker', async (_req, res) => {
  const talkers = await readFile();
  res.status(200).json(talkers);
});
