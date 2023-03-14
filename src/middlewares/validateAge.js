module.exports = (req, res, next) => {
  const { age } = req.body;
  const isInteger = Number.isInteger(age);
  const isNumberGreaterThan18 = age >= 18;

  if (!age) {
    return res.status(400).json({ message: 'O campo "age" é obrigatório' });
  }

  if (!isInteger || !isNumberGreaterThan18) {
    return res.status(400)
      .json({ message: 'O campo "age" deve ser um número inteiro igual ou maior que 18' });
  }

  next();
};
