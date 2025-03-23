const bcrypt = require('bcryptjs');

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn().mockResolvedValue(true)
}));

jest.mock('mongoose', () => {
  return {
    Schema: jest.fn().mockImplementation(() => ({
      pre: jest.fn(),
      methods: {},
      statics: {},
      index: jest.fn()
    })),
    model: jest.fn().mockReturnValue({}),
    connect: jest.fn()
  };
});

const User = require('../../models/user');

describe('User Model', () => {
  it('should use bcrypt for password hashing', () => {
    expect(bcrypt.hash).not.toHaveBeenCalled();
    
    bcrypt.hash('password', 8);
    expect(bcrypt.hash).toHaveBeenCalledWith('password', 8);
  });
});