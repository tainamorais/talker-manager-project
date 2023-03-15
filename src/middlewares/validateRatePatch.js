/*
Tive que criar outra validação, pois a anterior estava com falhas e gabiarras.
Refatorar, posteriormente, a outra validação referente ao talker. Unificar!
*/

module.exports = (req, res, next) => {
  const { rate } = req.body;
  // Algo acima não estava funcionando na outra função
  // console.log(rate);
  if (rate === undefined) return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
  
  if (!(Number.isInteger(rate)) || rate < 1 || rate > 5) {
    return res.status(400)
      .json({ message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' });
  }
  next();
};
