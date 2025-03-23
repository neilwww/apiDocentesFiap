const User = require('../models/user');


const isDocente = async (req, res, next) => {
  try {
    const userId = req.body.author || req.query.author || req.headers['x-user-id'];
    
    if (!userId) {
      return res.status(403).json({ message: 'Acesso negado: ID do usuário não fornecido. Adicione "author" no corpo da requisição.' });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    if (user.role !== 'docente') {
      return res.status(403).json({ message: 'Acesso negado: apenas docentes podem realizar esta ação' });
    }
    
    req.user = user;
    
    next();
  } catch (error) {
    res.status(500).json({ message: 'Erro ao verificar permissões', error: error.message });
  }
};

module.exports = isDocente;