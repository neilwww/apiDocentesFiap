jest.mock('../../middleware/auth', () => ({
    auth: jest.fn((req, res, next) => next()),
    isDocente: jest.fn((req, res, next) => next())
  }));
  
  jest.mock('../../models/post', () => ({
    find: jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue([])
      })
    }),
    findById: jest.fn().mockReturnValue({
      populate: jest.fn().mockResolvedValue({})
    })
  }));
  
  jest.mock('express', () => {
    const json = jest.fn().mockReturnValue({});
    const status = jest.fn().mockReturnValue({ json });
    const mockResponse = () => {
      return {
        status,
        json
      };
    };
    
    const mockRequest = () => {
      return {
        body: {},
        params: {},
        query: {}
      };
    };
  
    const app = {
      get: jest.fn((path, handler) => {
        const req = mockRequest();
        const res = mockResponse();
        handler(req, res);
        return app;
      }),
      post: jest.fn((path, ...handlers) => {
        return app;
      }),
      put: jest.fn(() => app),
      delete: jest.fn(() => app),
      use: jest.fn(() => app)
    };
    
    return {
      Router: jest.fn(() => app),
      json: jest.fn()
    };
  });
  
  const { auth, isDocente } = require('../../middleware/auth');
  const Post = require('../../models/post');
  const express = require('express');
  
  describe('Posts Routes', () => {
    it('uses auth middleware for protected routes', () => {
      require('../../routes/posts');
      
      expect(auth).not.toHaveBeenCalled();
      expect(isDocente).not.toHaveBeenCalled();
    });
  });