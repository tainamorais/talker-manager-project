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

// REQ. 08: SEARCH TALKER QUERYPARAM
app.get('/talker/search', validateAuth, async (req, res) => {
  const { q } = req.query;
  const talkers = await readFile();
  const filteredTalkers = talkers.filter((talker) => talker.name.includes(q));
  return res.status(200).json(filteredTalkers);
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

// REQ. 06: EDITAR TALKER PELO ID
app.put('/talker/:id', validateAuth, validateName, validateAge, validateTalk,
  validateRate, async (req, res) => {
  const { id } = req.params;
  const { name, age, talk: { watchedAt, rate } } = req.body;
  const talkers = await readFile();
  const index = talkers.findIndex((talker) => talker.id === Number(id));
  if (!talkers[index]) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  talkers[index] = { id: Number(id), name, age, talk: { watchedAt, rate } };
  await writeFile(talkers);
  return res.status(200).json(talkers[index]);
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

/*
Fonte de consulta da maior parte dos requisitos:
https://app.betrybe.com/learn/course/5e938f69-6e32-43b3-9685-c936530fd326/module/94d0e996-1827-4fbc-bc24-c99fb592925b/section/2ed87e4f-9049-4314-8091-8f71b1925cf6/day/4982a599-9832-419e-a96b-3fe1db634c3e/lesson/9caf3f05-59f1-4959-8f92-bfe0ff66f49c/solution
*/