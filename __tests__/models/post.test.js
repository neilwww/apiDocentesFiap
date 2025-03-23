jest.mock('mongoose', () => {
    const mockSchema = function() {
      return {
        index: jest.fn().mockReturnThis()
      };
    };
    
    mockSchema.Types = {
      ObjectId: 'ObjectId'
    };
    
    return {
      Schema: mockSchema,
      model: jest.fn().mockReturnValue({})
    };
  });
  
  const mongoose = require('mongoose');
  const Post = require('../../models/post');
  
  describe('Post Model', () => {
    it('should create a model with correct name', () => {
      expect(mongoose.model).toHaveBeenCalledWith('Post', expect.any(Object));
    });
  });