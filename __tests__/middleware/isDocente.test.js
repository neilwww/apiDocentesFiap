jest.mock('../../models/user', () => ({
    findById: jest.fn()
  }));
  
  const User = require('../../models/user');
  const isDocente = require('../../middleware/isDocente');
  
  describe('isDocente Middleware', () => {
    let req, res, next;
    
    beforeEach(() => {
      jest.clearAllMocks();
      
      req = {
        body: {},
        query: {},
        headers: {}
      };
      
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      next = jest.fn();
    });
    
    test('returns 403 when no user ID is provided', async () => {
      await isDocente(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining('ID do usuário não fornecido')
      }));
      expect(next).not.toHaveBeenCalled();
    });
    
    test('returns 404 when user is not found', async () => {
      req.body.author = 'nonexistent';
      User.findById.mockResolvedValue(null);
      
      await isDocente(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Usuário não encontrado'
      }));
    });
    
    test('returns 403 when user is not a docente', async () => {
      req.body.author = 'student123';
      User.findById.mockResolvedValue({ role: 'aluno' });
      
      await isDocente(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining('apenas docentes podem realizar esta ação')
      }));
    });
    
    test('calls next() when user is a docente', async () => {
      req.body.author = 'professor123';
      User.findById.mockResolvedValue({ 
        _id: 'professor123',
        role: 'docente' 
      });
      
      await isDocente(req, res, next);
      
      expect(next).toHaveBeenCalled();
      expect(req.user).toBeDefined();
    });
    
    test('finds user ID from query params', async () => {
      req.query.author = 'professor123';
      User.findById.mockResolvedValue({ 
        _id: 'professor123',
        role: 'docente' 
      });
      
      await isDocente(req, res, next);
      
      expect(User.findById).toHaveBeenCalledWith('professor123');
      expect(next).toHaveBeenCalled();
    });
    
    test('handles database errors', async () => {
      req.body.author = 'professor123';
      User.findById.mockRejectedValue(new Error('Database error'));
      
      await isDocente(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Erro ao verificar permissões'
      }));
    });
  });