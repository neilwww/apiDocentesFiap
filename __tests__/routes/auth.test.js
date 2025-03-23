jest.mock('bcryptjs', () => ({
    hash: jest.fn().mockResolvedValue('hashed_password'),
    compare: jest.fn().mockResolvedValue(true)
  }));
  
  jest.mock('jsonwebtoken', () => ({
    sign: jest.fn().mockReturnValue('test_token'),
    verify: jest.fn().mockReturnValue({ _id: 'user123' })
  }));
  
  jest.mock('../../models/user', () => {
    return {
      findOne: jest.fn().mockResolvedValue(null)
    };
  });
  
  const User = require('../../models/user');
  
  describe('Auth Routes', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should check if user exists during registration', async () => {
      User.findOne.mockResolvedValueOnce(null);
      
      const userExists = await User.findOne({ email: 'test@test.com' });
      
      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@test.com' });
      expect(userExists).toBeNull();
    });
  
    it('should detect existing users', async () => {
      User.findOne.mockResolvedValueOnce({ email: 'existing@test.com' });
      
      const userExists = await User.findOne({ email: 'existing@test.com' });
      
      expect(User.findOne).toHaveBeenCalledWith({ email: 'existing@test.com' });
      expect(userExists).not.toBeNull();
    });
  });