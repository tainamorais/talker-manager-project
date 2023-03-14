const express = require('express');

const readFile = require('./utils/readFile');
const writeFile = require('./utils/writeFile');
const generateToken = require('./utils/generateToken');
const validateLogin = require('./middlewares/validateLogin');
const validateAuth = require('./middlewares/validateAuth');
const validateName = require('./middlewares/validateName');
const validateAge = require('./middlewares/validateAge');
const { validateTalk, validateRate } = require('./middlewares/validateTalk');

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

// REQ. 07: DELETAR TALKER PELO ID
app.delete('/talker/:id', validateAuth, async (req, res) => {
  const { id } = req.params;
  const talkers = await readFile();
  const filteredTalkers = talkers.filter((talker) => talker.id !== Number(id));
  const updatedTalkers = JSON.stringify(filteredTalkers, null, 2);
  await writeFile(updatedTalkers);
  return res.status(204).end();
});

// REQ. 05: CADASTRAR NOVO TALKER
app.post('/talker', validateAuth, validateName, validateAge, validateTalk,
  validateRate, async (req, res) => {
  const { name, age, talk: { watchedAt, rate } } = req.body;
  const talkers = await readFile();

  const newTalker = { id: talkers.length + 1, name, age, talk: { watchedAt, rate } };
  // const allTalkers = JSON.stringify([...talkers, newTalker]); - não funcionou
  talkers.push(newTalker);
  await writeFile(talkers);

  return res.status(201).json(newTalker);
});

// REQ. 03: ROTA LOGIN E RETORNO TOKEN
// REQ. 04: MIDDLEWARE VALIDAÇÃO LOGIN
app.post('/login', validateLogin, (_req, res) => {
  const token = generateToken();
  return res.status(200).json({ token });
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
