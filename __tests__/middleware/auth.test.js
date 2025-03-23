const jwt = require('jsonwebtoken');
const { auth, isDocente } = require('../../middleware/auth');

jest.mock('jsonwebtoken');
jest.mock('../../models/user', () => ({
  findOne: jest.fn()
}));
const User = require('../../models/user');

describe('Auth Middleware', () => {
  let req, res, next;
  
  beforeEach(() => {
    req = {
      header: jest.fn()
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('auth middleware', () => {
    it('should set req.user and req.token if authentication is successful', async () => {
      const user = {
        _id: 'user123',
        username: 'testuser',
        role: 'docente'
      };
      
      User.findOne.mockResolvedValue(user);
      
      jwt.verify.mockReturnValue({ _id: 'user123' });
      
      req.header.mockReturnValue('Bearer test-token');
      
      await auth(req, res, next);
      
      expect(req.user).toEqual(user);
      expect(req.token).toBe('test-token');
      expect(next).toHaveBeenCalled();
    });

    it('should return 401 if Authorization header is missing', async () => {
      req.header.mockReturnValue(undefined);
      
      await auth(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Autenticação necessária' });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('isDocente middleware', () => {
    it('should call next if user is a docente', async () => {
      req.user = {
        role: 'docente'
      };
      
      await isDocente(req, res, next);
      
      expect(next).toHaveBeenCalled();
    });

    it('should return 403 if user is not a docente', async () => {
      req.user = {
        role: 'aluno'
      };
      
      await isDocente(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });
  });
});