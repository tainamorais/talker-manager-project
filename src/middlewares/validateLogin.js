const isEmailValid = (email) => (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email));
const invalidPassword = (password) => password.length < 6 || password === null;

module.exports = (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  }
  if (!isEmailValid(email)) {
    return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  if (!password) {
    return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  }
  if (invalidPassword(password)) {
    return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  
  next();
};

/*
Consulta regex email:
https://www.w3resource.com/javascript/form/email-validation.php
Obs: Tive que retirar 2 \ que o linter estava reclamando.
*/
