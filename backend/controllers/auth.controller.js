const usersQueries = require('../queries/users.queries');
const argon2 = require('../configs/argon2.config');

exports.signup = async (req, res, next) => {
  try {
    await usersQueries.createUser(req.body);
    return res.status(201).json({ message: 'Utilisateur créé' });
  } catch (err) {
    return res.status(500).json({ error: `500 : ${err.message}` });
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = await usersQueries.findUser(req.body);
    if (!user) {
      return res.status(401).json({ error: '401 : Utilisateur non trouvé' });
    }
    const passwordIsValid = await argon2.verifyPassword(req.body.password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ error: '401 : Mot de passe incorrect' });
    }
    return res.status(200).json({
      userId: user._id,
      token: 'TOKENISOK',
    });
  } catch (err) {
    return res.status(500).json({ error: `500 : ${err.message}` });
  }
};
